<?php

include("modules/dataaccess.php");
//mysqli_report(MYSQLI_REPORT_ERROR);

header("Access-Control-Allow-Origin: *");

$id = $_GET['id'];
$src = $_GET['src'];

$year = $_GET['year'];
$season = $_GET['season'];

$requests = $_POST['requests'];

if ($requests != "") {
    $list = json_decode($requests, true);
    $ret = [];
    foreach ($list as $item) {
        array_push($ret, HandleRequest($item));
    }
    echo json_encode($ret);
    return;
}

function HandleRequest($request)
{
    $parms = $request["Parameters"];
    switch ($request["Key"]) {
        case "profiles":
            //Add function to prep responses so they are standardized
            return GetAndReturnJSON('SELECT PlayerID, PlayerName FROM Player WHERE Token = ?', [$parms["token"]]);
        case "players":
            return GetAndReturnJSON('SELECT PlayerID, PlayerName FROM Player');
        case "games": {
                $p1id = $parms['p1'];
                $p2id = $parms['p2'];
                $where = 'GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ' . $p1id . ')';
                $where .= ' AND GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ' . $p2id . ')';
                $ret = ["success" => true, "content" => GetGames($where)];
                return $ret;
            }
        default:
            return "hubget: Unrecognized key (" + $request["Key"] + ")";
    }
}

function GetAndReturnJSON($sql, $parameters = null)
{

    $ret = ["success" => false];
    // $ret["sql"] = $sql;
    // $ret["parameters"] = $parameters;

    $conn = dbn_GetConnection();
    $statement = $conn->prepare($sql);

    if ($statement === false) {
        $ret["message"] = $conn->error;
        return $ret;
    }

    if ($parameters != null) {
        $types = "";
        foreach ($parameters as $value) {
            switch (gettype($value)) {
                case 'string':
                    $types .= "s";
                    break;
                case 'integer':
                    $types .= "i";
                    break;
                case 'double':
                    $types .= "d";
                    break;
                default:
                    $ret["message"] = "Unsupported parameter type: " . gettype($value);
                    return $ret;
                    break;
            }
        }

        if (($statement->bind_param($types, ...$parameters)) === false) {
            $ret["message"] = $conn->error;
            return $ret;
        }
    }

    if (($statement->execute()) === false) {
        $ret["message"] = $conn->error;
        return $ret;
    }

    $result = $statement->get_result();

    if ($result === false) {
        $ret["message"] = $conn->error;
        return $ret;
    }

    $fields = [];
    foreach ($result->fetch_fields() as &$field) {
        $ff = [];
        $ff["name"] = $field->name;
        array_push($fields, $ff);
    }
    unset($field);

    $content = [];
    $content["fields"] = $fields;

    $data = [];
    while ($row = $result->fetch_assoc()) {
        array_push($data, array_values($row));
    }

    $content["data"] = $data;

    $ret["content"] = $content;
    $ret["success"] = true;

    return $ret;
}

function GetGames($where)
{
    $sql = 'SELECT G.GameID, G.Label, G.EndDate, G.DrawSize, G.GameYearsCompleted, G.GamePlatform_GamePlatformID, G.GamePlatformIdentifier';
    $sql .= ', C.CompetitionID, C.CompetitionName';
    $sql .= ', P.PlayerID, P.PlayerName';
    $sql .= ', CO.CountryName, GCP.Note';
    $sql .= ', GCR.InGameAtEnd, GCR.CenterCount, GCR.YearOfElimination, GCR.UnexcusedResignation';
    $sql .= ', GCC.Score, GCC.Rank, GCC.RankScore, GCC.TopShare';

    $sql .= ' FROM Game as G';
    $sql .= ' INNER JOIN Competition as C on G.Competition_CompetitionID = C.CompetitionID';
    $sql .= ' INNER JOIN GameCountryPlayer as GCP on GCP.Game_GameID = G.GameID';
    $sql .= ' INNER JOIN GameCountryResult as GCR on GCR.Game_GameID = G.GameID AND GCP.Country_CountryID = GCR.Country_CountryID';
    $sql .= ' INNER JOIN GameCountryComputations as GCC on GCC.Game_GameID = G.GameID AND GCP.Country_CountryID = GCC.Country_CountryID';
    $sql .= ' INNER JOIN Player as P on GCP.PlayerOfRecord_PlayerID = P.PlayerID';
    $sql .= ' INNER JOIN Country as CO on GCP.Country_CountryID = CO.CountryID';
    $sql .= ' WHERE ' . $where;
    $sql .= ' ORDER BY G.GameID, CO.CountryName';

    $conn = dbn_GetConnection();
    $result = $conn->query($sql);

    if (!$result) {
        return $conn->error;
    } else {

        $games = [];
        $game = null;
        $gamekey = null;
        $lines = null;

        while ($row = $result->fetch_assoc()) {
            $gamekey = "game" . $row["GameID"];
            if (!array_key_exists($gamekey, $games)) {
                $game = [
                    "GameID" => $row["GameID"], "Label" => $row["Label"], "EndDate" => $row["EndDate"], "DrawSize" => $row["DrawSize"], "GameYearsCompleted" => $row["GameYearsCompleted"], "Competition" => ["CompetitionID" => $row["CompetitionID"], "CompetitionName" => $row["CompetitionName"]]
                ];

                switch ($row["GamePlatform_GamePlatformID"]) {
                    case 0:
                        $game["Platform"] = "In person";
                        break;

                    case 1:
                        $game["Platform"] = "Backstabbr";
                        $game["URL"] = 'https://www.backstabbr.com/game/' . $row["GamePlatformIdentifier"];
                        break;

                    default:
                        $game["Platform"] = "Unknown";
                        break;
                }

                $games[$gamekey] = $game;
                $lines = [];
            }

            $line = [
                "Player" => ["PlayerID" => $row["PlayerID"], "PlayerName" => $row["PlayerName"]], "Country" => $row["CountryName"], "Note" => $row["Note"], "CenterCount" => $row["CenterCount"], "InGameAtEnd" => $row["InGameAtEnd"], "YearOfElimination" => $row["YearOfElimination"], "UnexcusedResignation" => $row["UnexcusedResignation"], "Score" => $row["Score"], "Rank" => $row["Rank"], "RankScore" => $row["RankScore"], "TopShare" => $row["TopShare"]
            ];

            $lines[$line["Country"]] = $line;
            // array_push($lines, $line);
            $game["ResultLines"] = $lines;
            $games[$gamekey] = $game;
        }

        return array_values($games);
    }
}

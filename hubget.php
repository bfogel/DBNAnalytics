<?php

include("modules/dataaccess.php");
//mysqli_report(MYSQLI_REPORT_ERROR);

header("Access-Control-Allow-Origin: *");

class ResultSet
{
    public $success = false;
    public $fields = [];
    public $data = [];
    public $message = null;

    function __construct($sql = null, $parameters = null)
    {
        if ($sql != null) $this->Retrieve($sql, $parameters);
    }

    public function GetFieldIndex($fieldname)
    {
        $i = 0;
        foreach ($this->fields as $value) {
            if ($value["name"] == $fieldname) return $i;
            $i++;
        }
        return -1;
    }

    public function ToJSON()
    {
        $ret = [];
        $ret["success"] = $this->success;
        $ret["message"] = $this->message;
        $ret["content"] = ["fields" => $this->fields, "data" => $this->data];
        return $ret;
    }

    private function Retrieve($sql, $parameters = null)
    {
        $this->success = false;

        $conn = dbn_GetConnection();
        $statement = $conn->prepare($sql);

        if ($statement === false) {
            $this->message = $conn->error;
            return;
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
                        $this["message"] = "Unsupported parameter type: " . gettype($value);
                        return;
                }
            }

            if (($statement->bind_param($types, ...$parameters)) === false) {
                $this->message = $conn->error;
                return;
            }
        }

        if (($statement->execute()) === false) {
            $this->message = $conn->error;
            return;
        }

        $result = $statement->get_result();

        if ($result === false) {
            $this->message = $conn->error;
            return;
        }

        $fields = [];
        foreach ($result->fetch_fields() as &$field) {
            $ff = [];
            $ff["name"] = $field->name;
            array_push($fields, $ff);
        }
        unset($field);

        $this->fields = $fields;

        $data = [];
        while ($row = $result->fetch_assoc()) {
            array_push($data, array_values($row));
        }

        $this->data = $data;
        $this->success = true;
    }
}

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
            return GetResultsetAsJSON('SELECT PlayerID, PlayerName FROM Player WHERE Token = ?', [$parms["token"]]);
        case "players":
            return GetResultsetAsJSON('SELECT PlayerID, PlayerName FROM Player');
        case "games": {
                $where = 'GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ?)';
                $where .= ' AND GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ?)';
                $games = GetGames($where, [$parms['p1'], $parms['p2']]);

                if ($games instanceof ResultSet) return $games->ToJSON();
                return ["success" => true, "content" => $games];
            }
        default:
            return "hubget: Unrecognized key (" + $request["Key"] + ")";
    }
}

function GetResultsetAsJSON($sql, $parameters = null)
{
    $rs = new ResultSet($sql, $parameters);
    // $rs = GetResultset($sql, $parameters);
    return $rs->ToJSON();
}

function GetResultset($sql, $parameters = null)
{
    $ret = new ResultSet();
    $ret->success = false;

    $conn = dbn_GetConnection();
    $statement = $conn->prepare($sql);

    if ($statement === false) {
        $ret->message = $conn->error;
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
            $ret->message  = $conn->error;
            return $ret;
        }
    }

    if (($statement->execute()) === false) {
        $ret->message  = $conn->error;
        return $ret;
    }

    $result = $statement->get_result();

    if ($result === false) {
        $ret->message  = $conn->error;
        return $ret;
    }

    $fields = [];
    foreach ($result->fetch_fields() as &$field) {
        $ff = [];
        $ff["name"] = $field->name;
        array_push($fields, $ff);
    }
    unset($field);

    $ret->fields = $fields;

    $data = [];
    while ($row = $result->fetch_assoc()) {
        array_push($data, array_values($row));
    }

    $ret->data  = $data;

    $ret->success = true;

    return $ret;
}

function GetGames($where, $params)
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

    $rs = GetResultset($sql, $params);

    if (!$rs->success) return $rs;

    $cGameID = $rs->GetFieldIndex("GameID");
    $cLabel = $rs->GetFieldIndex("Label");
    $cEndDate = $rs->GetFieldIndex("EndDate");
    $cDrawSize = $rs->GetFieldIndex("DrawSize");
    $cGameYearsCompleted = $rs->GetFieldIndex("GameYearsCompleted");
    $cGamePlatform_GamePlatformID = $rs->GetFieldIndex("GamePlatform_GamePlatformID");
    $cGamePlatformIdentifier = $rs->GetFieldIndex("GamePlatformIdentifier");
    $cCompetitionID = $rs->GetFieldIndex("CompetitionID");
    $cCompetitionName = $rs->GetFieldIndex("CompetitionName");
    $cPlayerID = $rs->GetFieldIndex("PlayerID");
    $cPlayerName = $rs->GetFieldIndex("PlayerName");
    $cCountryName = $rs->GetFieldIndex("CountryName");
    $cNote = $rs->GetFieldIndex("Note");
    $cInGameAtEnd = $rs->GetFieldIndex("InGameAtEnd");
    $cCenterCount = $rs->GetFieldIndex("CenterCount");
    $cYearOfElimination = $rs->GetFieldIndex("YearOfElimination");
    $cUnexcusedResignation = $rs->GetFieldIndex("UnexcusedResignation");
    $cScore = $rs->GetFieldIndex("Score");
    $cRank = $rs->GetFieldIndex("Rank");
    $cRankScore = $rs->GetFieldIndex("RankScore");
    $cTopShare = $rs->GetFieldIndex("TopShare");

    $games = [];
    $game = null;
    $gamekey = null;
    $lines = null;

    foreach ($rs->data as $row) {
        $gamekey = "game" . $row[$cGameID];
        if (!array_key_exists($gamekey, $games)) {
            $game = [
                "GameID" => $row[$cGameID], "Label" => $row[$cLabel], "EndDate" => $row[$cEndDate], "DrawSize" => $row[$cDrawSize], "GameYearsCompleted" => $row[$cGameYearsCompleted], "Competition" => ["CompetitionID" => $row[$cCompetitionID], "CompetitionName" => $row[$cCompetitionName]]
            ];

            switch ($row[$cGamePlatform_GamePlatformID]) {
                case 0:
                    $game["Platform"] = "In person";
                    break;

                case 1:
                    $game["Platform"] = "Backstabbr";
                    $game["URL"] = 'https://www.backstabbr.com/game/' . $row[$cGamePlatformIdentifier];
                    break;

                default:
                    $game["Platform"] = "Unknown";
                    break;
            }

            $games[$gamekey] = $game;
            $lines = [];
        }

        $line = [
            "Player" => ["PlayerID" => $row[$cPlayerID], "PlayerName" => $row[$cPlayerName]], "Country" => $row[$cCountryName], "Note" => $row[$cNote], "CenterCount" => $row[$cCenterCount], "InGameAtEnd" => $row[$cInGameAtEnd], "YearOfElimination" => $row[$cYearOfElimination], "UnexcusedResignation" => $row[$cUnexcusedResignation], "Score" => $row[$cScore], "Rank" => $row[$cRank], "RankScore" => $row[$cRankScore], "TopShare" => $row[$cTopShare]
        ];

        $lines[$line["Country"]] = $line;
        // array_push($lines, $line);
        $game["ResultLines"] = $lines;
        $games[$gamekey] = $game;
    }

    return array_values($games);
}

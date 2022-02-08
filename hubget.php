<?php

include("modules/dataaccess.php");

header("Access-Control-Allow-Origin: *");

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
        case "bids": {
                $sql = 'SELECT P.PlayerName, CO.CountryName';
                $sql .= ', C.CompetitionID, C.CompetitionName';
                $sql .= ', B.Round, B.Bid';
                $sql .= ' FROM Player as P';
                $sql .= ' INNER JOIN PlayerCountryBid as B on B.Player_PlayerID = P.PlayerID';
                $sql .= ' INNER JOIN Competition as C on B.Competition_CompetitionID = C.CompetitionID';
                $sql .= ' INNER JOIN Country as CO on B.Country_CountryID = CO.CountryID';
                $sql .= ' WHERE P.Token = ?';
                return GetResultsetAsJSON($sql, [$parms["token"]]);
            }

        case "players": {
                $vars = null;
                $sql = "SELECT PlayerID, PlayerName FROM Player";

                $token = $parms["token"];
                if ($token != null) {
                    $sql .= ' WHERE Token = ?';
                    $vars = [$token];
                }
                return GetResultsetAsJSON($sql, $vars);
            }

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

    $rs = new ResultSet($sql, $params);

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

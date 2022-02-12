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

function IsZach($token)
{
    return $token == "b10a9bcf-9e4a-4d4a-8389-02d938edb3d5";
}

function CountryNameToID($country)
{
    switch ($country) {
        case 'Austria':
            return 0;
        case 'England':
            return 1;
        case 'France':
            return 2;
        case 'Germany':
            return 3;
        case 'Italy':
            return 4;
        case 'Russia':
            return 5;
        case 'Turkey':
            return 6;
        default:
            return -1;
    }
}

class UserInfo
{
    public $PlayerID = 0;
    public $PlayerName = "";
    function __construct($playerid, $playername)
    {
        $this->PlayerID = $playerid;
        $this->PlayerName = $playername;
    }
}

$_UserInfo = null;
function GetUserInfo($parameters): UserInfo
{
    global $_UserInfo;
    if ($_UserInfo == null) {

        if (array_key_exists("token", $parameters)) {
            $rs = new ResultSet("SELECT * FROM Player WHERE Token = ?", [$parameters["token"]]);
            if ($rs->success) {
                if (count($rs->data) > 0) {
                    $row = $rs->data[0];
                    $_UserInfo = new UserInfo($row[0], $row[1]);
                } else {
                    $_UserInfo = new UserInfo(0, "no data");
                }
            } else {
                $_UserInfo = new UserInfo(0, $rs->message);
            }
        } else {
            $_UserInfo = new UserInfo(0, "no token");
        }
    }
    return $_UserInfo;
}

//Should return a JSON object with expected fields set 
// (really you should define a response class with two subclasses SuccessResponse and FailureResponse)
function HandleRequest($request)
{
    $parms = $request["Parameters"];
    switch ($request["Key"]) {
        case "userinfo": {
                $userinfo = GetUserInfo($parms);
                if ($userinfo != null && $userinfo->PlayerID != 0) return ["success" => true, "content" => $userinfo];
                if ($userinfo != null && $userinfo->PlayerID == 0) return ["success" => false, "message" => "Could not locate user (" . $userinfo->PlayerName . ")"];
                return ["success" => false, "message" => "Could not locate user."];
            }

        case "bids": {
                $userinfo = GetUserInfo($parms);
                if ($userinfo->PlayerID == 0) return ["success" => false, "message" => $userinfo->PlayerName];

                $sql = 'SELECT P.PlayerID, CO.CountryName as Country, B.Competition_CompetitionID as CompetitionID';
                $sql .= ', B.Round, B.Bid';
                $sql .= ' FROM Player as P';
                $sql .= ' INNER JOIN PlayerCountryBid as B on B.Player_PlayerID = P.PlayerID';
                $sql .= ' INNER JOIN Country as CO on B.Country_CountryID = CO.CountryID';
                $sql .= ' WHERE P.PlayerID = ?';
                return GetResultsetAsJSON($sql, [$userinfo->PlayerID]);
            }

        case "savebid": {
                $competitionID = $parms["competitionid"];
                $round = $parms["round"];
                $bids = json_decode($parms["bids"], true);
                $playerid = GetPlayerIDFromToken($parms["token"]);

                if ($playerid == null) {
                    return ["success" => false, "message" => "Unrecognized player"];
                }

                $sql = 'SELECT Locked FROM PlayerCountryBid';
                $sql .= ' WHERE Competition_CompetitionID = ? AND Player_PlayerID = ? AND Round = ?';
                $rs = new ResultSet($sql, [$competitionID, $playerid, $round]);
                if (!$rs->success) return ["success" => false, "message" => $rs->message];

                $locked = false;
                foreach ($rs->data as $row) {
                    if ($row[0] == 1) $locked = true;
                }
                if ($locked) {
                    return ["success" => false, "message" => "Bids for this round are locked.  Contact the TD to unlock."];
                }

                $sql = "DELETE FROM PlayerCountryBid WHERE Competition_CompetitionID = ? AND Player_PlayerID = ? AND `Round` = ?";
                $rs = new ResultSet($sql, [$competitionID, $playerid, $round]);
                if (!$rs->success) return ["success" => false, "message" => "(clearing) " . $rs->message];

                $sql = 'INSERT INTO PlayerCountryBid (Competition_CompetitionID, Player_PlayerID, `Round`, Country_CountryID, Bid)';
                $sql .= ' VALUES (?,?,?,?,?)';

                foreach ($bids as $country => $bid) {
                    $rs = new ResultSet($sql, [$competitionID, $playerid, $round, CountryNameToID($country), $bid]);
                    if (!$rs->success) return ["success" => false, "message" => "(adding " . $country . ") " . $rs->message];
                }

                return ["success" => true, "content" => json_encode(["what" => "yes"])];
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

        case "compseeds": {
                $userinfo = GetUserInfo($parms);
                if ($userinfo->PlayerID == 0) return ["success" => false, "message" => $userinfo->PlayerName];

                $sql = "SELECT P.PlayerID, P.PlayerName, C.CompetitionID, C.CompetitionName, S.Seed";
                $sql .= " FROM Competition AS C";
                $sql .= " INNER JOIN CompetitionPlayerSeed as S on S.Competition_CompetitionID = C.CompetitionID";
                $sql .= " INNER JOIN Player as P on S.Player_PlayerID = P.PlayerID";

                if (IsZach("")) {
                    // $sql .= " WHERE C.CompetitionID = 3051";
                    $sql .= " WHERE C.CompetitionID = 2038";
                    $vars = null;
                } else {
                    $sql .= " WHERE P.PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                }

                $sql .= " ORDER BY C.CompetitionName";

                return GetResultsetAsJSON($sql, $vars);
            }

        case "compschedule": {
                $userinfo = GetUserInfo($parms);
                if ($userinfo->PlayerID == 0) return ["success" => false, "message" => $userinfo->PlayerName];

                $sql = "SELECT P.PlayerID, P.PlayerName, C.CompetitionID, C.CompetitionName, S.Round, S.Locked";
                $sql .= " FROM Competition AS C";
                $sql .= " INNER JOIN CompetitionPlayerSchedule as S on S.Competition_CompetitionID = C.CompetitionID";
                $sql .= " INNER JOIN Player as P on S.Player_PlayerID = P.PlayerID";

                if (IsZach("")) {
                    // $sql .= " WHERE C.CompetitionID = 3051";
                    $sql .= " WHERE C.CompetitionID = 2038";
                    $vars = null;
                } else {
                    $sql .= " WHERE P.PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                }

                $sql .= " ORDER BY C.CompetitionName";

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
            return ["success" => false, "message" => "hubget: Unrecognized key (" + $request["Key"] + ")"];
    }
}

function GetPlayerIDFromToken($token)
{
    $vars = [$token];
    $sql = "SELECT PlayerID, PlayerName FROM Player";
    $sql .= ' WHERE Token = ?';
    $rs = new ResultSet($sql, $vars);
    $data = $rs->data;
    if (count($data) == 0) return null;
    return $data[0][0];
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

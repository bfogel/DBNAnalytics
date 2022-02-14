<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

header("Access-Control-Allow-Origin: *");

//REST API endpoint---------------------------
function initCors($value)
{
    $origin = get_http_origin();
    $allowed_origins = ['site1.example.com', 'site2.example.com', 'localhost:3000'];

    if ($origin && in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        header('Access-Control-Allow-Methods: GET');
        header('Access-Control-Allow-Credentials: true');
    }

    return $value;
}

add_action('rest_api_init', function () {
    // register_rest_route('DBNAnalytics/v1', '/hubget/(?P<id>\d+)', array(
    register_rest_route('DBNAnalytics/v1', '/hubget/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'hubget_respond',
    ));
});

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        header("Access-Control-Allow-Origin: *");
    });
}, 15);

function hubget_respond($data)
{
    $myrequests = $_POST['requests'];

    return ["iwant" => "stuff"];

    if ($myrequests != "") {
        $list = json_decode($myrequests, true);
        $ret = [];
        foreach ($list as $item) {
            array_push($ret, HandleRequest($item));
        }
        return json_encode($ret);
    }
    return "";
}
//---------------------------------------------


// $requests = $_POST['requests'];

// if ($requests != "") {
//     $list = json_decode($requests, true);
//     $ret = [];
//     foreach ($list as $item) {
//         array_push($ret, HandleRequest($item));
//     }
//     echo json_encode($ret);
//     return;
// }

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
            $rs = new dbnResultSet("SELECT * FROM Player WHERE Token = ?", [$parameters["token"]]);
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

function VerifyTD($competitionID, $playerid)
{
    $sql = "SELECT C.Director_PlayerID";
    $sql .= " FROM Competition AS C";
    $sql .= " WHERE C.CompetitionID = ?";

    $rs = new dbnResultSet($sql, [$competitionID]);
    $data = $rs->data;

    return count($data) > 0 && $data[0][0] == $playerid;
}


//Should return a JSON object with expected fields set 
// (really you should define a response class with two subclasses SuccessResponse and FailureResponse)
function HandleRequest($request)
{
    $parameters = $request["Parameters"];

    //requests that don't require a user
    switch ($request["Key"]) {
        case "test": {

                //$wpuser = wp_get_current_user();
                return ["success" => true, "content" => ["loggedin" => wp_get_current_user()]];
            }
        case "players": {
                $vars = null;
                $sql = "SELECT PlayerID, PlayerName FROM Player";

                $token = $parameters["token"];
                if ($token != null) {
                    $sql .= ' WHERE Token = ?';
                    $vars = [$token];
                }
                return GetResultsetAsJSON($sql, $vars);
            }
        case "games": {
                $where = 'GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ?)';
                $where .= ' AND GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ?)';
                $games = GetGames($where, [$parameters['p1'], $parameters['p2']]);

                if ($games instanceof dbnResultSet) return $games->ToJSON();
                return ["success" => true, "content" => $games];
            }
    }

    //Requests that require a user
    $userinfo = GetUserInfo($parameters);
    if ($userinfo->PlayerID == 0) return ["success" => false, "message" => $userinfo->PlayerName];

    switch ($request["Key"]) {
        case "userinfo": {
                return ["success" => true, "content" => $userinfo];
            }

        case "compseeds": {

                $sql = "SELECT P.PlayerID, P.PlayerName, C.CompetitionID, C.CompetitionName, S.Seed";
                $sql .= " FROM Competition AS C";
                $sql .= " INNER JOIN CompetitionPlayerSeed as S on S.Competition_CompetitionID = C.CompetitionID";
                $sql .= " INNER JOIN Player as P on S.Player_PlayerID = P.PlayerID";

                $asTD = false;
                if ($parameters != null && array_key_exists("asTD", $parameters)) $asTD = $parameters["asTD"];

                if ($asTD) {
                    $sql .= " WHERE C.Director_PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                } else {
                    $sql .= " WHERE P.PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                }

                $sql .= " ORDER BY C.CompetitionName";

                return GetResultsetAsJSON($sql, $vars);
            }

        case "compschedule": {
                $sql = "SELECT P.PlayerID, P.PlayerName, C.CompetitionID, C.CompetitionName, S.Round, S.BidsLocked";
                $sql .= " FROM Competition AS C";
                $sql .= " INNER JOIN CompetitionPlayerSchedule as S on S.Competition_CompetitionID = C.CompetitionID";
                $sql .= " INNER JOIN Player as P on S.Player_PlayerID = P.PlayerID";

                $asTD = false;
                if ($parameters != null && array_key_exists("asTD", $parameters)) $asTD = $parameters["asTD"];

                if ($asTD) {
                    $sql .= " WHERE C.Director_PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                } else {
                    $sql .= " WHERE P.PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                }

                $sql .= " ORDER BY C.CompetitionName";

                return GetResultsetAsJSON($sql, $vars);
            }

        case "setScheduleLock": {
                $competitionID = $parameters["competitionid"];
                $round = $parameters["round"];
                $value = $parameters["value"];

                if (!VerifyTD($competitionID, $userinfo->PlayerID)) return ["success" => false, "message" => "User not authorized"];

                $sql = 'UPDATE CompetitionPlayerSchedule SET BidsLocked = ? ';
                $sql .= 'WHERE Competition_CompetitionID = ? AND Round = ?';
                $rs = new dbnResultSet($sql, [$value ? 1 : 0, $competitionID, $round]);

                if (!$rs->success) return ["success" => false, "message" => $rs->message];
                return ["success" => true, "content" => ["RecordsAffected" => $rs->affected_rows]];
            }

        case "bids": {
                $sql = 'SELECT P.PlayerID, CO.CountryName as Country, B.Competition_CompetitionID as CompetitionID';
                $sql .= ', B.Round, B.Bid';
                $sql .= ' FROM Player as P';
                $sql .= ' INNER JOIN PlayerCountryBid as B on B.Player_PlayerID = P.PlayerID';
                $sql .= ' INNER JOIN Country as CO on B.Country_CountryID = CO.CountryID';
                $sql .= ' INNER JOIN Competition as C on B.Competition_CompetitionID = C.CompetitionID';

                $asTD = false;
                if ($parameters != null && array_key_exists("asTD", $parameters)) $asTD = $parameters["asTD"];

                if ($asTD) {
                    $sql .= " WHERE C.Director_PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                } else {
                    $sql .= " WHERE P.PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                }

                return GetResultsetAsJSON($sql, [$userinfo->PlayerID]);
            }

        case "savebid": {
                $competitionID = $parameters["competitionid"];
                $round = $parameters["round"];
                $bids = json_decode($parameters["bids"], true);

                $sql = 'SELECT BidsLocked FROM CompetitionPlayerSchedule';
                $sql .= ' WHERE Competition_CompetitionID = ? AND Player_PlayerID = ? AND Round = ?';
                $rs = new dbnResultSet($sql, [$competitionID, $userinfo->PlayerID, $round]);
                if (!$rs->success) return ["success" => false, "message" => $rs->message];

                $locked = false;
                foreach ($rs->data as $row) {
                    if ($row[0] == 1) $locked = true;
                }
                if ($locked) {
                    return ["success" => false, "message" => "Bids for this round are locked.  Contact the TD to unlock."];
                }

                $sql = "DELETE FROM PlayerCountryBid WHERE Competition_CompetitionID = ? AND Player_PlayerID = ? AND `Round` = ?";
                $rs = new dbnResultSet($sql, [$competitionID, $userinfo->PlayerID, $round]);
                if (!$rs->success) return ["success" => false, "message" => "(clearing) " . $rs->message];

                $sql = 'INSERT INTO PlayerCountryBid (Competition_CompetitionID, Player_PlayerID, `Round`, Country_CountryID, Bid)';
                $sql .= ' VALUES (?,?,?,?,?)';

                foreach ($bids as $country => $bid) {
                    $rs = new dbnResultSet($sql, [$competitionID, $userinfo->PlayerID, $round, CountryNameToID($country), $bid]);
                    if (!$rs->success) return ["success" => false, "message" => "(adding " . $country . ") " . $rs->message];
                }

                return ["success" => true, "content" => json_encode(["what" => "yes"])];
            }

        default:
            return ["success" => false, "message" => "hubget: Unrecognized key (" + $request["Key"] + ")"];
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

    $rs = new dbnResultSet($sql, $params);

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

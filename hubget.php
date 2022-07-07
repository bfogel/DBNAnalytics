<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

//REST API endpoint---------------------------

//NOTE: If you want to tailor CORS, here's a template.  Would go into the add_filter function
// function initCors($value)
// {
//     $origin = get_http_origin();
//     $allowed_origins = ['site1.example.com', 'site2.example.com', 'localhost:3000'];

//     if ($origin && in_array($origin, $allowed_origins)) {
//         header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
//         header('Access-Control-Allow-Methods: GET');
//         header('Access-Control-Allow-Credentials: true');
//     }

//     return $value;
// }

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
    $myrequests = stripcslashes($_POST['requests']);

    if ($myrequests != "") {
        $list = json_decode($myrequests, true);
        $ret = [];
        foreach ($list as $item) {
            array_push($ret, HandleRequest($item));
        }
        return $ret;
    }
    return "";
}
//---------------------------------------------

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

function MakeErrorResponse($message)
{
    return ["success" => false, "message" => $message];
}
function MakeNonQuerySuccessResponse($affectedRowCount)
{
    return ["success" => true, "content" => ["RecordsAffected" => $affectedRowCount]];
}
function MakeQuerySuccessResponse($content)
{
    return ["success" => true, "content" => $content];
}

class dbnTransaction
{

    public $StartMessage = "";
    public $CommitMessage = "";
    public $RollbackMessage = "";

    function Start()
    {
        $conn = dbn_GetConnection();
        $res = $conn->begin_transaction();
        return $res;
    }
    function Commit()
    {
        $conn = dbn_GetConnection();
        $res = $conn->commit();
        return $res;
    }
    function Rollback()
    {
        $conn = dbn_GetConnection();
        $res = $conn->rollback();
        return $res;
    }
}

class dbnUserInfo
{
    public $PlayerID = 0;
    public $PlayerName = "";
    function __construct($playerid, $playername)
    {
        $this->PlayerID = $playerid;
        $this->PlayerName = $playername;
    }
}

function GetUserInfo($parameters): dbnUserInfo
{
    if (array_key_exists("token", $parameters)) {
        $rs = new dbnResultSet("SELECT PlayerID, PlayerName FROM Player WHERE Token = ?", [$parameters["token"]]);
        if (!$rs->success) {
            return new dbnUserInfo(0, $rs->message);
        } else {
            if (count($rs->data) == 0) {
                return new dbnUserInfo(0, "no data");
            } else {
                $row = $rs->data[0];
                return new dbnUserInfo($row[0], $row[1]);
            }
        }
    } else {
        $wpuser = wp_get_current_user();
        if (!$wpuser) {
            return new dbnUserInfo(0, "no user");
        } else {
            $wpusername = $wpuser->user_login;
            $rs = new dbnResultSet("SELECT PlayerID, PlayerName FROM Player WHERE DiploBNUser = ?", [$wpusername]);
            if (!$rs->success) {
                return new dbnUserInfo(0, $rs->message);
            } else {
                if (count($rs->data) == 0) {
                    return new dbnUserInfo(0, "user " . $wpusername . " not registered");
                } else {
                    $row = $rs->data[0];
                    return new dbnUserInfo($row[0], $row[1]);
                }
            }
        }
    }
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
// ALSO: All parameters should be sent as json and decoded prior to the switch
function HandleRequest($request)
{
    $parameters = $request["Parameters"];

    //-------------------------------requests that don't require a user-------------------------------
    switch ($request["Key"]) {
        case "test": {
                //$wpuser = wp_get_current_user();
                return MakeQuerySuccessResponse(["loggedin" => wp_get_current_user()]);
            }

        case "players": {
                $vars = null;
                $sql = "SELECT PlayerID, PlayerName FROM Player";

                //2022-03-27 - Not sure what this was doing.  Might be a vestige before userinfo request
                // $token = $parameters["token"];
                // if ($token != null) {
                //     $sql .= ' WHERE Token = ?';
                //     $vars = [$token];
                // }
                return GetResultsetAsJSON($sql, $vars);
            }

        case "competition": {
                if (!array_key_exists("CompetitionIDs", $parameters)) return MakeErrorResponse("No CompetitionIDs");
                $CompetitionIDs = $parameters["CompetitionIDs"];
                if (gettype($CompetitionIDs) != "array") $CompetitionIDs = [$CompetitionIDs];

                $sql = "SELECT C.*";
                $sql .= ", CS.CompetitionSeriesName AS CompetitionSeries_CompetitionSeriesName";
                $sql .= ", P.PlayerName AS Director_PlayerName";
                $sql .= " FROM Competition AS C";
                $sql .= " INNER JOIN CompetitionSeries AS CS ON CS.CompetitionSeriesID = C.CompetitionSeries_CompetitionSeriesID";
                $sql .= " INNER JOIN Player AS P ON P.PlayerID = C.Director_PlayerID";
                $sql .= " WHERE CompetitionID IN (" . str_repeat('?,', count($CompetitionIDs) - 1) . "?)";

                return GetResultsetAsJSON($sql, $CompetitionIDs);
            }

        case "compiledtable": {
                if (!array_key_exists("Category", $parameters)) return MakeErrorResponse("No Category");
                $Category = $parameters["Category"];
                if (!array_key_exists("ItemID", $parameters)) return MakeErrorResponse("No ItemID");
                $ItemID = $parameters["ItemID"];

                $sql = "SELECT * FROM CompiledTable";
                $sql .= " WHERE Category = ? AND ItemID = ?";
                $vals = [$Category, $ItemID];

                return GetResultsetAsJSON($sql, $vals);
            }

        case "getgames": {
                $GameIDs = null;
                $CompetitionIDs = null;
                $PlayerIDs = null;

                if (array_key_exists("GameIDs", $parameters)) $GameIDs = json_decode($parameters["GameIDs"]);
                if (array_key_exists("CompetitionIDs", $parameters)) $CompetitionIDs = json_decode($parameters["CompetitionIDs"]);
                if (array_key_exists("PlayerIDs", $parameters)) $PlayerIDs = json_decode($parameters["PlayerIDs"]);

                if (!$GameIDs && !$CompetitionIDs && !$PlayerIDs) return MakeErrorResponse("No parameters");

                if ($GameIDs && gettype($GameIDs) != "array") $GameIDs = [$GameIDs];
                if ($CompetitionIDs && gettype($CompetitionIDs) != "array") $CompetitionIDs = [$CompetitionIDs];
                if ($PlayerIDs && gettype($PlayerIDs) != "array") $PlayerIDs = [$PlayerIDs];

                $where = "";
                $vals = [];

                if (!$GameIDs) {
                    $where .= $where == "" ? "WHERE " : " AND ";
                    $where .= "GameID IN (" . str_repeat('?,', count($GameIDs) - 1) . "?)";
                    array_push($vals, ...$GameIDs);
                }
                if (!$CompetitionIDs) {
                    $where .= $where == "" ? "WHERE " : " AND ";
                    $where .= "Competition_CompetitionID IN (" . str_repeat('?,', count($CompetitionIDs) - 1) . "?)";
                    array_push($vals, ...$CompetitionIDs);
                }
                if (!$PlayerIDs) {
                    foreach ($PlayerIDs as $pid) {
                        $where .= $where == "" ? "WHERE " : " AND ";
                        $where .= 'GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ?)';
                        array_push($vals, $pid);
                    }
                }

                $games = GetGames($where, $vals);

                if ($games instanceof dbnResultSet) return $games->ToJSON();
                return MakeQuerySuccessResponse($games);
            }

        case "games": {
                if (!array_key_exists("PlayerIDs", $parameters)) return MakeErrorResponse("No players");
                $playerids = json_decode($parameters["PlayerIDs"]);
                if (!is_array($playerids)) return MakeErrorResponse("No players");

                $where = "";
                $vals = [];
                foreach ($playerids as $pid) {
                    if ($where != "") $where .= " AND ";
                    $where .= 'GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ?)';
                    array_push($vals, $pid);
                }
                $games = GetGames($where, $vals);

                if ($games instanceof dbnResultSet) return $games->ToJSON();
                return MakeQuerySuccessResponse($games);
            }
    }

    //-------------------------------Requests that require a user-------------------------------
    if ($request["Key"] != "userinfo") $parameters["token"] = "b10a9bcf-9e4a-4d4a-8389-02d938edb3d5";
    $userinfo = GetUserInfo($parameters);
    if ($userinfo->PlayerID == 0) return ["success" => false, "message" => $userinfo->PlayerName];

    switch ($request["Key"]) {
        case "userinfo": {
                return MakeQuerySuccessResponse($userinfo);
            }

        case "competitionList": {
                $sql = "SELECT DISTINCT C.CompetitionID, C.CompetitionName, C.DBNIYear, CS.CompetitionSeriesID, CS.CompetitionSeriesName";
                $sql .= " , C.CompletionDate";
                $sql .= " FROM Competition AS C";
                $sql .= " INNER JOIN CompetitionSeries as CS on C.CompetitionSeries_CompetitionSeriesID = CS.CompetitionSeriesID";

                $asTD = false;
                if ($parameters != null && array_key_exists("asTD", $parameters)) $asTD = $parameters["asTD"];

                if ($asTD) {
                    $sql .= " WHERE C.Director_PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                } else {
                    $sql .= " INNER JOIN Game as G on G.Competition_CompetitionID = C.CompetitionID";
                    $sql .= " INNER JOIN GameCountryPlayer as GCP on GCP.Game_GameID = G.GameID";
                    $sql .= " WHERE GCP.PlayerOfRecord_PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                }

                $sql .= " ORDER BY C.CompetitionName";

                return GetResultsetAsJSON($sql, $vars);
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

        case "CompetitionPlayerCountries": {
                if ($parameters == null || !array_key_exists("competitionID", $parameters)) return MakeErrorResponse("No CompetitionID");
                $competitionID = $parameters["competitionID"];
                if (!VerifyTD($competitionID, $userinfo->PlayerID)) return MakeErrorResponse("User not authorized");

                $sql = "SELECT P.PlayerID, CO.CountryID, Count(CO.CountryID) as GameCount";
                $sql .= " FROM Game as G";
                $sql .= " INNER JOIN GameCountryPlayer as GCP on GCP.Game_GameID = G.GameID";
                $sql .= " INNER JOIN Player as P on GCP.PlayerOfRecord_PlayerID = P.PlayerID";
                $sql .= " INNER JOIN Country as CO on GCP.Country_CountryID = CO.CountryID";
                $sql .= " WHERE G.Competition_CompetitionID = ?";
                $sql .= " GROUP BY P.PlayerID, CO.CountryID";

                $vars = [$competitionID];

                $sql .= " ORDER BY P.PlayerID";

                return GetResultsetAsJSON($sql, $vars);
            }

        case "CompetitionSchedule_Get": {
                $sql = "SELECT P.PlayerID, P.PlayerName, C.CompetitionID, C.CompetitionName, S.Round, S.BidsLocked, S.Board, S.Country_CountryID as CountryID";
                $sql .= " FROM Competition AS C";
                $sql .= " INNER JOIN CompetitionPlayerSchedule as S on S.Competition_CompetitionID = C.CompetitionID";
                $sql .= " INNER JOIN Player as P on S.Player_PlayerID = P.PlayerID";

                $asTD = false;
                if ($parameters != null && array_key_exists("asTD", $parameters)) $asTD = $parameters["asTD"];
                if ($parameters == null || !array_key_exists("competitionID", $parameters)) return MakeErrorResponse("No CompetitionID");
                $competitionID = $parameters["competitionID"];

                if ($asTD) {
                    $sql .= " WHERE C.Director_PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                } else {
                    $sql .= " WHERE P.PlayerID = ?";
                    $vars = [$userinfo->PlayerID];
                }

                $sql .= " AND C.CompetitionID = ?";
                array_push($vars,  $competitionID);

                $sql .= " ORDER BY C.CompetitionName";

                return GetResultsetAsJSON($sql, $vars);
            }

        case "CompetitionSchedule_Save": {
                $competitionID = $parameters["competitionID"];
                $schedules = $parameters["schedules"];

                if (!VerifyTD($competitionID, $userinfo->PlayerID)) return MakeErrorResponse("User not authorized");

                $trans = new dbnTransaction();
                if (!$trans->Start()) return MakeErrorResponse("Could not start transaction: " . $trans->StartMessage);

                $sql = "DELETE FROM CompetitionPlayerSchedule WHERE Competition_CompetitionID = ?";
                $rs = new dbnResultSet($sql, [$competitionID]);
                if (!$rs->success) return MakeErrorResponse("(clearing) " . $rs->message);

                $sql = 'INSERT INTO CompetitionPlayerSchedule (Competition_CompetitionID, Player_PlayerID, `Round`, BidsLocked, Board, Country_CountryID)';
                $sql .= ' VALUES (?,?,?,?,?,?)';

                foreach ($schedules as $sched) {
                    if ($sched["CompetitionID"] == $competitionID) {
                        $rs = new dbnResultSet($sql, [$competitionID, $sched["PlayerID"], $sched["Round"], $sched["BidsLocked"] ? 1 : 0, $sched["Board"], $sched["CountryID"]]);
                        if (!$rs->success) {
                            $brb = $trans->Rollback();
                            return MakeErrorResponse("(adding " . json_encode($sched) . ") " . $rs->message . " [" . ($brb ? "ok" : $trans->RollbackMessage) . "]");
                        }
                    }
                }

                if (!$trans->Commit()) return MakeErrorResponse("Could not commit transaction: " . $trans->CommitMessage);
                return MakeQuerySuccessResponse("ok");
            }

        case "setScheduleLock": {
                return MakeErrorResponse("no can do");

                $competitionID = $parameters["competitionid"];
                $round = $parameters["round"];
                $value = $parameters["value"];

                if (!VerifyTD($competitionID, $userinfo->PlayerID)) return MakeErrorResponse("User not authorized");

                $sql = 'UPDATE CompetitionPlayerSchedule SET BidsLocked = ? ';
                $sql .= 'WHERE Competition_CompetitionID = ? AND Round = ?';
                $rs = new dbnResultSet($sql, [$value ? 1 : 0, $competitionID, $round]);

                if (!$rs->success) return ["success" => false, "message" => $rs->message];
                return MakeNonQuerySuccessResponse($rs->affected_rows);
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
                if (!$rs->success) return MakeErrorResponse($rs->message);

                $locked = false;
                foreach ($rs->data as $row) {
                    if ($row[0] == 1) $locked = true;
                }
                if ($locked) {
                    return MakeErrorResponse("Bids for this round are locked.  Contact the TD to unlock.");
                }

                $sql = "DELETE FROM PlayerCountryBid WHERE Competition_CompetitionID = ? AND Player_PlayerID = ? AND `Round` = ?";
                $rs = new dbnResultSet($sql, [$competitionID, $userinfo->PlayerID, $round]);
                if (!$rs->success) return MakeErrorResponse("(clearing) " . $rs->message);

                $sql = 'INSERT INTO PlayerCountryBid (Competition_CompetitionID, Player_PlayerID, `Round`, Country_CountryID, Bid)';
                $sql .= ' VALUES (?,?,?,?,?)';

                foreach ($bids as $country => $bid) {
                    $rs = new dbnResultSet($sql, [$competitionID, $userinfo->PlayerID, $round, CountryNameToID($country), $bid]);
                    if (!$rs->success) return MakeErrorResponse("(adding " . $country . ") " . $rs->message);
                }

                return MakeQuerySuccessResponse(["what" => "yes"]);
            }

        default:
            return MakeErrorResponse("hubget: Unrecognized key (" + $request["Key"] + ")");
    }
}

function GetGames($where, $params)
{
    $sql = 'SELECT G.GameID, G.Label, G.EndDate, G.DrawSize, G.GameYearsCompleted, G.GamePlatform_GamePlatformID, G.GamePlatformIdentifier';
    $sql .= ', C.CompetitionID, C.CompetitionName, C.DBNIYear';
    $sql .= ', P.PlayerID, P.PlayerName';
    $sql .= ', CO.CountryName, GCP.Note';
    $sql .= ', GCR.InGameAtEnd, GCR.CenterCount, GCR.YearOfElimination, GCR.UnexcusedResignation, GCR.SupplyCenters';
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
    $cSupplyCenters = $rs->GetFieldIndex("SupplyCenters");
    $cScore = $rs->GetFieldIndex("Score");
    $cRank = $rs->GetFieldIndex("Rank");
    $cRankScore = $rs->GetFieldIndex("RankScore");
    $cTopShare = $rs->GetFieldIndex("TopShare");
    $cDBNIYear = $rs->GetFieldIndex("DBNIYear");

    $games = [];
    $game = null;
    $gamekey = null;
    $lines = null;

    foreach ($rs->data as $row) {
        $gamekey = "game" . $row[$cGameID];
        if (!array_key_exists($gamekey, $games)) {
            $game = [
                "GameID" => $row[$cGameID], "Label" => $row[$cLabel], "EndDate" => $row[$cEndDate], "DrawSize" => $row[$cDrawSize], "GameYearsCompleted" => $row[$cGameYearsCompleted], "Competition" => ["CompetitionID" => $row[$cCompetitionID], "CompetitionName" => $row[$cCompetitionName]], "DBNIYear" => $row[$cDBNIYear]
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
            "Player" => ["PlayerID" => $row[$cPlayerID], "PlayerName" => $row[$cPlayerName]], "Country" => $row[$cCountryName], "Note" => $row[$cNote], "CenterCount" => $row[$cCenterCount], "InGameAtEnd" => $row[$cInGameAtEnd], "YearOfElimination" => $row[$cYearOfElimination], "UnexcusedResignation" => $row[$cUnexcusedResignation], "SupplyCenters" => $row[$cSupplyCenters], "Score" => $row[$cScore], "Rank" => $row[$cRank], "RankScore" => $row[$cRankScore], "TopShare" => $row[$cTopShare]
        ];

        $lines[$line["Country"]] = $line;
        // array_push($lines, $line);
        $game["ResultLines"] = $lines;
        $games[$gamekey] = $game;
    }

    return array_values($games);
}

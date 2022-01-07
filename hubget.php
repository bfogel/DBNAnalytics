<?php 

include("modules/dataaccess.php");

header("Access-Control-Allow-Origin: *");

$id = $_GET['id'];
$src = $_GET['src'];

$year = $_GET['year'];
$season = $_GET['season'];

//echo $bid;
switch ($src) {
    case 'p':
        $ret = GetAndReturnJSON('SELECT PlayerID, PlayerName FROM Player');
        break;

    case 'pc':
        {
            $p1id = $_GET['p1'];
            $p2id = $_GET['p2'];
            $sql = 'SELECT GameID, G.Label, G.EndDate, C.CompetitionName';
            $sql .= ' FROM Game as G';
            $sql .= ' INNER JOIN Competition as C on G.Competition_CompetitionID = C.CompetitionID';
            $sql .= ' WHERE GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ' . $p1id . ')' ;
            $sql .= ' AND GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ' . $p2id . ')' ;
            $ret = GetAndReturnJSON($sql);
            break;
        }

    case 'g':
        $ret = GetGames('GameID = 11765');
        break;

    default:
        $ret = 'nope';
        break;
}

echo $ret;

function GetAndReturnJSON($sql){

    $ret = ["success" => false];

    $conn = dbn_GetConnection();
    $result = $conn -> query($sql);
    
    if (!$result) {
        $ret["message"] = $conn->error;
    // } elseif ($result -> num_rows == 0) {
    //     $ret["zero"] = true;
    } else {
        $fields = [];
        foreach ($result -> fetch_fields() as &$field) {
            $ff = [];
            $ff["name"] = $field->name;
            array_push($fields,$ff);
        }
        unset($field);

        $ret["fields"] = $fields;

        $data = [];
        while($row = $result->fetch_assoc()) {
            array_push($data, array_values($row));
        }

        $ret["data"] = $data;
        $ret["success"] = true;
    }
    return json_encode($ret);
}

function GetGames($where){
    $sql = 'SELECT G.GameID, G.Label, G.EndDate, G.DrawSize, G.GameYearsCompleted, G.GamePlatform_GamePlatformID, G.GamePlatformIdentifier';
    $sql .= ', C.CompetitionID, C.CompetitionName';
    $sql .= ', P.PlayerID, P.PlayerName';
    $sql .= ', GCP.Country_CountryID, GCP.Note';
    $sql .= ', GCR.InGameAtEnd, GCR.CenterCount, GCR.UnexcusedResignation';
    $sql .= ', GCC.Score, GCC.Rank, GCC.RankScore, GCC.TopShare';

    $sql .= ' FROM Game as G';
    $sql .= ' INNER JOIN Competition as C on G.Competition_CompetitionID = C.CompetitionID';
    $sql .= ' INNER JOIN GameCountryPlayer as GCP on GCP.Game_GameID = G.GameID';
    $sql .= ' INNER JOIN GameCountryResult as GCR on GCR.Game_GameID = G.GameID AND GCP.Country_CountryID = GCR.Country_CountryID';
    $sql .= ' INNER JOIN GameCountryComputations as GCC on GCC.Game_GameID = G.GameID AND GCP.Country_CountryID = GCC.Country_CountryID';
    $sql .= ' INNER JOIN Player as P on GCP.PlayerOfRecord_PlayerID = P.PlayerID';
    $sql .= ' WHERE ' . $where;

    $ret = GetAndReturnJSON($sql);
    return $ret;
}

?>
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
            $sql = 'SELECT GameID, Label';
            $sql .= ' FROM Game as G';
            $sql .= ' WHERE GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ' . $p1id . ')' ;
            $sql .= ' AND GameID IN (SELECT Game_GameID FROM GameCountryPlayer WHERE PlayerOfRecord_PlayerID = ' . $p2id . ')' ;
            $ret = GetAndReturnJSON($sql);
            break;
        }
    default:
        $ret = 'nope';
        break;
}

echo $ret;

function GetAndReturnJSON($sql){

    $ret = ["success"=>false];

    $conn = dbn_GetConnection();
    $result = $conn -> query($sql);
    
    if (!$result) {
    } elseif ($result -> num_rows == 0) {
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

?>
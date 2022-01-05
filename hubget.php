<?php 

include("modules/dataaccess.php");

$id = $_GET['id'];
$src = $_GET['src'];

$year = $_GET['year'];
$season = $_GET['season'];

//echo $bid;
switch ($src) {
  case 'p':
    $ret = GetAndReturnJSON('SELECT PlayerID, PlayerName FROM Player');
    break;
  default:
    $ret = 'nope';
    break;
}

echo $ret;

function GetAndReturnJSON($sql){

    $conn = dbn_GetConnection();
    $result = $conn -> query($sql);
    
    if (!$result) {
        return null;
    } elseif ($result -> num_rows == 0) {
        return null;
    } else {
        $row = $result -> fetch_assoc();
        return $row["PlayerName"];
    }
}

?>
<?php 

header("Cache-Control: no-cache");

$id = $_GET['id'];
$src = $_GET['src'];

$year = $_GET['year'];
$season = $_GET['season'];

//echo $bid;
switch ($src) {
  case 'b':
    $url = 'http://www.backstabbr.com/game/' . $id;
    if($year!=null & $season!=null) $url .= '/' . $year . '/' . $season;
    $ret = file_get_contents($url);
    break;
  case 'w':
    $ret = file_get_contents('https://webdiplomacy.net/board.php?gameID=' . $id);
    break;
  case 'v':
    $ret = file_get_contents('https://vdiplomacy.net/board.php?gameID=' . $id);
    break;
  default:
    $ret = 'nope';
    break;
}

echo $ret;
?>
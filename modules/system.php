<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

include("dataaccess.php");

function dbn_GetHTML($category, $id) {
	return dbn_GetHTMLWithConn(dbn_GetConnection(), $category, $id);
}

function dbn_GetHTMLWithConn($conn, $category, $id) {

	$sql = 'SELECT HTML as sHTML
		FROM CustomHTML
		WHERE Category = "' . $category . '" AND ID = "' . $id . '"';
	
	$result = $conn -> query($sql);
	
	if (!$result) {
		return null;
	} elseif ($result -> num_rows == 0) {
		return null;
	} else {
		$row = $result -> fetch_assoc();
		return $row["sHTML"];
	}

}

?>
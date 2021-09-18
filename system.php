<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


function dbn_GetConnection(){

	$servername = "localhost";
	$username = "uydxiqcqqwaho";
	$password = "gh^511`31^3r";
	$dbname = "dbo4lunx2qm2nn";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	return $conn;

}

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
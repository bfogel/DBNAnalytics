<?php

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

?>
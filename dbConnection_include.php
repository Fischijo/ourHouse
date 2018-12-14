<?php 

$servername = "localhost";
$username = "phpmyadmin";
$password = "b0ns@iPhpMy@dmin!";
$dbname = "home_automation";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

?>
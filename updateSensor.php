<?php 

 include "dbConnection_include.php";

 $sensorId     = $_GET['sensorId'];
 if ($sensorId == "" ) {
	echo "No Sensor Id";
	return;
 }
 
 $update = "";
 $comma = " ";
 $sensorName   = $_GET['name'];
 if ($sensorName != "") {
  $update = $comma . "description='$sensorName'";
  $comma = ", ";
 }
 $displayOrder = $_GET['displayOrder'];
 if ($displayOrder != "") {
  $update .= $comma . "displayOrder='$displayOrder'";
  $comma = ", ";
 }
 $intervall    = $_GET['intervall'];
 if ($intervall != "") {
  $update .= $comma . "measurementIntervall='$intervall'";
  $comma = ", ";
 }
 $type 		   = $_GET['type'];
 if ($type != "") {
  $update .= $comma . "type='$type'";
  $comma = ", ";
 }
 $active 	= $_GET['active'];
 if ($active != "") {
  $update .= $comma . "active='$active'";
 }
 
 if ($update == "" ) {
	echo "No fields to update";
	return;
 }
 
 $sql = "UPDATE sensors SET ". $update ."  where sensorId = '$sensorId'";
 
 if (mysqli_query($conn, $sql)) {
    echo "Sensor erfolgreich aktualisiert.";
 } else {
    echo "Fehler bei der Aktualisierung: " . mysqli_error($conn);
 }

 mysqli_close($conn);

?>
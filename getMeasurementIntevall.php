<?php 

 include "dbConnection_include.php";
 
 $sensorId = $_GET["sensorId"];
 $sql = "select measurementIntervall from sensors where sensorId = '$sensorId'";
 $res = mysqli_query($conn,$sql);
 
 $row = mysqli_fetch_row($res);
 echo $row[0];
?>
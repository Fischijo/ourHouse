<?php 

 include "dbConnection_include.php";
 
 class SensorData {
	public $sensorId = "";
	public $sensorName = "";
	public $sensorType = 0;
	public $capabilities = array();
	public $measurements = array();
 }
 
 $sensorId = $_GET['sensorId'];
 $limit    = $_GET['top'];

 $sensorData = new SensorData();
 $sensorData->sensorId = $sensorId;
 
 $sql = "select description, type from sensors
		where sensorId = '$sensorId'";
		
 $res = mysqli_query($conn,$sql);
 $row = mysqli_fetch_row($res);
 $sensorData->sensorName = $row[0];
 $sensorData->sensorType = $row[1];
 
 $sql = "select capability from sensorCapabilities
		 where sensorType = '$sensorData->sensorType'";
 $res = mysqli_query($conn,$sql);
 $capabilities = array();
 
 while($row = mysqli_fetch_array($res)){
	array_push($capabilities, $row[0]);
 }
 $sensorData->capabilities = $capabilities;
 
 
 $sql = "select * from sensor_temp_data
		where sensorId = '$sensorId' 
		ORDER BY measureDateTime desc
		LIMIT $limit";
 $res = mysqli_query($conn,$sql);
 $measurements = array();
 
 while($row = mysqli_fetch_array($res)){
	array_push($measurements, array('dateTime'=>$row[1],'temp'=>$row[2],'hum'=>$row[3], 'pres'=>$row[4]));
 }
 $sensorData->measurements = $measurements;
 
 echo json_encode($sensorData);
?>
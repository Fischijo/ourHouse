<?php 

 include "dbConnection_include.php";

 $sensorId = $_GET['sensorId'];
 $limit    = $_GET['top'];
 $sql = "select * from sensor_temp_data
		where sensorId = '$sensorId' 
		ORDER BY measureDateTime desc
		LIMIT $limit";

 $res = mysqli_query($conn,$sql);
 $result = array();
 
 while($row = mysqli_fetch_array($res)){
	array_push($result, array('sensorId'=>$row[0],'dateTime'=>$row[1],'temp'=>$row[2],'hum'=>$row[3], 'pres'=>$row[4]));
 }
 
 echo json_encode(array('result'=>$result));
?>
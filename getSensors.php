<?php 

 include "dbConnection_include.php";
 
 $sql = "select sensorId, description, sensorTypeDescription, displayOrder, measurementIntervall, active from sensorsWithType order by displayOrder asc";
 $res = mysqli_query($conn,$sql);
 $sensors = array();
 
 while($row = mysqli_fetch_array($res)){
	array_push($sensors, array(	'sensorId'=>$row[0],
								'description'=>$row[1], 
								'sensorTypeDescription'=>$row[2], 
								'displayOrder'=>$row[3],
								'measurementIntervall'=>$row[4],
								'active'=>$row[5]));
 }		
 
 echo json_encode($sensors);
?>
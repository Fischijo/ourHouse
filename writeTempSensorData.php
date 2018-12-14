<?php 

 include "dbConnection_include.php";

 $sensorId 				= $_GET['sensorId'];
 $temperatureString 	= $_GET['temp'];
 $temperature			= floatval($temperatureString);
 $humidityString		= $_GET['hum'];
 $humidity				= floatval($humidityString);
 $pressureString		= $_GET['pres'];
 $pressure				= floatval($pressureString);
 
 $sql = "insert into sensor_temp_data (sensorId, temperature, humidity, pressure) values ('$sensorId', $temperature, $humidity, $pressure)";

 if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
 } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
 }
 $conn->close();
 
?>
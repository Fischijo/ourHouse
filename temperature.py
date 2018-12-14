from gpiozero import CPUTemperature
import time
import sys
import MySQLdb

mydb = MySQLdb.connect(
  host="localhost",
  user="phpmyadmin",
  passwd="b0ns@iPhpMy@dmin!",
  db="home_automation"
)

#Devices
tempSensor = '/sys/bus/w1/devices/28-0194fb1d64ff/w1_slave'
cpuSensor  = CPUTemperature()

def readTempSensor(sensorName) :
    # Aus dem Systembus lese ich die Temperatur der DS18B20 aus.
    f = open(sensorName, 'r')
    lines = f.readlines()
    f.close()
    return lines

def readTempLines(sensorName) :
    lines = readTempSensor(sensorName)
    # Solange nicht die Daten gelesen werden konnten, bin ich hier in einer Endlosschleife
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = readTempSensor(sensorName)
    temperaturStr = lines[1].find('t=')
    # Ich überprüfe ob die Temperatur gefunden wurde.
    if temperaturStr != -1 :
        tempData = lines[1][temperaturStr+2:]
        tempCelsius = float(tempData) / 1000.0
        return tempCelsius

def insert_into_db(sensorName, temp):
    mycursor = mydb.cursor()
    sql  = "INSERT INTO sensor_temp_data(sensorId,temperature) VALUES(%s,%s)"
    values = (sensorName, round(temp,2))
    mycursor.execute(sql, values)
    mydb.commit()

while True:
    tempLivingRoom = readTempLines(tempSensor)
    insert_into_db('Wohnzimmer', tempLivingRoom)
    # print("Temperatur Wohnzimmer um " + time.strftime('%H:%M:%S') +" drinnen: " + str(tempLivingRoom) + " °C")

    
    tempCpu = cpuSensor.temperature 
    insert_into_db('Raspberry', tempCpu)
    # print("Temperatur CPU um " + time.strftime('%H:%M:%S') +" drinnen: " + str(tempCpu) + " °C")
    
    time.sleep(60)

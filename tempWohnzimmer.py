import time
import sys
import MySQLdb

mydb = MySQLdb.connect(
  host="localhost",
  user="phpmyadmin",
  passwd="b0ns@iPhpMy@dmin!",
  db="home_automation"
)

tempSensor = '/sys/bus/w1/devices/28-0194fb1d64ff/w1_slave'

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
	
def write_temp(temp):
    with open("/var/www/html/ourHouse/cpu_temp.csv", "a") as log:
        log.write("{0},{1},{2}\n".format(
                                time.strftime("%Y-%m-%d"),
                                time.strftime("%H:%M:%S"),
                                str(temp)))

def insert_into_db(temp):
    mycursor = mydb.cursor()
    sql  = "INSERT INTO sensor_temp_data(sensorId,temperature) VALUES(%s,%s)"
    values = ('Wohnzimmer', round(temp,2))
    mycursor.execute(sql, values)
    mydb.commit()

while True:
    temp = readTempLines(tempSensor)
    # print("Temperatur um " + time.strftime('%H:%M:%S') +" drinnen: " + str(temp) + " °C")
    # write_temp(temp)
    insert_into_db(temp)
    time.sleep(10)

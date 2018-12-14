from gpiozero import CPUTemperature
from time import sleep, strftime, time

import MySQLdb

mydb = MySQLdb.connect(
  host="localhost",
  user="phpmyadmin",
  passwd="b0ns@iPhpMy@dmin!",
  db="home_automation"
)

cpu = CPUTemperature()


def write_temp(temp):
    with open("/var/www/html/ourHouse/cpu_temp.csv", "a") as log:
        log.write("{0},{1},{2}\n".format(
                                strftime("%Y-%m-%d"),
                                strftime("%H:%M:%S"),
                                str(temp)))

def insert_into_db(temp):
    mycursor = mydb.cursor()
    sql  = "INSERT INTO sensor_temp_data(sensorId,temperature) VALUES(%s,%s)"
    values = ('Raspberry',round(temp, 2))
    mycursor.execute(sql, values)
    mydb.commit()

while True:
    temp = cpu.temperature 
    insert_into_db(temp)
    sleep(10)

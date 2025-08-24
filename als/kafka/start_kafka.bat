@echo off
title Starting Zookeeper and Kafka Servers
echo Starting Zookeeper...
start cmd /k "cd /d C:\kafka && bin\windows\zookeeper-server-start.bat config\zookeeper.properties"

timeout /t 10

echo Starting Kafka Server...
start cmd /k "cd /d C:\kafka && bin\windows\kafka-server-start.bat config\server.properties"

echo All servers starting... wait a few seconds before using Kafka commands!
pause

REM in C:\kafka
bin\windows\kafka-topics.bat --create ^
  --bootstrap-server localhost:9092 ^
  --replication-factor 1 ^
  --partitions 1 ^
  --topic review-events

REM to verify:
bin\windows\kafka-topics.bat --list --bootstrap-server localhost:9092

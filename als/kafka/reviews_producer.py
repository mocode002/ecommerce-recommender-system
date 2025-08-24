# kafka/producers/review_producer.py
from kafka import KafkaProducer
import json
import time

producer = KafkaProducer(
    bootstrap_servers=['localhost:19092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def produce_reviews(file_path):
    with open(file_path) as f:
        for line in f:
            review = json.loads(line)
            producer.send('review-events', review)
            print(f"Sent: {review}")
            time.sleep(0.5)  # simulate streaming
    producer.flush()


if __name__ == '__main__':
    produce_reviews('als/data/Appliances_5.json')

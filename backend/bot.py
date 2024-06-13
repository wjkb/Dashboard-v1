import os
import requests
import json
import pika
import threading
import random
import time
from datetime import datetime

# Send message to backend for database updating
def send_message_to_backend(message):
    url = 'http://localhost:5000/api/messages'
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(message), headers=headers)
    print(f"Sent message to backend: {response.status_code}")

# callback function to be called when a message is received from RabbitMQ
def on_message(ch, method, properties, body):
    message = json.loads(body)
    print(f"Received message from queue: {message}")
    send_message_to_backend(message)
    ch.basic_ack(delivery_tag=method.delivery_tag)

# Start RabbitMQ consumer
def start_rabbitmq_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='messages')

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='messages', on_message_callback=on_message)
    print("Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()

# Simulate bot activity
def simulate_bot_activity(platform, bot_id, target_url):
    user = '(Simulated) ' + target_url.split('/')[-1]
    while True:
        message = {
            # Used to create conversation object in backend
            'bot_id': bot_id,
            'platform': platform,
            'user': user,

            # Used to create message object in backend
            'timestamp': datetime.now().isoformat(),
            'message': f"(Simulated) Message from bot {bot_id} at {datetime.now().ctime()}",
            'direction': random.choice(['incoming', 'outgoing']),
        }

        # Start RabbitMQ producer
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='messages')
        channel.basic_publish(exchange='', routing_key='messages', body=json.dumps(message))
        connection.close()
        time.sleep(5)

if __name__ == "__main__":
    platform = os.sys.argv[1]
    bot_id = os.sys.argv[2]
    target_url = os.sys.argv[3]
    threading.Thread(target=start_rabbitmq_consumer).start()
    simulate_bot_activity(platform, bot_id, target_url)

import os
import json
import pika
import random
import time
from datetime import datetime

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
        print(f"(PRODUCED - by Bot ID: {message.get('bot_id')}) Sent message to RabbitMQ: {message}")
        connection.close()

        time.sleep(5)

if __name__ == "__main__":
    platform = os.sys.argv[1]
    bot_id = os.sys.argv[2]
    target_url = os.sys.argv[3]
    simulate_bot_activity(platform, bot_id, target_url)

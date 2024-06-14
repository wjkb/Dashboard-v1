import os
from flask import send_from_directory, request, Flask, make_response
from flask_cors import CORS
import time
import json
import pika
import threading
import requests
from backend.config import Config
from backend.models import db
from backend.routes import api

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    app.config['UPLOAD_FOLDER'] = 'files/'

    db.init_app(app)

    app.register_blueprint(api)

    with app.app_context():
        db.create_all()

    # Serve files from the files directory with conditional download headers
    @app.route('/files/<path:filename>')
    def serve_files(filename):
        directory = os.path.join(app.root_path, 'files')
        response = make_response(send_from_directory(directory, filename))
        # Check the 'download' query parameter
        download = request.args.get('download')
        if download == 'true':
            response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        return response
    
    # Send message to backend for database updating
    def send_message_to_backend(message):
        url = 'http://localhost:5000/api/messages'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(message), headers=headers)
        print(f"Sent the message to backend, reply status code: {response.status_code}")

    # callback function to be called when a message is received from RabbitMQ
    def on_message(ch, method, properties, body):
        message = json.loads(body)
        print(f"(CONSUMED - by FLASK SERVER) Received message from RabbitMQ: {message}")
        threading.Thread(target=send_message_to_backend, args=(message,)).start()
        ch.basic_ack(delivery_tag=method.delivery_tag)

    # Start RabbitMQ consumer
    def start_rabbitmq_consumer():
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='messages')

        channel.basic_qos(prefetch_count=10)
        channel.basic_consume(queue='messages', on_message_callback=on_message)
        print("Waiting for messages. To exit press CTRL+C")
        channel.start_consuming()

    # Run the RabbitMQ consumer in a separate thread
    consumer_thread = threading.Thread(target=start_rabbitmq_consumer, daemon=True)
    consumer_thread.start()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

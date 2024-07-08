#!/bin/bash

# Make the script executable by running the following command in the terminal:
# chmod +x linux_setup.sh

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Run RabbitMQ using Docker
gnome-terminal -- bash -c "docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management; exec bash"

# Wait for RabbitMQ to start
echo "Waiting for RabbitMQ container to start..."
until [ "$(docker inspect -f "{{.State.Running}}" rabbitmq 2> /dev/null)" == "true" ]; do
    sleep 2
done
echo "RabbitMQ container started."

# Open a new terminal for frontend initialization
gnome-terminal -- bash -c "cd frontend && npm install && npm start; exec bash"

# Wait for the frontend to start
sleep 5

# Navigate to the backend directory
cd backend

# Check if virtual environment directory exists
if [ ! -d "venv" ]; then
    # Create virtual environment
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "Failed to create virtual environment. Ensure you have the necessary permissions."
        exit 1
    fi
fi

# Activate virtual environment
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "Failed to activate virtual environment. Ensure you have the necessary permissions."
    exit 1
fi

# Install required packages
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install required packages. Ensure you have the necessary permissions."
    exit 1
fi

# Set Flask application environment variable
export FLASK_APP=__init__.py

# Open a new terminal for backend initialization
gnome-terminal -- bash -c "flask run; exec bash"

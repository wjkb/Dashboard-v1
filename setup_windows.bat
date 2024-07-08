@echo off
REM Check if Docker is installed
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed. Please install Docker Desktop first.
    exit /b
)

REM Open a new terminal to run RabbitMQ using Docker
start cmd /k "docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management"

REM Wait for RabbitMQ to start
echo Waiting for RabbitMQ container to start...
:check_docker
timeout /t 2 >nul
docker inspect -f "{{.State.Running}}" rabbitmq 2>nul | find "true" >nul
if %ERRORLEVEL% NEQ 0 (
    goto check_docker
)
echo RabbitMQ container started.

REM Open a new terminal for frontend initialization
start cmd /k "cd frontend && npm install && npm start"

REM Wait for the frontend to start
timeout /t 5

REM Navigate to the backend directory
cd backend

REM Check if virtual environment directory exists
if not exist venv (
    REM Create virtual environment
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to create virtual environment. Ensure you have the necessary permissions.
        exit /b
    )
)

REM Activate virtual environment
call venv\Scripts\activate
if %ERRORLEVEL% NEQ 0 (
    echo Failed to activate virtual environment. Ensure you have the necessary permissions.
    exit /b
)

REM Install required packages
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install required packages. Ensure you have the necessary permissions.
    exit /b
)

REM Set Flask application environment variable
set FLASK_APP=__init__.py

REM Open a new terminal for backend initialization
start cmd /k "flask run"

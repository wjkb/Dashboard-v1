from flask import Flask
from flask_cors import CORS
from backend.config import Config
from backend.models import db
from backend.routes import api

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)

    app.register_blueprint(api)

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

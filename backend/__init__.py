import os
from flask import send_from_directory
from flask import Flask
from flask_cors import CORS
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

    # Serve files from the files directory
    @app.route('/files/<path:filename>')
    def serve_files(filename):
        return send_from_directory(os.path.join(app.root_path, 'files'), filename)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

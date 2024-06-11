import os
from flask import send_from_directory, request, Flask, make_response
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

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)

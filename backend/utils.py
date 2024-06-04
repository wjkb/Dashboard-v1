import os
from werkzeug.utils import secure_filename
from flask import current_app

def save_file(platform, bot_id, user, file):
    user_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], platform, str(bot_id), user)
    os.makedirs(user_folder, exist_ok=True)
    file_path = os.path.join(user_folder, secure_filename(file.filename))
    file.save(file_path)
    return file_path

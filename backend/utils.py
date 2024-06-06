import os
from werkzeug.utils import secure_filename
from flask import current_app

def save_file(platform, bot_id, user, file):
    # Construct the path to save the file
    user_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], platform, str(bot_id), user)
    os.makedirs(user_folder, exist_ok=True)

    # Save the file
    file_path = os.path.join(user_folder, secure_filename(file.filename))
    file.save(file_path)

    # Get the file type
    file_type = file.mediatype

    # Return the relative path to the file and file type
    return file_path.replace('\\', '/'), file_type

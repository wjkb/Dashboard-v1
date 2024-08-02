import os
import zipfile
from datetime import datetime
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

def safe_parse_timestamp(timestamp, date_format='%Y-%m-%dT%H:%M:%S'):
    try:
        if timestamp is None:
            return None
        else:
            return datetime.strptime(timestamp, date_format)
    except (ValueError, TypeError):
        return None

def create_zip(file_path_list):
    parent_directory = os.path.dirname(current_app.root_path)
    media_directory = os.path.join(parent_directory, 'media')
    zip_filename = 'downloaded_files.zip'
    zip_filepath = os.path.join(media_directory, zip_filename)

    with zipfile.ZipFile(zip_filepath, 'w') as zipf:
        for relative_file_path in file_path_list:
            absolute_file_path = os.path.join(media_directory, relative_file_path)
            if os.path.exists(absolute_file_path):
                zipf.write(absolute_file_path, os.path.basename(absolute_file_path))
            else:
                print(f"File {absolute_file_path} does not exist")
    
    return zip_filename

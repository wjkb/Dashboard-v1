import os
import zipfile
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

def create_zip(file_path_list):
    zip_filename = 'files/downloaded_files.zip'
    zip_filepath = os.path.join(current_app.root_path, zip_filename)

    with zipfile.ZipFile(zip_filepath, 'w') as zipf:
        for file_path in file_path_list:
            if os.path.exists(file_path):
                zipf.write(file_path, os.path.basename(file_path))
            else:
                print(f"File {file_path} does not exist")
    
    return zip_filename

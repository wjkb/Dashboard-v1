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

def create_zip(file_path_list, zip_filename):
    parent_directory = os.path.dirname(current_app.root_path)
    media_directory = os.path.join(parent_directory, 'media')
    zip_filename = f"{zip_filename}.zip"
    zip_filepath = os.path.join(media_directory, zip_filename)

    with zipfile.ZipFile(zip_filepath, 'w') as zipf:
        for relative_file_path in file_path_list:
            absolute_file_path = os.path.join(media_directory, relative_file_path)
            if os.path.exists(absolute_file_path):
                zipf.write(absolute_file_path, os.path.basename(absolute_file_path))
            else:
                print(f"File {absolute_file_path} does not exist")
    
    return zip_filename

def create_message_csv(messages):
    # print("csv48")
    parent_directory = os.path.dirname(current_app.root_path)
    media_directory = os.path.join(parent_directory, 'media')
    csv_filename = 'downloaded_messages.csv'
    csv_filepath = os.path.join(media_directory, csv_filename)
    # print("csv53")
    with open(csv_filepath, 'w') as csvf:
        csvf.write('direction,message,date,time\n')
        for message in messages:
            try:

                timestamp = datetime.fromisoformat(str(message.message_timestamp))
                date = timestamp.date().isoformat()
                time = timestamp.time().isoformat()
            except:
                # print("message timestamp doesnt exists")
                timestamp = ""
                date = ""
                time = ""
            # print("csv60")
            csvf.write(f"{message.direction},\"{message.message_text}\",{date},{time}\n")
    # print("csv62")
    return csv_filename
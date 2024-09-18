import sys
import os
import json

sys.path.append('..')
from utils.send_utils import send_proactive_queue, send_main_convo_message
from urllib.parse import unquote
from flask import Blueprint, request, jsonify
from flask_restx import Api, Resource, fields
from datetime import datetime
import json
import requests
from backend.models import db, Bot, Scammer, Platform, Conversation, Message, MessageScreenshots, ExtractedInformation, Alert, Edit
from backend.utils import safe_parse_timestamp, create_zip, create_message_csv

#victim_Details_Json File
def find_file(filename, search_directory):
    for root, dirs, files in os.walk(search_directory):
        if filename in files:
            return os.path.join(root, filename)
    return None
current_directory = os.getcwd()
search_directory = os.path.dirname(current_directory)
VICTIM_DETAILS_PATH = find_file('victim_details.json', search_directory)
HOST_IP = os.getenv("HOST_IP")

# Initialize Flask-RESTx Api
api_bp = Blueprint('api', __name__)
api = Api(api_bp, version='1.0', title='Your API', description='API Documentation', doc='/api/docs')

#global platform mappings
platform_mapping = {
    'facebook': 'Facebook',
    'fb': 'Facebook',
    'whatsapp': 'WhatsApp',
    'wa': 'WhatsApp',
    'telegram': 'Telegram',
    'tg': 'Telegram'
}

API_mapping = {
    'facebook': 'FB',
    'fb': 'FB',
    'whatsapp': 'WA',
    'wa': 'WA',
    'telegram': 'TG',
    'tg': 'TG',
    'Facebook': 'FB',
    'WhatsApp': 'WA',
    'Telegram': 'TG'
}

# Define namespaces for Swagger documentation
ns_bots = api.namespace('bots', description='Bot operations', path='/')
ns_platform_bots = api.namespace('platform_bots', description='Platform Bot operations', path='/')
ns_conversations = api.namespace('conversations', description='Conversation operations', path='/')
ns_messages = api.namespace('messages', description='Message operations', path='/')
ns_utils = api.namespace('utils', description='Utility operations', path='/')
ns_graph_insights = api.namespace('graph_insights', description='Graph Insights operations', path='/')
ns_alerts = api.namespace('alerts', description='Alert operations', path='/')
ns_victim_details = api.namespace('victim_details', description='Victim Details operations', path='/')

# Define models for Swagger documentation
start_bot_script_model = ns_utils.model('StartBotScript', {
    'botId': fields.String(required=True, description='The bot phone number', example='90217777'),
    'scammerIds': fields.String(required=True, description='The list of scammer phone numbers', example='80216666'),
    'platform': fields.String(required=True, description='The platform the bot is talking on', example='Facebook'),
    'typeOfScam': fields.String(required=True, description='The type of scam the bot is dealing with', example='Romance scam'),
    'startingMessage': fields.String(description='The starting message to send to the scammers', example='Hello, how are you?'),
})

download_zip_model = ns_utils.model('DownloadZip', {
    'filePaths': fields.List(fields.String, required=True, description='The list of file paths to include in the zip file', example=['files/Facebook/1/User123/cat.jpg', 'files/Facebook/1/User123/cat.pdf', 'files/Facebook/1/User123/cat.txt']),
})

download_everything_model = ns_utils.model('DownloadEverything', {
    'platform': fields.String(required=True, description='The platform the bot is talking on', example='WhatsApp'),
    'botId': fields.String(required=True, description='The bot phone number', example='90217777'),
    'scammerUniqueId': fields.String(required=True, description='The scammer unique ID', example='80216666'),
})

return_next_response_message_id_model = ns_utils.model('ReturnNextResponseMessageId', {
    'platform': fields.String(required=True, description='The platform the bot is talking on', example='WhatsApp'),
    'bot_id': fields.String(required=True, description='The bot phone number', example='90217777'),
    'scammer_id': fields.String(required=True, description='The scammer phone number', example='80216666'),
})

receive_extracted_information_model = ns_messages.model('ReceiveExtractedInformation', {
    'bot_id': fields.String(required=True, description='The bot phone number', example='90217777'),
    'scammer_id': fields.String(required=True, description='The scammer phone number', example='80216666'),
    'platform': fields.String(required=True, description='The platform the bot is talking on', example='Facebook'),
    'key': fields.String(required=True, description='The key of the extracted information', example='Name'),
    'value': fields.String(required=True, description='The value of the extracted information', example='John Doe'),
})

receive_screenshot_model = ns_messages.model('ReceiveScreenshot', {
    'bot_id': fields.String(required=True, description='The bot phone number', example='90217777'),
    'scammer_id': fields.String(required=True, description='The scammer phone number', example='80216666'),
    'platform': fields.String(required=True, description='The platform the bot is talking on', example='Facebook'),
    'file_path': fields.String(required=True, description='The path to the screenshot file', example='files/Facebook/1/1/screenshot.jpg'),
})

receive_message_model = ns_messages.model('ReceiveMessage', {
    'platform': fields.String(required=True, description='The platform the bot is talking on', example='WhatsApp'),
    'bot_id': fields.String(required=True, description='The bot phone number', example='90217777'),
    'scammer_id': fields.String(required=True, description='The scammer phone number', example='80216666'),
    'direction': fields.String(required=True, description='The direction of the message, either incoming or outgoing', example='outgoing'),
    'message_id': fields.String(description='The unique identifier of the message', example='1'),
    'message_text': fields.String(description='The message content', example='This is a test message using the API in flask-restx'),
    'message_timestamp': fields.String(example='2024-07-02T12:30:44'),

    'file_path': fields.String(description='The path to the file if the message contains a file', example='files/Facebook/1/1/cat.jpg'),
    'file_type': fields.String(description='The MIME type of the file if the message contains a file', example='image/jpeg'),

    'responded_to': fields.String(description='The message IDs that this message is responding to', example='1,2,3'),
    'response_bef_generation_timestamp': fields.String(description='The timestamp before the response is generated', example='2024-07-02T12:31:44'),
    'response_aft_generation_timestamp': fields.String(description='The timestamp after the response is generated', example='2024-07-02T12:32:25'),
    'response_status': fields.String(description='The status of the response, either Sending, Sent, Failed, Deleted', example='Sent'),
    'deleted_timestamp': fields.String(description='The timestamp when response has been detected to be deleted', example='2024-07-02T12:31:44'),
    'edited_timestamp': fields.String(description='The timestamp when response has been detected to be deleted', example='2024-07-02T12:31:44'),
    'platform_type': fields.String(description='The platform type of the response', example='WhatsApp')
})

message_model = ns_messages.model('Message', {
    'id': fields.Integer(readOnly=True, description='The message unique identifier'),
    'conversation_id': fields.Integer(required=True),
    'direction': fields.String(required=True),
    'message_id': fields.String(),
    'message_text': fields.String(required=True),
    'message_timestamp': fields.String(),
    'use_for_llm': fields.Boolean(default=True),

    'file_path': fields.String(),
    'file_type': fields.String(),

    'responded_to': fields.String(),
    'response_bef_generation_timestamp': fields.String(),
    'response_aft_generation_timestamp': fields.String(),
    'response_status': fields.String(),

    'deleted_timestamp': fields.String(),
    'edited_timestamp': fields.String(),
    'platform_type': fields.String()
})

conversation_model = ns_conversations.model('Conversation', {
    'id': fields.Integer(readOnly=True, description='The conversation unique identifier'),
    'bot_id': fields.String(required=True),
    'scammer_id': fields.Integer(required=True),
    'scammer_unique_id': fields.String(required=True),
    'platform': fields.String(required=True),
    'messages': fields.List(fields.Nested(message_model)), 
    'pause': fields.Boolean(default=False)
})


bot_model_2 = ns_bots.model('Bot2', {
    'id': fields.String(required=True, example='90217777'),
    'name': fields.String(required=False, example='John Doe'),
    'email': fields.String(example='johndoe@gmail.com'),
    'persona': fields.String(required=False, example='Middle-aged man'),
    'model': fields.String(required=True, example='Llama 3'),
    'platforms': fields.List(fields.String, required=True, example=['Facebook', 'WhatsApp']),
})

bot_model_1 = ns_bots.model('Bot1', {
    'id': fields.String(required=True, description='The bot phone number is used as the unique identifier'),
    'active': fields.Boolean(required=True, default=True),
    'name': fields.String(required=False),
    'email': fields.String(),
    'persona': fields.String(required=False),
    'model': fields.String(required=True),
    'platforms': fields.List(fields.String, required=True),
    'health_status': fields.Raw(default={}, description='Health status of the bot on each platform'),
    'conversations': fields.List(fields.Integer),
    'pause': fields.Boolean(required=True, default=False)
})

create_alert_model = ns_alerts.model('CreateAlert', {
    'scammer_unique_id': fields.String(required=True, description='The unique ID of the scammer', example='unique_scammer_123'),
    'direction': fields.String(required=True, description='The direction of the alert', example='incoming'),
    'alert_type': fields.String(required=True, description='The type of alert', example='warning'),
    'platform_type': fields.String(required=True, description='The type of platform', example='Facebook'),
    'message_id': fields.String(description='The ID of the associated message', example='msg_123'),
    'message_text': fields.String(required=True, description='The alert message', example='This scammer has deleted a message.'),
    'read_status': fields.Boolean(description='Whether the alert has been read', example=False),
    'timestamp': fields.DateTime(description='The timestamp of the alert', example='2024-08-21T14:30:00'),
    'bot_id': fields.String(description='The ID of the bot associated with the alert', example='bot_001'),
    'active' : fields.String(description='Whether the alert has been deleted', example=False)
})

create_edit_model = ns_messages.model('CreateEdit', {
    'scammer_unique_id': fields.String(required=True, description='The unique ID of the scammer', example='unique_scammer_123'),
    'original_message_text': fields.String(required=True, description='The text of the original message', example='Hello, how are you?'),
    'direction': fields.String(required=True, description='The direction of the edit', example='outgoing'),
    'platform_type': fields.String(required=True, description='The type of platform', example='WhatsApp'),
    'message_id': fields.String(description='The ID of the associated message', example='msg_123'),
    'edited_message_text': fields.String(required=True, description='The updated message text after editing', example='Edited message text.'),
    'bot_id': fields.String(description='The ID of the bot associated with the edit', example='bot_001'),
    'edited_timestamp': fields.DateTime(description='The timestamp of the edit', example='2024-08-21T15:00:00'),
})

##################################################
# Below are the routes for all the API endpoints #
##################################################

#General Utility Routes
@ns_bots.route('/api/bots')
class CreateOrReadBots(Resource):
    @ns_bots.doc('list_bots')
    @ns_bots.marshal_list_with(bot_model_1)
    def get(self):
        try:
            bots = Bot.query.all()
            return [bot.serialize() for bot in bots], 200
        except Exception as e:
            return {'error': str(e)}, 500
    
    @ns_bots.expect(bot_model_2)
    @ns_bots.marshal_with(bot_model_1, code=201)
    def post(self):
        try:
            data = request.json
            print(f"Received data: {data}")

            # Check if all required fields are present
            required_fields = ['id', 'name', 'persona', 'model', 'platforms']
            for field in required_fields:
                print(f"Checking field: {field}")
                if field not in data:
                    return {"error": f"Missing required field: {field}"}, 400

            new_bot = Bot(
                id=data['id'],
                name=data['name'],
                email=data.get('email', ''), 
                persona=data['persona'],
                model=data['model']
            )
            db.session.add(new_bot)
            db.session.commit()
            print(f"Created bot: {new_bot.serialize()}")

            for platform in data['platforms']:
                new_platform = Platform(bot_id=new_bot.id, platform=platform)
                db.session.add(new_platform)
                print(f"Added platform: {platform}")

            db.session.commit()
            return new_bot.serialize(), 201
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

@ns_bots.route('/api/bots/<bot_id>')
class GetorUpdateOrDeleteBot(Resource):
    @ns_bots.doc('get_bot')
    @ns_bots.marshal_with(bot_model_1)
    def get(self, bot_id):
        try:
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404
            return bot.serialize(), 200
        except Exception as e:
            return {"error": "Internal Server Error"}, 500

    @ns_bots.doc('update_bot')
    @ns_bots.expect(bot_model_2)
    @ns_bots.marshal_with(bot_model_1, code=200)
    def put(self, bot_id):
        try:
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404

            data = request.json

            # Update bot details
            bot.id = data.get('id', bot.id)
            bot.name = data.get('name', bot.name)
            bot.email = data.get('email', bot.email)
            bot.persona = data.get('persona', bot.persona)
            bot.model = data.get('model', bot.model)

            # Update platforms
            new_platforms = data.get('platforms', [])
            existing_platforms = {platform.platform for platform in bot.platforms}

            # Add new platforms
            for platform_name in new_platforms:
                if platform_name not in existing_platforms:
                    new_platform = Platform(bot_id=bot.id, platform=platform_name)
                    db.session.add(new_platform)

            # Remove platforms that are no longer selected
            for platform in bot.platforms:
                if platform.platform not in new_platforms:
                    db.session.delete(platform)

            db.session.commit()

            return {"message": "Bot updated successfully"}, 200
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500
    
    @ns_bots.doc('delete_bot')
    def delete(self, bot_id):
        try:
            print(f"Deleting bot with id: {bot_id}")
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404
            
            # Get all conversations related to the bot
            conversations = Conversation.query.filter_by(bot_id=bot_id).all()
            for conversation in conversations:
                # Delete all related messages using the unified Message model
                Message.query.filter_by(conversation_id=conversation.id).delete()
            
            # Delete all conversations
            Conversation.query.filter_by(bot_id=bot_id).delete()

            # Delete all platforms related to the bot
            Platform.query.filter_by(bot_id=bot_id).delete()

            # Delete the bot itself
            db.session.delete(bot)
            db.session.commit()
            
            return {"message": "Bot and related data deleted successfully"}, 200
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

        
@ns_bots.route('/api/bots/<bot_id>/deactivate')
class DeactivateBot(Resource):
    @ns_bots.doc('deactivate_bot')
    def put(self, bot_id):
        try:
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404
            
            bot.active = False
            db.session.commit()
            return {"message": "Bot deactivated successfully"}, 200
        except Exception as e:
            return {"error": "Internal Server Error"}, 500
        
@ns_bots.route('/api/bots/<bot_id>/activate')
class ActivateBot(Resource):
    @ns_bots.doc('activate_bot')
    def put(self, bot_id):
        try:
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404
            
            bot.active = True
            db.session.commit()
            return {"message": "Bot activated successfully"}, 200
        except Exception as e:
            return {"error": "Internal Server Error"}, 500
            
@ns_bots.route('/api/bots/<bot_id>/toggle_pause_selectively')
class TogglePauseBotSelectively(Resource):
    @ns_bots.doc('toggle_pause_bot_selectively')
    def put(self, bot_id):
        try:
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404

            # Toggle bot pause status
            bot.pause = not bot.pause
            db.session.commit()

            # If the bot is resumed, process related conversations
            if not bot.pause:
                conversations = Conversation.query.filter_by(bot_id=bot_id).all()

                for conversation in conversations:
                    # Check if there are any incoming messages for the conversation
                    pause_conversation = False

                    last_message = (
                        db.session.query(Message)
                        .filter_by(conversation_id=conversation.id)
                        .order_by(Message.message_timestamp.desc())
                        .first()
                    )

                    # Pause conversation if the last message is incoming
                    if last_message and last_message.direction == "incoming":
                        pause_conversation = True

                    # Pause conversation if it was not paused originally
                    if conversation.pause == False:
                        conversation.pause = pause_conversation
                    
                    db.session.commit()

            return {"message": "Bot pause status updated successfully to " + str(bot.pause)}, 200
        except Exception as e:
            return {"error": "Internal Server Error: " + str(e)}, 500

@ns_conversations.route('/api/conversations/toggle_pause')
class TogglePauseConversation(Resource):
    def put(self):
        try:
            data = request.get_json()
            platform = data.get('platform')
            bot_id = data.get('bot_id')
            scammer_unique_id = data.get('scammer_unique_id')
            
            if not platform or not bot_id or not scammer_unique_id:
                return {'error': 'Missing required parameters'}, 400

            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404

            conversation.pause = not conversation.pause
            db.session.commit()

            # If conversation is resumed, execute additional logic
            if not conversation.pause:
                scammer_unique_id = Scammer.query.get(conversation.scammer_id).unique_id

                # Get all platform messages for this conversation
                platform_messages = (
                    db.session.query(Message)
                    .filter_by(conversation_id=conversation.id, platform_type=platform_name)
                    .order_by(Message.message_timestamp.asc())
                    .all()
                )

                # Get the last outgoing message
                last_outgoing_message = (
                    db.session.query(Message)
                    .filter_by(conversation_id=conversation.id, direction='outgoing', platform_type=platform_name)
                    .order_by(Message.message_timestamp.desc())
                    .first()
                )

                if last_outgoing_message:
                    messages_to_send = [
                        msg for msg in platform_messages
                        if msg.direction == 'incoming' and msg.message_timestamp > last_outgoing_message.message_timestamp
                    ]
                else:
                    messages_to_send = [
                        msg for msg in platform_messages if msg.direction == 'incoming'
                    ]

                wanted_fields = ['platform', 'bot_id', 'scammer_id', 'direction', 'message_id', 'message_text', 'message_timestamp']

                def select_wanted_fields(message: dict, wanted_fields: list = wanted_fields):
                    return {key: value for key, value in message.items() if key in wanted_fields}

                message_list = []
                for message in messages_to_send:
                    message_data = message.serialize()
                    message_data['platform'] = API_mapping[platform_name]
                    message_data['bot_id'] = bot_id
                    message_data['scammer_id'] = scammer_unique_id
                    filtered_message = select_wanted_fields(message_data, wanted_fields)
                    message_list.append(filtered_message)

                if message_list:
                    send_main_convo_message(message_list)

            return {"message": "Conversation pause status toggled", "pause": conversation.pause}, 200

        except Exception as e:
            return {"error": "Internal Server Error: " + str(e)}, 500

@ns_conversations.route('/api/conversations/pause_conversation')
class PauseConversation(Resource):
    def post(self):
        try:
            data = request.get_json()
            platform = data.get('platform')
            bot_id = data.get('bot_id')
            scammer_unique_id = data.get('scammer_unique_id')
            
            if not platform or not bot_id or not scammer_unique_id:
                return {'error': 'Missing required parameters'}, 400

            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404

            conversation.pause = True
            db.session.commit()

            return {"message": f"Conversation pause status set to True", "pause": conversation.pause}, 200

        except Exception as e:
            return {"error": "Internal Server Error: " + str(e)}, 500


@ns_platform_bots.route('/api/<platform>/bots')
class PlatformBots(Resource):
    @ns_platform_bots.doc('list_platform_bots')
    @ns_platform_bots.marshal_list_with(bot_model_1)
    def get(self, platform):
        try:
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400
            
            bots = (
                db.session.query(Bot)
                .join(Platform, Platform.bot_id == Bot.id)
                .filter(Platform.platform == platform_name)
                .all()
            )

            return [bot.serialize() for bot in bots]
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

@ns_conversations.route('/api/<platform>/bots/<bot_id>/conversations')
class BotConversations(Resource):
    @ns_conversations.doc('list_conversations')
    @ns_conversations.marshal_list_with(conversation_model)
    def get(self, platform, bot_id):
        try:
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            # Get all conversations related to the bot, and join scammer phone number to the response
            conversations = (
                db.session.query(Conversation, Scammer.unique_id)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name)
                .all()
            )

            response = []
            for conv, scammer_unique_id in conversations:
                conv_data = conv.serialize()
                conv_data['scammer_unique_id'] = scammer_unique_id

                response.append(conv_data)

            return response

        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

@ns_messages.route('/api/<platform>/bots/<bot_id>/conversations/<scammer_unique_id>')
class BotConversationMessages(Resource):
    @ns_messages.doc('list_messages')
    @ns_messages.marshal_list_with(message_model)
    def get(self, platform, bot_id, scammer_unique_id):
        try:
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            # Find the conversation based on bot_id, platform, and scammer_unique_id
            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404

            # Query messages related to the conversation, filtered by platform
            messages = (
                db.session.query(Message)
                .filter_by(conversation_id=conversation.id, platform_type=platform_name)
                .order_by(Message.message_timestamp.asc())
                .all()
            )

            return [msg.serialize() for msg in messages]

        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500


@ns_messages.route('/api/<platform>/bots/<bot_id>/conversations/<scammer_unique_id>/screenshots')
class BotConversationScreenshots(Resource):
    @ns_messages.doc('get_screenshots')
    def get(self, platform, bot_id, scammer_unique_id):
        try:
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400
            
            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404
            
            screenshots = MessageScreenshots.query.filter_by(conversation_id=conversation.id).order_by(MessageScreenshots.id).all()
            return [screenshot.serialize() for screenshot in screenshots]
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

@ns_messages.route('/api/<platform>/bots/<bot_id>/conversations/<scammer_unique_id>/extracted_information')
class BotConversationInformation(Resource):
    @ns_messages.doc('get_conversation_info')
    def get(self, platform, bot_id, scammer_unique_id):
        try:
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400
            
            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404
            
            extracted_information = ExtractedInformation.query.filter_by(conversation_id=conversation.id).all()
            return [info.serialize() for info in extracted_information]
        except Exception as e:
            return {'error': "Internal Server Error"}, 500

@ns_messages.route('/api/messages')
class ReceiveMessage(Resource):
    @ns_messages.doc('add_message')
    @ns_messages.expect(receive_message_model)
    def post(self):
        data = request.get_json()
        
        platform_name = platform_mapping.get(data['platform'].lower())
        if not platform_name:
            return {'status': 'error', 'message': 'Unsupported platform'}, 400

        bot_id = data['bot_id']
        scammer_unique_id = data['scammer_id']
        direction = data['direction']
        message_id = data.get('message_id', None)
        message_text = data.get('message_text', None)
        message_timestamp = data.get('message_timestamp', None)

        file_path = data.get('file_path', None)
        file_type = data.get('file_type', None)

        responded_to = data.get('responded_to', None)
        response_bef_generation_timestamp = data.get('response_bef_generation_timestamp', None)
        response_aft_generation_timestamp = data.get('response_aft_generation_timestamp', None)
        response_status = data.get('response_status', None)

        deleted_timestamp = data.get('deleted_timestamp', None)
        edited_timestamp = data.get('edited_timestamp', None)
        platform_type = data.get('platform_type', None)

        # Check if bot exists, if not return an error
        bot = Bot.query.get(bot_id)
        if not bot:
            return {'status': 'error', 'message': 'Bot not found'}, 404
        
        # Check if scammer exists, if not create a new scammer
        scammer = Scammer.query.filter_by(unique_id=scammer_unique_id, platform=platform_name).first()
        if not scammer:
            scammer = Scammer(unique_id=scammer_unique_id, platform=platform_name)
            db.session.add(scammer)
            db.session.commit()

        # Check if conversation exists, if not create a new conversation
        conversation = Conversation.query.filter_by(
            bot_id=bot.id,
            platform=platform_name,
            scammer_id=scammer.id
        ).first()
        if not conversation:
            conversation = Conversation(
                bot_id=bot.id,
                platform=platform_name,
                scammer_id=scammer.id
            )
            db.session.add(conversation)
            db.session.commit()

        # Create or update message object
        message = Message.query.filter_by(
            conversation_id=conversation.id, 
            direction=direction, 
            message_id=message_id
        ).first()

        if not message:
            message = Message(
                conversation_id=conversation.id,
                direction=direction,
                message_id=message_id,
                message_text=message_text,
                message_timestamp=safe_parse_timestamp(message_timestamp),
                file_path=file_path,
                file_type=file_type,
                responded_to=responded_to,
                response_bef_generation_timestamp=safe_parse_timestamp(response_bef_generation_timestamp),
                response_aft_generation_timestamp=safe_parse_timestamp(response_aft_generation_timestamp),
                response_status=response_status,
                platform_type=platform_type
            )
            db.session.add(message)
        else:
            # Update existing message
            message.message_text = message_text
            message.file_path = file_path
            message.file_type = file_type
            message.deleted_timestamp = safe_parse_timestamp(deleted_timestamp)
            message.edited_timestamp = safe_parse_timestamp(edited_timestamp)
            message.response_status = response_status
            message.responded_to = responded_to
            message.response_bef_generation_timestamp = safe_parse_timestamp(response_bef_generation_timestamp)
            message.response_aft_generation_timestamp = safe_parse_timestamp(response_aft_generation_timestamp)

        # Commit the changes to the database
        db.session.commit()

        return {"message": "Message processed successfully"}, 201


@ns_messages.route('/api/llm_ignore_message_history')
class LLMIgnoreMessageHistory(Resource):
    @ns_messages.doc('llm_ignore_message_history')
    def put(self):
        try:
            data = request.get_json()
            platform_name = platform_mapping.get(data.get('platform').lower())
            if not platform_name:
                return {'status': 'error', 'message': 'Unsupported platform'}, 400
            
            bot_id = data['botId']
            scammer_unique_id = data['scammerUniqueId']
            
            # Get the bot
            bot = Bot.query.get(bot_id)
            if not bot:
                return {'status': 'error', 'message': 'Bot not found'}, 404
            
            # Get the scammer
            scammer = Scammer.query.filter_by(unique_id=scammer_unique_id, platform=platform_name).first()
            if not scammer:
                return {'status': 'error', 'message': 'Scammer not found'}, 404
            
            # Get the conversation
            conversation = Conversation.query.filter_by(bot_id=bot.id, platform=platform_name, scammer_id=scammer.id).first()
            if not conversation:
                return {'status': 'error', 'message': 'Conversation not found'}, 404
            
            # Get all messages in the conversation, filtered by platform_type
            messages = Message.query.filter_by(conversation_id=conversation.id, platform_type=platform_name).all()

            # Set use_for_llm to False for all messages
            for message in messages:
                message.use_for_llm = False

            db.session.commit()
            return {'status': 'success'}, 200
        except Exception as e:
            return {'status': 'error', 'message': str(e)}, 500

    
@ns_messages.route('/api/screenshots')
class ReceiveScreenshot(Resource):
    @ns_messages.doc('add_screenshot')
    @ns_messages.expect(receive_screenshot_model)
    def post(self):
        data = request.get_json()

        platform_name = platform_mapping.get(data['platform'].lower())
        if not platform_name:
            return {'status': 'error', 'message': 'Unsupported platform'}, 400
        
        bot_id = data['bot_id']
        scammer_unique_id = data['scammer_id']
        file_path = data['file_path']

        # Check if bot exists, if not return an error
        bot = Bot.query.get(bot_id)
        if not bot:
            return {'status': 'error', 'message': 'Bot not found'}, 404
        
        # Check if scammer exists, if not create a new scammer
        scammer = Scammer.query.filter_by(unique_id=scammer_unique_id, platform=platform_name).first()
        if not scammer:
            scammer = Scammer(unique_id=scammer_unique_id, platform=platform_name)
            db.session.add(scammer)
            db.session.commit()

        # Check if conversation exists, if not create a new conversation
        conversation = Conversation.query.filter_by(
            bot_id=bot.id,
            platform=platform_name,
            scammer_id=scammer.id
        ).first()
        if not conversation:
            conversation = Conversation(
                bot_id=bot.id,
                platform=platform_name,
                scammer_id=scammer.id
            )
            db.session.add(conversation)
            db.session.commit()

        new_screenshot = MessageScreenshots(
            conversation_id=conversation.id,
            file_path=file_path
        )
        db.session.add(new_screenshot)
        db.session.commit()
        return {'status': 'success'}, 201

@ns_messages.route('/api/extracted_information')
class ReceiveExtractedInformation(Resource):
    @ns_messages.doc('add_conversation_info')
    @ns_messages.expect(receive_extracted_information_model)
    def post(self):
        data = request.get_json()

        platform_name = platform_mapping.get(data['platform'].lower())
        if not platform_name:
            return {'status': 'error', 'message': 'Unsupported platform'}, 400
        
        bot_id = data['bot_id']
        scammer_unique_id = data['scammer_id']
        key = data['key']
        value = data['value']

        # Check if bot exists, if not return an error
        bot = Bot.query.get(bot_id)
        if not bot:
            return {'status': 'error', 'message': 'Bot not found'}, 404
        
        # Check if scammer exists, if not return an error
        scammer = Scammer.query.filter_by(unique_id=scammer_unique_id, platform=platform_name).first()
        if not scammer:
            return {'status': 'error', 'message': 'Scammer not found'}, 404
        
        conversation = Conversation.query.filter_by(
            bot_id=bot.id,
            platform=platform_name,
            scammer_id=scammer.id).first()
        if not conversation:
            return {'status': 'error', 'message': 'Conversation not found'}, 404
        
        new_info = ExtractedInformation(
            conversation_id=conversation.id,
            key=key,
            value=value
        )
        db.session.add(new_info)
        db.session.commit()
        return {'status': 'success'}, 201

@ns_utils.route('/api/get_next_response_message_id')
class GetNextResponseMessageId(Resource):
    @ns_utils.expect(return_next_response_message_id_model)
    def post(self):
        try:
            data = request.get_json()
            platform_name = platform_mapping.get(data.get('platform').lower())
            
            if not platform_name:
                return {'status': 'error', 'message': 'Unsupported platform'}, 400
            
            bot_id = data.get('bot_id')
            scammer_unique_id = data.get('scammer_id')

            # Get the bot
            bot = Bot.query.get(bot_id)
            if not bot:
                return {'status': 'error', 'message': 'Bot not found'}, 404

            # Get the scammer
            scammer = Scammer.query.filter_by(unique_id=scammer_unique_id, platform=platform_name).first()
            if not scammer:
                return {'next_message_id': '1'}, 200

            # Get the conversation. If no conversation yet, return message_id 1
            conversation = Conversation.query.filter_by(bot_id=bot_id, platform=platform_name, scammer_id=scammer.id).first()
            if not conversation:
                return {'next_message_id': '1'}, 200

            # Get the last outgoing message from the bot
            last_bot_message = (
                db.session.query(Message)
                .filter_by(conversation_id=conversation.id, direction='outgoing', platform_type=platform_name)
                .order_by(Message.message_timestamp.desc())
                .first()
            )

            # Determine the next message ID
            if last_bot_message:
                return {'next_message_id': str(int(last_bot_message.message_id) + 1)}, 200
            else:
                return {'next_message_id': '1'}, 200

        except Exception as e:
            print(f"Error getting next message id: {e}")
            return {'status': 'error', 'message': str(e)}, 500


# TODO: This is just a route to simulate starting a bot script with fake messages. Replace with actual bot script execution
@ns_utils.route('/api/send_bot')
class SendBot(Resource):
    @ns_utils.expect(start_bot_script_model)
    def post(self):
        try:
            data = request.get_json()
            bot_id = data.get('botId')
            scammer_ids = data.get('scammerIds')
            platform = API_mapping[data.get('platform').lower()]
            type_of_scam = data.get('typeOfScam')
            starting_message = data.get('startingMessage')

            if not bot_id or not scammer_ids or not platform or not type_of_scam:
                return {'status': 'error', 'message': 'Missing required fields'}, 400
            
            bot = Bot.query.get(bot_id)
            if not bot:
                return {'status': 'error', 'message': 'Bot not found'}, 404
            
            # Update health status to running
            new_health_status = json.loads(bot.health_status)
            new_health_status[data.get('platform')] = 'running'
            bot.set_health_status(new_health_status)
            db.session.commit()

            scammer_ids = scammer_ids.split(',')
            for scammer_unique_id in scammer_ids:
                next_response_data = {
                    "platform": platform,
                    "bot_id": bot_id,
                    "scammer_id": scammer_unique_id
                }
                response = requests.post(f'http://localhost:5000/api/get_next_response_message_id', json=next_response_data)
                next_message_id = response.json().get('next_message_id')
                message = {
                    "platform": platform,
                    "bot_id": bot_id,
                    "scammer_id": scammer_unique_id,
                    "direction": "outgoing",
                    "message_id": next_message_id,
                    "message_text": starting_message,
                    "message_timestamp": datetime.now().isoformat(timespec='seconds'),
                    "response_status": "Sending"
                }
                send_proactive_queue(message)

                # Update database with new platform message
                response = requests.post('http://localhost:5000/api/messages', json=message)

        except Exception as e:
            return {'status': 'error', 'message': str(e)}, 500
        
@ns_utils.route('/api/send_proactive_message')
class SendProactiveMessage(Resource):
    def post(self):
        try:
            data = request.get_json()
            bot_id = data.get('botId')
            scammer_unique_id = data.get('scammerId')
            platform = API_mapping[data.get('platform').lower()]
            message = data.get('message')

            bot = Bot.query.get(bot_id)
            if not bot:
                return {'status': 'error', 'message': 'Bot not found'}, 404

            # if not bot.pause:
            #     return {'status': 'error', 'message': 'Bot is running. Pause first!'}, 400
            
            next_response_data = {
                "platform": platform,
                "bot_id": bot_id,
                "scammer_id": scammer_unique_id
            }
            response = requests.post('http://localhost:5000/api/get_next_response_message_id', json=next_response_data)
            next_message_id = response.json().get('next_message_id')
            
            message = {
                "platform": platform,
                "bot_id": bot_id,
                "scammer_id": scammer_unique_id,
                "direction": "outgoing",
                "message_id": next_message_id,
                "message_text": message,
                "message_timestamp": datetime.now().isoformat(timespec='seconds'),
                "response_status": "Sending"
            }
            send_proactive_queue(message)

            # Update database with new platform message
            response = requests.post('http://localhost:5000/api/messages', json=message)

            return {"status": "success", "message": "Proactive message sent successfully"}, 200
        
        except Exception as e:
            return {'status': 'error', 'message': str(e)}, 500
    
@ns_utils.route('/download/zip')
class DownloadFilesZip(Resource):
    @ns_utils.expect(download_zip_model)
    def post(self):
        data = request.get_json()
        file_paths = data.get('filePaths', [])
        try:
            zip_file_path = create_zip(file_paths, 'downloaded_files')
            return {'zipFileUrl': f'http://localhost:5000/{zip_file_path}'}
        except Exception as e:
            return {'error': str(e)}, 500
        
@ns_utils.route('/download/everything')
class DownloadEverything(Resource):
    @ns_utils.expect(download_everything_model)
    def post(self):
        try:
            data = request.get_json()
            bot_id = data.get('botId')
            platform = data.get('platform')
            scammer_unique_id = data.get('scammerUniqueId')

            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Unsupported platform'}, 400
            
            bot = Bot.query.get(bot_id)
            if not bot:
                return {'error': 'Bot not found'}, 404
            
            scammer = Scammer.query.filter_by(unique_id=scammer_unique_id, platform=platform_name).first()
            if not scammer:
                return {'error': 'Scammer not found'}, 404
            
            conversation = Conversation.query.filter_by(bot_id=bot_id, platform=platform_name, scammer_id=scammer.id).first()
            if not conversation:
                return {'error': 'Conversation not found'}, 404
            
            # Get all messages related to the conversation and platform
            messages = Message.query.filter_by(conversation_id=conversation.id, platform_type=platform_name).all()

            # Get all files (i.e. attachments) in the conversation
            file_paths = [msg.file_path for msg in messages if msg.file_path]
            zip_file_path = create_zip(file_paths, 'downloaded_files')

            # Get all screenshots in the conversation
            screenshots = MessageScreenshots.query.filter_by(conversation_id=conversation.id).all()
            screenshot_file_paths = [screenshot.file_path for screenshot in screenshots]
            screenshot_zip_file_path = create_zip(screenshot_file_paths, 'downloaded_screenshots')
            
            # Get all messages in CSV format
            csv_file_path = create_message_csv(messages)

            # Create a new zip file with all the files
            all_files = [zip_file_path, screenshot_zip_file_path, csv_file_path]
            all_files_zip_path = create_zip(all_files, 'downloaded_all_files')

            return {'zipFileUrl': f'http://localhost:5000/{all_files_zip_path}'}
        
        except Exception as e:
            return {'error': str(e)}, 500
       
@ns_utils.route('/api/check_overall_pause_status')
class CheckOverallPauseStatus(Resource):
    def post(self):

        try:
            data = request.get_json()

            platform_name = data.get('platform')
            bot_id = data.get('bot_id')
            scammer_id = data.get('scammer_id')

            if platform_name is None:
                return {'status': 'error', 'message': 'Unknown platform'}, 400

            if bot_id is None:
                return {'status': 'error', 'message': 'Unknown bot id'}, 400

            if scammer_id is None:
                return {'status': 'error', 'message': 'Unknown scammer id'}, 400

            # Check if bot is paused
            bot = Bot.query.get(bot_id)
            if not bot:
                return {'status': 'error', 'message': 'Bot not found'}, 404
            
            if bot.pause:
                return {'pause': True}, 200
            
            else:
                # Check if conversation is paused
                platform_name = platform_mapping[platform_name.lower()]
                conversation = (
                    db.session.query(Conversation)
                    .join(Scammer, Conversation.scammer_id == Scammer.id)
                    .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_id)
                    .first()
                )
                if not conversation:
                    return {"error": "Conversation not found"}, 404
                
                return {"pause": conversation.pause}, 200
        except Exception as e:

            return  {"error": f"Error sending pause status: {e}"}, 400


@ns_graph_insights.route('/api/conversation_count')
class ConversationCount(Resource):
    def get(self):
        try:
            facebook_conversations = Conversation.query.filter_by(platform='Facebook').all()
            whatsapp_conversations = Conversation.query.filter_by(platform='WhatsApp').all()
            telegram_conversations = Conversation.query.filter_by(platform='Telegram').all()
            return {
                'facebook': len(facebook_conversations),
                'whatsapp': len(whatsapp_conversations),
                'telegram': len(telegram_conversations)
            }
        except Exception as e:
            return {'error': str(e)}, 500

@ns_graph_insights.route('/api/message_count')
class MessageCount(Resource):
    def get(self):
        try:
            # Count messages for each platform based on the platform_type field
            facebook_messages_count = Message.query.filter_by(platform_type='Facebook').count()
            whatsapp_messages_count = Message.query.filter_by(platform_type='WhatsApp').count()
            telegram_messages_count = Message.query.filter_by(platform_type='Telegram').count()
            
            return {
                'facebook': facebook_messages_count,
                'whatsapp': whatsapp_messages_count,
                'telegram': telegram_messages_count
            }
        except Exception as e:
            return {'error': str(e)}, 500


@ns_graph_insights.route('/api/recent_messages/<platform>')
class RecentMessages(Resource):
    def get(self, platform):
        try:
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Unsupported platform'}, 400

            # Query messages filtered by platform_type
            messages = (
                db.session.query(Message)
                .filter_by(platform_type=platform_name)
                .join(Conversation, Conversation.id == Message.conversation_id)
                .join(Scammer, Scammer.id == Conversation.scammer_id)
                .order_by(Message.message_timestamp.desc())
                .limit(5)
                .all()
            )
            
            # Serialize the messages along with conversation and scammer details
            response = []
            for msg in messages:
                # Get the conversation related to the message
                conversation = Conversation.query.get(msg.conversation_id)
                # Get the scammer related to the conversation
                scammer = Scammer.query.get(conversation.scammer_id)
                if conversation:
                    # Add conversation and scammer details to the message serialization
                    message_data = msg.serialize()
                    message_data.update({
                        'bot_id': conversation.bot_id,
                        'platform': conversation.platform,
                        'scammer_id': conversation.scammer_id,
                        'scammer_unique_id': scammer.unique_id
                    })
                    response.append(message_data)
            
            return response
        
        except Exception as e:
            return {'error': str(e)}, 500

@ns_alerts.route('/api/alerts')
class ReceiveAlerts(Resource):
    @ns_alerts.expect(create_alert_model)
    def post(self):
        try:
            data = request.get_json()

            new_alert = Alert(
                scammer_unique_id=data['scammer_unique_id'], 
                direction=data.get('direction', None),
                alert_type=data['alert_type'],
                platform_type=platform_mapping[data['platform_type'].lower()],
                message_id=data.get('message_id'),
                message_text=data.get('message_text', None),
                read_status=data.get('read_status', False),
                timestamp=safe_parse_timestamp(data.get('timestamp', None)), 
                bot_id=data.get('bot_id'),
                active=data.get('active', True)
            )

            db.session.add(new_alert)
            db.session.commit()

            return {'message': 'Alert created successfully', 'alert': new_alert.serialize()}, 201
        except Exception as e:
            return {'error': str(e)}, 500

    def get(self):
        try:
            alerts = Alert.query.filter_by(active=True).order_by(Alert.timestamp.desc()).all()
            serialized_alerts = [alert.serialize() for alert in alerts]
            unread_count = Alert.query.filter_by(read_status=False, active=True).count()
            return {'alerts': serialized_alerts, 'unread_count': unread_count}, 200
        except Exception as e:
            return {'error': str(e)}, 500
        
@ns_alerts.route('/api/alerts/<int:alert_id>/mark_read')
class MarkAlertAsRead(Resource):
    def put(self, alert_id):
        try:
            alert = Alert.query.get(alert_id)
            if not alert:
                return {'message': 'Alert not found'}, 404

            alert.read_status = True
            db.session.commit()

            return {'message': 'Alert marked as read'}, 200
        except Exception as e:
            return {'error': str(e)}, 500

@ns_alerts.route('/api/alerts/mark_all_read')
class MarkAllAlertsAsRead(Resource):
    def put(self):
        try:
            alerts = Alert.query.filter_by(read_status=False).all()
            for alert in alerts:
                alert.read_status = True
            db.session.commit()

            return {'message': 'All alerts marked as read'}, 200
        except Exception as e:
            return {'error': str(e)}, 500

@ns_alerts.route('/api/alerts/<int:alert_id>/mark_unread')
class MarkAlertAsUnread(Resource):
    def put(self, alert_id):
        try:
            alert = Alert.query.get(alert_id)
            if not alert:
                return {'message': 'Alert not found'}, 404

            alert.read_status = False
            db.session.commit()

            return {'message': 'Alert marked as unread'}, 200
        except Exception as e:
            return {'error': str(e)}, 500

@ns_alerts.route('/api/alerts/get')
class GetAlerts(Resource):
    def get(self):
        try:
            alerts = Alert.query.order_by(Alert.timestamp.desc()).all()
            unread_count = Alert.query.filter_by(read_status=False).count()
            serialized_alerts = [alert.serialize() for alert in alerts]
            return {'alerts': serialized_alerts, 'unread_count': unread_count}, 200
        except Exception as e:
            return {'error': str(e)}, 500

@ns_alerts.route('/api/alerts/get_specific')
class GetAlertsSpecific(Resource):
    @ns_messages.doc('get_alerts_specific')
    def post(self):
        """Uses JSON body in POST request to pass platform, bot_id, scammer_unique_id

        Example:
            {
                "platform": "WhatsApp",
                "bot_id": "+6590000001",
                "scammer_unique_id": "90000012"
            }

        Returns:
            alerts, unread_count
        """
        try:
            # Access parameters from the JSON body
            data = request.get_json()

            # Extract the parameters from the JSON data
            platform = data.get('platform')
            bot_id = data.get('bot_id')
            scammer_unique_id = data.get('scammer_unique_id')

            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            try:
                # Filter alerts that are unread and active
                alerts = Alert.query.filter(
                    Alert.bot_id == bot_id,
                    Alert.platform_type == platform_name,
                    Alert.scammer_unique_id == scammer_unique_id,
                    Alert.read_status == False,  # Only unread alerts
                    Alert.active == True  # Only active alerts (not deleted)
                ).all()
                unread_count = len(alerts)  # Since only unread alerts are selected
                serialized_alerts = [alert.serialize() for alert in alerts]
    
                return {'alerts': serialized_alerts, 'unread_count': unread_count}, 200
            except Exception as e:
                print(e)
                return {'alerts': [], 'unread_count': 0}, 200
        except Exception as e:
            return {'error': str(e)}, 500

@ns_alerts.route('/api/alerts/<int:alert_id>/delete')
class DeleteAlert(Resource):
    def put(self, alert_id):
        try:
            alert = Alert.query.get(alert_id)
            if not alert:
                return {'message': 'Alert not found'}, 404

            alert.active = False
            db.session.commit()

            return {'message': 'Alert deleted'}, 200
        except Exception as e:
            return {'error': str(e)}, 500
        
@ns_alerts.route('/api/alerts/<int:alert_id>/restore')
class RestoreAlert(Resource):
    def put(self, alert_id):
        try:
            alert = Alert.query.get(alert_id)
            if not alert:
                return {'message': 'Alert not found'}, 404

            alert.active = True
            db.session.commit()

            return {'message': 'Alert restored'}, 200
        except Exception as e:
            return {'error': str(e)}, 500

@ns_messages.route('/api/edits/<platform_type>/<conversation_id>/<message_id>/<direction>')
class GetEditedMessages(Resource):
    def get(self, platform_type, conversation_id, message_id, direction):
        try:
            # Query the Edit table to find all edits for the given message
            edits = Edit.query.filter_by(
                platform_type=platform_type,
                conversation_id=conversation_id,
                message_id=message_id,
                direction=direction
            ).order_by(Edit.edited_timestamp.desc()).all()

            # If no edits found, return an empty list
            if not edits:
                return {'edited_messages': []}, 200

            # Serialize the edits and return them
            serialized_edits = [edit.serialize() for edit in edits]
            return {'edited_messages': serialized_edits}, 200

        except Exception as e:
            return {'error': str(e)}, 500

@ns_messages.route('/api/messages/process_edited_message')
class ProcessEditedMessage(Resource):
    def post(self):
        try:
            data = request.get_json()

            platform_name = platform_mapping.get(data['platform'].lower())
            if not platform_name:
                return {'status': 'error', 'message': 'Unsupported platform'}, 400

            bot_id = data['bot_id']
            scammer_unique_id = data['scammer_id']
            direction = data['direction']
            message_id = data.get('message_id', None)
            original_message_text = data.get('original_message_text', None)
            edited_message_text = data.get("edited_message_text", None)
            edited_timestamp = safe_parse_timestamp(data.get("edited_timestamp", None))

            # Check if bot exists, if not return an error
            bot = Bot.query.get(bot_id)
            if not bot:
                return {'status': 'error', 'message': 'Bot not found'}, 404
            
            # Check if scammer exists, if not create a new scammer
            scammer = Scammer.query.filter_by(unique_id=scammer_unique_id, platform=platform_name).first()
            if not scammer:
                return {'status': 'error', 'message': 'Scammer not found'}, 404

            # Check if conversation exists, if not return an error
            conversation = Conversation.query.filter_by(
                bot_id=bot.id,
                platform=platform_name,
                scammer_id=scammer.id
            ).first()
            if not conversation:
                return {'status': 'error', 'message': 'Conversation not found'}, 404

            # Query the original message from the unified Message model
            original_message = Message.query.filter_by(
                conversation_id=conversation.id, 
                direction=direction, 
                message_id=message_id,
                message_text=original_message_text,
                platform_type=platform_name  # Filter by platform
            ).first()
            
            if not original_message:
                return {'status': 'error', 'message': 'Original message not found'}, 404

            # Update the Edit table
            edit_table_row = Edit(
                scammer_unique_id=scammer_unique_id,
                platform_type=platform_name,
                bot_id=bot_id,
                direction=direction,
                message_id=message_id,
                conversation_id=conversation.id,
                original_message_text=original_message.message_text,
                previous_timestamp=original_message.edited_timestamp,
                edited_message_text=edited_message_text,
                edited_timestamp=edited_timestamp,
            )

            db.session.add(edit_table_row)

            # Update the Alert table
            new_alert = Alert(
                scammer_unique_id=scammer_unique_id, 
                direction=direction,
                alert_type="Edited",
                platform_type=platform_name,
                message_id=message_id,
                message_text=original_message_text,
                read_status=False,
                timestamp=edited_timestamp, 
                bot_id=bot_id,
                active=True,
            )
            
            db.session.add(new_alert)

            # Update the original message
            original_message.message_text = edited_message_text
            original_message.edited_timestamp = edited_timestamp
            original_message.response_status = "Edited"

            db.session.commit()

            return {'responses': f"Finished processing edited message {message_id} for {platform_name}"}, 200

        except Exception as e:
            return {'error': str(e)}, 500  

@ns_conversations.route('/api/conversations/<platform>/<bot_id>/<scammer_unique_id>/pause_status')
class GetConversationPauseStatus(Resource):
    def get(self, platform, bot_id, scammer_unique_id):
        try:
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404

            return {"pause": conversation.pause}, 200
        except Exception as e:
            return {"error": "Internal Server Error" + str(e)}, 500

@ns_victim_details.route('/api/victim_details_json')
class GetVictimDetailsJson(Resource):
    def get(self):
        try:
            if not VICTIM_DETAILS_PATH:
                return {'error': 'victim_details.json file not found'}, 404

            #load and return the json file
            with open(VICTIM_DETAILS_PATH, 'r') as file:
                data = json.load(file)

            return jsonify(data)

        except Exception as e:
            return {'error': str(e)}, 500

@ns_victim_details.route('/api/victim_details/<bot_id>/property', methods=['POST'])
class InsertVictimProperty(Resource):
    def post(self, bot_id):
        try:
            # Load the existing victim details from JSON file
            with open(VICTIM_DETAILS_PATH, 'r') as file:
                victim_details = json.load(file)

            # Find the correct victim entity by matching the 'bot_id' with the key in victim_details
            if bot_id not in victim_details:
                return {'error': 'Bot ID not found'}, 404

            # Get the property data from the request
            data = request.json
            key = data.get('key')
            value = data.get('value')

            if not key or not value:
                return {'error': 'Missing key or value'}, 400

            # Add the new property to the specific victim's details
            victim_details[bot_id][key] = value

            # Save the updated data back to the JSON file
            with open(VICTIM_DETAILS_PATH, 'w') as file:
                json.dump(victim_details, file, indent=4)

            return {'message': 'Property added successfully'}, 201
        except Exception as e:
            return {'error': str(e)}, 500

@ns_victim_details.route('/api/victim_details/<bot_id>/property/<key>', methods=['DELETE'])
class DeleteVictimProperty(Resource):
    def delete(self, bot_id, key):
        try:
            # Decode the key to handle URL-encoded spaces and other characters
            key = unquote(key)

            # Load the existing victim details from JSON file
            with open(VICTIM_DETAILS_PATH, 'r') as file:
                victim_details = json.load(file)

            # Find the correct victim entity by matching 'bot_id' with the key in victim_details
            if bot_id not in victim_details:
                return {'error': 'Bot ID not found'}, 404

            # Check if the key exists in the victim's details and delete it
            if key in victim_details[bot_id]:
                del victim_details[bot_id][key]

                # Save the updated data back to the JSON file
                with open(VICTIM_DETAILS_PATH, 'w') as file:
                    json.dump(victim_details, file, indent=4)

                return {'message': 'Property deleted successfully'}, 200
            else:
                return {'error': 'Key not found in victim details'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

@ns_victim_details.route('/api/victim_details/<bot_id>/property/<key>', methods=['PUT'])
class UpdateVictimProperty(Resource):
    def put(self, bot_id, key):
        try:
            # Decode the key to handle URL-encoded spaces and other characters
            key = unquote(key)

            # Load the existing victim details from JSON file
            with open(VICTIM_DETAILS_PATH, 'r') as file:
                victim_details = json.load(file)

            # Check if the bot_id exists in the victim details
            if bot_id not in victim_details:
                return {'error': 'Bot ID not found'}, 404

            # Get the new value from the request
            data = request.json
            new_value = data.get('value')

            if not new_value:
                return {'error': 'Missing value'}, 400

            # Update the specific property in the victim's details
            victim = victim_details[bot_id]
            if key in victim:
                victim[key] = new_value

                # Save the updated data back to the JSON file
                with open(VICTIM_DETAILS_PATH, 'w') as file:
                    json.dump(victim_details, file, indent=4)

                return {'message': 'Property updated successfully'}, 200
            else:
                return {'error': 'Key not found in victim details'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

@ns_conversations.route('/api/conversations/<conversation_id>/details')
class GetConversationDetails(Resource):
    def get(self, conversation_id):
        try:
            # Fetch the current conversation by its ID
            conversation = Conversation.query.get(conversation_id)
            if not conversation:
                return {"error": "Conversation not found"}, 404

            # Serialize the conversation data
            conversation_data = conversation.serialize()

            # Get previous conversation details
            if conversation.previous_conversation_id:
                previous_conversation = Conversation.query.get(conversation.previous_conversation_id)
                if previous_conversation:
                    conversation_data['previous_conversation'] = previous_conversation.serialize()

            # Get next conversation details
            if conversation.next_conversation_id:
                next_conversation = Conversation.query.get(conversation.next_conversation_id)
                if next_conversation:
                    conversation_data['next_conversation'] = next_conversation.serialize()

            return conversation_data, 200
        except Exception as e:
            return {"error": str(e)}, 500


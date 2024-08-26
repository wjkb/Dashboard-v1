import sys

sys.path.append('..')
from utils.send_utils import send_proactive_queue, send_main_convo_message

from flask import Blueprint, request
from flask_restx import Api, Resource, fields
from datetime import datetime
import json
import requests
from backend.models import db, Bot, Scammer, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage, MessageScreenshots, ExtractedInformation, Alert
from backend.utils import save_file, safe_parse_timestamp, create_zip, create_message_csv

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
    'response_status': fields.String(description='The status of the response, either Sending, Sent or Failed', example='Sent'),
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
})

conversation_model = ns_conversations.model('Conversation', {
    'id': fields.Integer(readOnly=True, description='The conversation unique identifier'),
    'bot_id': fields.String(required=True),
    'scammer_id': fields.Integer(required=True),
    'scammer_unique_id': fields.String(required=True),
    'platform': fields.String(required=True),
    'facebook_messages': fields.List(fields.Nested(message_model)),
    'whatsapp_messages': fields.List(fields.Nested(message_model)),
    'telegram_messages': fields.List(fields.Nested(message_model)),
    'pause': fields.Boolean(default=False)
})

bot_model_2 = ns_bots.model('Bot2', {
    'id': fields.String(required=True, example='90217777'),
    'name': fields.String(required=True, example='John Doe'),
    'email': fields.String(example='johndoe@gmail.com'),
    'persona': fields.String(required=True, example='Middle-aged man'),
    'model': fields.String(required=True, example='Llama 3'),
    'platforms': fields.List(fields.String, required=True, example=['Facebook', 'WhatsApp']),
})

bot_model_1 = ns_bots.model('Bot1', {
    'id': fields.String(required=True, description='The bot phone number is used as the unique identifier'),
    'active': fields.Boolean(required=True, default=True),
    'name': fields.String(required=True),
    'email': fields.String(),
    'persona': fields.String(required=True),
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
    'bot_id': fields.String(description='The ID of the bot associated with the alert', example='bot_001')
})


##################################################
# Below are the routes for all the API endpoints #
##################################################

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
                email=data.get('email', ''),  # Optional field
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
                # Delete all related Facebook, WhatsApp, and Telegram messages
                FacebookMessage.query.filter_by(conversation_id=conversation.id).delete()
                WhatsappMessage.query.filter_by(conversation_id=conversation.id).delete()
                TelegramMessage.query.filter_by(conversation_id=conversation.id).delete()
            
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
        
@ns_bots.route('/api/bots/<bot_id>/toggle_pause')
class TogglePauseBot(Resource):
    @ns_bots.doc('toggle_pause_bot')
    def put(self, bot_id):
        try:
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404
            
            bot.pause = not bot.pause
            db.session.commit()

            # If bot is resumed, get all conversations related to the bot
            if not bot.pause:
                platform_message_classes = {
                    'Facebook': FacebookMessage,
                    'WhatsApp': WhatsappMessage,
                    'Telegram': TelegramMessage
                }
                conversations = Conversation.query.filter_by(bot_id=bot_id).all()
                for conversation in conversations:
                    # Get bot_id and scammer_unique_id from conversation
                    bot_id = conversation.bot_id
                    scammer_unique_id = Scammer.query.get(conversation.scammer_id).unique_id

                    # Get all the last incoming messages up till but not including the last outgoing message, or all incoming messages if no outgoing message, and send them to send_main_convo_message
                    for platform in ['Facebook', 'WhatsApp', 'Telegram']:
                        platform_messages = (
                            db.session.query(platform_message_classes[platform])
                            .filter_by(conversation_id=conversation.id)
                            .order_by(platform_message_classes[platform].message_timestamp.asc())
                            .all()
                        )
                        # Get the last outgoing message
                        last_outgoing_message = (
                            db.session.query(platform_message_classes[platform])
                            .filter_by(conversation_id=conversation.id, direction='outgoing')
                            .order_by(platform_message_classes[platform].message_timestamp.desc())
                            .first()
                        )
                        if last_outgoing_message:
                            messages_to_send = [msg for msg in platform_messages if msg.direction == 'incoming' and msg.message_timestamp > last_outgoing_message.message_timestamp]
                        else:
                            messages_to_send = [msg for msg in platform_messages if msg.direction == 'incoming']

                        # Function to select only wanted fields from the message dictionary
                        wanted_fields = ['platform', 'bot_id', 'scammer_id', 'direction', 'message_id', 'message_text', 'message_timestamp']
                        def select_wanted_fields(message: dict, wanted_fields: list = wanted_fields):
                            return {key: value for key, value in message.items() if key in wanted_fields}
                        
                        message_list = []
                        for message in messages_to_send:
                            message = message.serialize()
                            message['platform'] = API_mapping[platform]
                            message['bot_id'] = bot_id
                            message['scammer_id'] = scammer_unique_id
                            filtered_message = select_wanted_fields(message, wanted_fields)
                            message_list.append(filtered_message)

                        if message_list:
                            send_main_convo_message(message_list)


            return {"message": "Bot pause status updated successfully to " + str(bot.pause)}, 200
        except Exception as e:
            return {"error": "Internal Server Error"}, 500
            

@ns_conversations.route('/api/conversations/toggle_pause')
class TogglePauseConversation(Resource):
    @ns_conversations.doc('toggle_pause_conversation')
    def post(self):
        try:
            try:
                data = request.get_json()
            except Exception as e:
                return {'error': 'Cannot receive data'}, 400
            platform = data.get('platform')
            bot_id = data.get('bot_id')
            scammer_unique_id = data.get('scammer_unique_id')
            platform_mapping = {
                'facebook': 'Facebook',
                'whatsapp': 'WhatsApp',
                'telegram': 'Telegram'
            }
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            # Get the conversation
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

            # If bot is resumed, get all conversations related to the bot
            if not conversation.pause:
                platform_message_classes = {
                    'Facebook': FacebookMessage,
                    'WhatsApp': WhatsappMessage,
                    'Telegram': TelegramMessage
                }
                
                # Get bot_id and scammer_unique_id from conversation
                bot_id = conversation.bot_id
                scammer_unique_id = Scammer.query.get(conversation.scammer_id).unique_id

                # Get all the last incoming messages up till but not including the last outgoing message, 
                # or all incoming messages if no outgoing message, and send them to send_main_convo_message
                platform_messages = (
                    db.session.query(platform_message_classes[platform])
                    .filter_by(conversation_id=conversation.id)
                    .order_by(platform_message_classes[platform].message_timestamp.asc())
                    .all()
                )

                # Get the last outgoing message
                last_outgoing_message = (
                    db.session.query(platform_message_classes[platform])
                    .filter_by(conversation_id=conversation.id, direction='outgoing')
                    .order_by(platform_message_classes[platform].message_timestamp.desc())
                    .first()
                )
                if last_outgoing_message:
                    messages_to_send = [msg for msg in platform_messages if msg.direction == 'incoming' and msg.message_timestamp > last_outgoing_message.message_timestamp]
                else:
                    messages_to_send = [msg for msg in platform_messages if msg.direction == 'incoming']

                # Function to select only wanted fields from the message dictionary
                wanted_fields = ['platform', 'bot_id', 'scammer_id', 'direction', 'message_id', 'message_text', 'message_timestamp']
                def select_wanted_fields(message: dict, wanted_fields: list = wanted_fields):
                    return {key: value for key, value in message.items() if key in wanted_fields}
                
                message_list = []
                for message in messages_to_send:
                    message = message.serialize()
                    message['platform'] = API_mapping[platform]
                    message['bot_id'] = bot_id
                    message['scammer_id'] = scammer_unique_id
                    filtered_message = select_wanted_fields(message, wanted_fields)
                    message_list.append(filtered_message)

                if message_list:
                    send_main_convo_message(message_list)


            return {"message": "Bot pause status updated successfully to " + str(conversation.pause)}, 200
        except Exception as e:
            return {"error": "Internal Server Error" + str(e)}, 500

@ns_conversations.route('/api/conversations/get_conversation_pause_status')
class getConversationPauseStatus(Resource):
    @ns_conversations.doc('get_conversation_pause_status')
    def post(self):
        try:
            try:
                data = request.get_json()
                
            except Exception as e:
                return {'error': 'Cannot receive data'}, 400

            platform = data.get('platform')
            bot_id = data.get('bot_id')
            scammer_unique_id = data.get('scammer_unique_id')

            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            # Get the conversation
            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404
            
            return {"pause_status": conversation.pause}, 200

        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

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

            conversation = (
                db.session.query(Conversation)
                .join(Scammer, Conversation.scammer_id == Scammer.id)
                .filter(Conversation.bot_id == bot_id, Conversation.platform == platform_name, Scammer.unique_id == scammer_unique_id)
                .first()
            )
            if not conversation:
                return {"error": "Conversation not found"}, 404
            
            platform_message_classes = {
                'facebook': FacebookMessage,
                'whatsapp': WhatsappMessage,
                'telegram': TelegramMessage
            }
            message_class = platform_message_classes.get(platform.lower())
            if not message_class:
                return {'error': 'Unsupported platform'}, 400
            
            messages = (
                db.session.query(message_class)
                .filter_by(conversation_id=conversation.id)
                .order_by(message_class.message_timestamp.asc())
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

        # Map platform to message class
        platform_message_classes = {
            'facebook': FacebookMessage,
            'whatsapp': WhatsappMessage,
            'telegram': TelegramMessage
        }
        message_class = platform_message_classes.get(platform_name.lower())

        # Create or update message object
        if direction == 'incoming':
            message = message_class.query.filter_by(conversation_id=conversation.id, direction=direction, message_id=message_id).first()
            if not message:
                message = message_class(
                    conversation_id=conversation.id,
                    direction=direction,
                    message_id=message_id,
                    message_text=message_text,
                    message_timestamp=safe_parse_timestamp(message_timestamp),
                    file_path=file_path,
                    file_type=file_type,
                    response_status=response_status
                )
                db.session.add(message)
            else:
                message.message_text = message_text
                message.message_timestamp = safe_parse_timestamp(message_timestamp)
                message.file_path = file_path
                message.file_type = file_type
                message.response_status = response_status

        elif direction == 'outgoing':
            message = message_class.query.filter_by(conversation_id=conversation.id, direction=direction, message_id=message_id).first()
            if not message:
                message = message_class(
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
                    response_status=response_status
                )
                db.session.add(message)
            else:
                message.message_text = message_text
                message.message_timestamp = safe_parse_timestamp(message_timestamp)
                message.file_path = file_path
                message.file_type = file_type
                message.responded_to = responded_to
                message.response_bef_generation_timestamp = safe_parse_timestamp(response_bef_generation_timestamp)
                message.response_aft_generation_timestamp = safe_parse_timestamp(response_aft_generation_timestamp)
                message.response_status = response_status

        # Commit the changes to the database
        db.session.commit()

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
            
            # Get all messages in the conversation
            platform_message_classes = {
                'Facebook': FacebookMessage,
                'WhatsApp': WhatsappMessage,
                'Telegram': TelegramMessage
            }
            message_class = platform_message_classes.get(platform_name)
            messages = message_class.query.filter_by(conversation_id=conversation.id).all()

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
            
            platform_message_classes = {
                'facebook': FacebookMessage,
                'whatsapp': WhatsappMessage,
                'telegram': TelegramMessage
            }
            
            print(f"Getting next response message ID for bot {bot_id} on platform {platform_name} for scammer {scammer_unique_id}")
            platformMessage = platform_message_classes[platform_name]
            print(f"Platform message class: {platform_name}")
            # Get the last message sent by the bot
            last_bot_message = (
                db.session.query(platformMessage)
                .filter_by(conversation_id=conversation.id, direction='outgoing')
                .order_by(platformMessage.message_timestamp.desc())
                .first()
            )
            print(f"Last bot message: {last_bot_message}")
            if not last_bot_message:
                return {'next_message_id': '1'}, 200
            else:
                return {'next_message_id': str(int(last_bot_message.message_id) + 1)}, 200
        
        except Exception as e:
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
                response = requests.post('http://localhost:5000/api/get_next_response_message_id', json=next_response_data)
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

            if not bot.pause:
                return {'status': 'error', 'message': 'Bot is running. Pause first!'}, 400
            
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
            print("DownloadEverything API was called")
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
            
            platform_message_classes = {
                'Facebook': FacebookMessage,
                'WhatsApp': WhatsappMessage,
                'Telegram': TelegramMessage
            }
            message_class = platform_message_classes.get(platform_name)
            messages = message_class.query.filter_by(conversation_id=conversation.id).all()

            # Get all files (i.e. attachments) in the conversation
            file_paths = [msg.file_path for msg in messages if msg.file_path]
            zip_file_path = create_zip(file_paths, 'downloaded_files')

            # Get all screenshots in the conversation
            screenshots = MessageScreenshots.query.filter_by(conversation_id=conversation.id).all()
            screenshot_file_paths = [screenshot.file_path for screenshot in screenshots]
            screenshot_zip_file_path = create_zip(screenshot_file_paths, 'downloaded_screenshots')
            
            # Get all messages in csv format
            csv_file_path = create_message_csv(messages)

            # Create a new zip file with all the files
            all_files = [zip_file_path, screenshot_zip_file_path, csv_file_path]
            all_files_zip_path = create_zip(all_files, 'downloaded_all_files')

            return {'zipFileUrl': f'http://localhost:5000/{all_files_zip_path}'}
        
        except Exception as e:
            return {'error': str(e)}, 500
        

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
            facebook_messages = FacebookMessage.query.all()
            whatsapp_messages = WhatsappMessage.query.all()
            telegram_messages = TelegramMessage.query.all()
            return {
                'facebook': len(facebook_messages),
                'whatsapp': len(whatsapp_messages),
                'telegram': len(telegram_messages)
            }
        except Exception as e:
            return {'error': str(e)}, 500

@ns_graph_insights.route('/api/recent_messages/<platform>')
class RecentMessages(Resource):
    def get(self, platform):
        try:
            platform_class_mapping = {
                'facebook': FacebookMessage,
                'whatsapp': WhatsappMessage,
                'telegram': TelegramMessage
            }
            platform_class = platform_class_mapping.get(platform.lower())
            if not platform_class:
                return {'error': 'Unsupported platform'}, 400
            
            # Join the platform-specific messages with conversations and scammer
            messages = (
                db.session.query(platform_class)
                .join(Conversation, Conversation.id == platform_class.conversation_id)
                .join(Scammer, Scammer.id == Conversation.scammer_id)
                .order_by(platform_class.message_timestamp.desc())
                .limit(5)
                .all()
            )
            
            # Serialize the messages along with conversation details
            response = []
            for msg in messages:
                # Get the conversation related to the message
                conversation = Conversation.query.get(msg.conversation_id)
                # Get the scammer related to the conversation
                scammer = Scammer.query.get(conversation.scammer_id)
                if conversation:
                    # Add conversation details to the message serialization
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
class AlertsResource(Resource):
    @ns_alerts.expect(create_alert_model)
    def post(self):
        try:
            data = request.get_json()

            new_alert = Alert(
                scammer_unique_id=data['scammer_unique_id'], 
                direction=data['direction'],
                alert_type=data['alert_type'],
                platform_type=data['platform_type'],
                message_id=data.get('message_id'),
                message_text=data['message_text'],
                read_status=data.get('read_status', False),  
                timestamp=data.get('timestamp'),  
                bot_id=data.get('bot_id')  
            )

            db.session.add(new_alert)
            db.session.commit()

            return {'message': 'Alert created successfully', 'alert': new_alert.serialize()}, 201
        except Exception as e:
            return {'error': str(e)}, 500

    def get(self):
        try:
            alerts = Alert.query.order_by(Alert.timestamp.desc()).all()
            serialized_alerts = [alert.serialize() for alert in alerts]
            return serialized_alerts, 200
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

    def get(self):
        """Uses parameter query string in URL to pass platform, bot_id, scammer_unique_id

        e.g. api/alerts/get_specific?platform=WhatsApp&bot_id=90000001&scammer_unique_id=90000012

        Returns:
            alerts, unread_count
        """
        try:
            platform = request.args.get('platform')
            bot_id = request.args.get('bot_id')
            scammer_unique_id = request.args.get('scammer_unique_id')

            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400
            try:
                alerts = Alert.query.filter(Alert.bot_id == bot_id, Alert.platform_type == platform_name, Alert.scammer_unique_id == scammer_unique_id)
                unread_count = alerts.filter_by(read_status=False).count()
                serialized_alerts = [alert.serialize() for alert in alerts]

                return {'alerts': serialized_alerts, 'unread_count': unread_count}, 200
            except Exception as e:
                print(e)
                return {'alerts': [], 'unread_count': 0}, 200
        except Exception as e:
            return {'error': str(e)}, 500

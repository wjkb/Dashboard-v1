import subprocess
from flask import Blueprint, request
from flask_restx import Api, Resource, fields
from datetime import datetime
from backend.models import db, Bot, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage
from backend.utils import save_file, create_zip

# Initialize Flask-RESTx Api
api_bp = Blueprint('api', __name__)
api = Api(api_bp, version='1.0', title='Your API', description='API Documentation', doc='/api/docs')

# Define namespaces for Swagger documentation
ns_bots = api.namespace('bots', description='Bot operations', path='/')
ns_platform_bots = api.namespace('platform_bots', description='Platform Bot operations', path='/')
ns_conversations = api.namespace('conversations', description='Conversation operations', path='/')
ns_messages = api.namespace('messages', description='Message operations', path='/')
ns_utils = api.namespace('utils', description='Utility operations', path='/')

# Define models for Swagger documentation
bot_model_1 = ns_bots.model('Bot1', {
    'id': fields.Integer(readOnly=True, description='The bot unique identifier'),
    'phone': fields.String(required=True),
    'name': fields.String(required=True),
    'email': fields.String(),
    'persona': fields.String(required=True),
    'model': fields.String(required=True),
    'platforms': fields.List(fields.String, required=True),
    'conversations': fields.List(fields.Integer)
})

bot_model_2 = ns_bots.model('Bot2', {
    'phone': fields.String(required=True),
    'name': fields.String(required=True),
    'email': fields.String(),
    'persona': fields.String(required=True),
    'model': fields.String(required=True),
    'platforms': fields.List(fields.String, required=True),
})

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
            required_fields = ['phone', 'name', 'persona', 'model', 'platforms']
            for field in required_fields:
                if field not in data:
                    return {"error": f"Missing required field: {field}"}, 400

            new_bot = Bot(
                phone=data['phone'],
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

@ns_bots.route('/api/bots/<int:bot_id>')
class UpdateOrDeleteBot(Resource):
    @ns_bots.doc('update_bot')
    @ns_bots.expect(bot_model_2)
    @ns_bots.marshal_with(bot_model_1, code=200)
    def put(self, bot_id):
        try:
            bot = Bot.query.get(bot_id)
            if not bot:
                return {"error": "Bot not found"}, 404

            data = request.json

            bot.phone = data.get('phone', bot.phone)
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


@ns_platform_bots.route('/api/<platform>/bots')
class PlatformBots(Resource):
    def get(self, platform):
        try:
            if platform == 'facebook':
                bots = Bot.query.join(Platform).filter(Platform.platform == 'Facebook').all()
            elif platform == 'whatsapp':
                bots = Bot.query.join(Platform).filter(Platform.platform == 'WhatsApp').all()
            elif platform == 'telegram':
                bots = Bot.query.join(Platform).filter(Platform.platform == 'Telegram').all()
            else:
                return {'error': 'Invalid platform'}, 400

            return [bot.serialize() for bot in bots]
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

@ns_conversations.route('/api/<platform>/bots/<int:bot_id>/conversations')
class BotConversations(Resource):
    def get(self, platform, bot_id):
        try:
            platform_mapping = {
                'facebook': 'Facebook',
                'whatsapp': 'WhatsApp',
                'telegram': 'Telegram'
            }
            
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            conversations = Conversation.query.filter_by(bot_id=bot_id, platform=platform_name).all()
            return [conv.serialize() for conv in conversations]
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

@ns_messages.route('/api/<platform>/bots/<int:bot_id>/conversations/<user>')
class BotConversationMessages(Resource):
    def get(self, platform, bot_id, user):
        try:
            platform_mapping = {
                'facebook': 'Facebook',
                'whatsapp': 'WhatsApp',
                'telegram': 'Telegram'
            }
            
            platform_name = platform_mapping.get(platform.lower())
            if not platform_name:
                return {'error': 'Invalid platform'}, 400

            conversation = Conversation.query.filter_by(bot_id=bot_id, platform=platform_name, user=user).first()
            if not conversation:
                return {"error": "Conversation not found"}, 404
            
            messages = []
            if platform_name == "Facebook":
                messages = FacebookMessage.query.filter_by(conversation_id=conversation.id).all()
            elif platform_name == "WhatsApp":
                messages = WhatsappMessage.query.filter_by(conversation_id=conversation.id).all()
            elif platform_name == "Telegram":
                messages = TelegramMessage.query.filter_by(conversation_id=conversation.id).all()
            
            return [msg.serialize() for msg in messages]
        except Exception as e:
            print(f"Error occurred: {e}")
            return {"error": "Internal Server Error"}, 500

@ns_messages.route('/api/messages')
class ReceiveMessage(Resource):
    def post(self):
        data = request.get_json()

        # Create conversation if it doesn't exist
        conversation = Conversation.query.filter_by(
            bot_id=data['bot_id'],
            platform=data['platform'],
            user=data['user']
        ).first()
        if not conversation:
            conversation = Conversation(
                bot_id=data['bot_id'],
                platform=data['platform'],
                user=data['user']
            )
            db.session.add(conversation)
            db.session.commit()

        # Map platform to message class
        platform_message_classes = {
            'facebook': FacebookMessage,
            'whatsapp': WhatsappMessage,
            'telegram': TelegramMessage
        }
        platform = data['platform'].lower()
        message_class = platform_message_classes.get(platform)

        # Create message object
        if message_class:
            message = message_class(
                conversation_id=conversation.id,
                message=data['message'],
                direction=data['direction'],
                timestamp=datetime.strptime(data['timestamp'], '%Y-%m-%dT%H:%M:%S.%f')
            )
            db.session.add(message)
            db.session.commit()
            return {'status': 'success'}, 201
        else:
            return {'status': 'error', 'message': 'Unsupported platform'}, 400

@ns_utils.route('/api/start_bot')
class StartBot(Resource):
    def post(self):
        try:
            data = request.json
            bot_id = data.get('botId')
            target_url = data.get('targetUrl')
            platform = data.get('platform')

            if not bot_id or not target_url or not platform:
                return {'status': 'error', 'message': 'Missing required fields'}, 400

            print(f"Starting bot {bot_id} for platform {platform} at {target_url}")

            # Command to start the bot script
            command = f"python bot.py {platform} {bot_id} {target_url}"
            subprocess.Popen(command, shell=True)
            print(f"Command run: {command}")

            return {"status": "success","message": "Bot sent successfully"}, 200

        except Exception as e:
            return {'status': 'error', 'message': str(e)}, 500
    
@ns_utils.route('/download/zip')
class DownloadZip(Resource):
    def post(self):
        data = request.get_json()
        file_paths = data.get('filePaths', [])
        try:
            zip_file_path = create_zip(file_paths)
            return {'zipFileUrl': f'http://localhost:5000/{zip_file_path}'}
        except Exception as e:
            return {'error': str(e)}, 500
    

    
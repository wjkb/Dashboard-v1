from flask import Blueprint, request, jsonify
from backend.models import db, Bot, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage

api = Blueprint('api', __name__)


### GET APIs

@api.route('/api/bots', methods=['GET'])
def get_all_bots():
    try:
        bots = Bot.query.all()
        return jsonify([bot.serialize() for bot in bots])
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@api.route('/api/<platform>/bots', methods=['GET'])
def get_platform_bots(platform):
    try:
        if platform == 'facebook':
            bots = Bot.query.join(Platform).filter(Platform.platform == 'Facebook').all()
        elif platform == 'whatsapp':
            bots = Bot.query.join(Platform).filter(Platform.platform == 'WhatsApp').all()
        elif platform == 'telegram':
            bots = Bot.query.join(Platform).filter(Platform.platform == 'Telegram').all()
        else:
            return jsonify({'error': 'Invalid platform'}), 400

        return jsonify([bot.serialize() for bot in bots])
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@api.route('/api/<platform>/bots/<int:bot_id>/conversations', methods=['GET'])
def get_bot_conversations(platform, bot_id):
    try:
        platform_mapping = {
            'facebook': 'Facebook',
            'whatsapp': 'WhatsApp',
            'telegram': 'Telegram'
        }
        
        platform_name = platform_mapping.get(platform.lower())
        if not platform_name:
            return jsonify({'error': 'Invalid platform'}), 400

        conversations = Conversation.query.filter_by(bot_id=bot_id, platform=platform_name).all()
        return jsonify([conv.serialize() for conv in conversations])
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@api.route('/api/<platform>/bots/<int:bot_id>/conversations/<user>', methods=['GET'])
def get_bot_conversation_messages(platform, bot_id, user):
    try:
        platform_mapping = {
            'facebook': 'Facebook',
            'whatsapp': 'WhatsApp',
            'telegram': 'Telegram'
        }
        
        platform_name = platform_mapping.get(platform.lower())
        if not platform_name:
            return jsonify({'error': 'Invalid platform'}), 400

        conversation = Conversation.query.filter_by(bot_id=bot_id, platform=platform_name, user=user).first()
        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404
        
        messages = []
        if platform_name == "Facebook":
            messages = FacebookMessage.query.filter_by(conversation_id=conversation.id).all()
        elif platform_name == "WhatsApp":
            messages = WhatsappMessage.query.filter_by(conversation_id=conversation.id).all()
        elif platform_name == "Telegram":
            messages = TelegramMessage.query.filter_by(conversation_id=conversation.id).all()
        
        return jsonify([msg.serialize() for msg in messages])
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


### POST APIs
@api.route('/api/bots', methods=['POST'])
def create_bot():
    try:
        data = request.json
        print(f"Received data: {data}")  # Debugging line

        # Check if all required fields are present
        required_fields = ['phoneNumber', 'name', 'persona', 'model', 'platforms']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        new_bot = Bot(
            phone=data['phoneNumber'],
            name=data['name'],
            email=data.get('email', ''),  # Optional field
            persona=data['persona'],
            model=data['model']
        )
        db.session.add(new_bot)
        db.session.commit()
        print(f"Created bot: {new_bot.serialize()}")  # Debugging line

        for platform in data['platforms']:
            new_platform = Platform(bot_id=new_bot.id, platform=platform)
            db.session.add(new_platform)
            print(f"Added platform: {platform}")  # Debugging line

        db.session.commit()
        return jsonify(new_bot.serialize()), 201
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
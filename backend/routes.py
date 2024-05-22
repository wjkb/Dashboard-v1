from flask import Blueprint, request, jsonify
from backend.models import db, Bot, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage

api = Blueprint('api', __name__)

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


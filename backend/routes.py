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

@api.route('/api/bots/<int:bot_id>/conversations/<platform>', methods=['GET'])
def get_bot_conversations(bot_id, platform):
    try:
        if platform == 'facebook':
            conversations = FacebookMessage.query.filter_by(conversation_id=bot_id).all()
        elif platform == 'whatsapp':
            conversations = WhatsappMessage.query.filter_by(conversation_id=bot_id).all()
        elif platform == 'telegram':
            conversations = TelegramMessage.query.filter_by(conversation_id=bot_id).all()
        else:
            return jsonify({'error': 'Invalid platform'}), 400

        return jsonify([conversation.serialize() for conversation in conversations])
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

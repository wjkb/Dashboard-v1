from flask import Blueprint, request, jsonify
from backend.models import db, Bot, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage

api = Blueprint('api', __name__)

@api.route('/api/bots', methods=['GET'])
def get_bots():
    try:
        bots = Bot.query.all()
        return jsonify([bot.serialize() for bot in bots])
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@api.route('/conversations/<platform>', methods=['GET'])
def get_conversations(platform):
    if platform == 'facebook':
        conversations = FacebookMessage.query.all()
    elif platform == 'whatsapp':
        conversations = WhatsappMessage.query.all()
    elif platform == 'telegram':
        conversations = TelegramMessage.query.all()
    else:
        return jsonify({'error': 'Invalid platform'}), 400
    return jsonify([conversation.serialize() for conversation in conversations])
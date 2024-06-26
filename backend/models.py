from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class Bot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(15), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    persona = db.Column(db.String(255), nullable=False)
    model = db.Column(db.String(255), nullable=False)
    platforms = db.relationship('Platform', backref='bot', lazy=True)
    health_status = db.Column(db.Text, nullable=False, default='{}')
    conversations = db.relationship('Conversation', backref='bot', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'phone': self.phone,
            'name': self.name,
            'email': self.email,
            'persona': self.persona,
            'model': self.model,
            'platforms': [platform.platform for platform in self.platforms],
            'health_status': json.loads(self.health_status),
            'conversations': [conv.id for conv in self.conversations],
        }
    
    def set_health_status(self, health_dict):
        self.health_status = json.dumps(health_dict)

class Platform(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bot_id = db.Column(db.Integer, db.ForeignKey('bot.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'bot_id': self.bot_id,
            'platform': self.platform
        }

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bot_id = db.Column(db.Integer, db.ForeignKey('bot.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    user = db.Column(db.String(255), nullable=False)
    facebook_messages = db.relationship('FacebookMessage', backref='conversation', lazy=True)
    whatsapp_messages = db.relationship('WhatsappMessage', backref='conversation', lazy=True)
    telegram_messages = db.relationship('TelegramMessage', backref='conversation', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'bot_id': self.bot_id,
            'platform': self.platform,
            'user': self.user,
            'facebook_messages': [msg.serialize() for msg in self.facebook_messages],
            'whatsapp_messages': [msg.serialize() for msg in self.whatsapp_messages],
            'telegram_messages': [msg.serialize() for msg in self.telegram_messages]
        }

class FacebookMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    message = db.Column(db.Text, nullable=True)
    direction = db.Column(db.String(10), nullable=False)
    file_path = db.Column(db.String(255), nullable=True)
    file_type = db.Column(db.String(50), nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'timestamp': self.timestamp.isoformat(),
            'message': self.message,
            'direction': self.direction,
            'file_path': self.file_path,
            'file_type': self.file_type
        }

class WhatsappMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    message = db.Column(db.Text, nullable=True)
    direction = db.Column(db.String(10), nullable=False)
    file_path = db.Column(db.String(255), nullable=True)
    file_type = db.Column(db.String(50), nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'timestamp': self.timestamp.isoformat(),
            'message': self.message,
            'direction': self.direction,
            'file_path': self.file_path,
            'file_type': self.file_type
        }

class TelegramMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    message = db.Column(db.Text, nullable=True)
    direction = db.Column(db.String(10), nullable=False)
    file_path = db.Column(db.String(255), nullable=True)
    file_type = db.Column(db.String(50), nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'timestamp': self.timestamp.isoformat(),
            'message': self.message,
            'direction': self.direction,
            'file_path': self.file_path,
            'file_type': self.file_type
        }

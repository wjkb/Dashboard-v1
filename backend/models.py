from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class Bot(db.Model):
    id = db.Column(db.String(15), primary_key=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=True)
    name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    persona = db.Column(db.String(255), nullable=True)
    model = db.Column(db.String(255), nullable=False)
    platforms = db.relationship('Platform', backref='bot', lazy=True)
    health_status = db.Column(db.Text, nullable=False, default='{}')
    conversations = db.relationship('Conversation', backref='bot', lazy=True)

    # Work in progress
    pause = db.Column(db.Boolean, nullable=False, default=False)

    def serialize(self):
        return {
            'id': self.id,
            'active': self.active,
            'name': self.name,
            'email': self.email,
            'persona': self.persona,
            'model': self.model,
            'platforms': [platform.platform for platform in self.platforms],
            'health_status': json.loads(self.health_status),
            'conversations': [conv.id for conv in self.conversations],
            'pause': self.pause
        }
    
    def set_health_status(self, health_dict):
        self.health_status = json.dumps(health_dict)

class Scammer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(50), nullable=True)
    platform = db.Column(db.String(50), nullable=False)
    conversations = db.relationship('Conversation', backref='scammer', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'unique_id': self.unique_id,
            'platform': self.platform,
            'conversations': [conv.id for conv in self.conversations],
        }

class Platform(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bot_id = db.Column(db.String(15), db.ForeignKey('bot.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'bot_id': self.bot_id,
            'platform': self.platform
        }

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bot_id = db.Column(db.String(15), db.ForeignKey('bot.id'), nullable=False)
    scammer_id = db.Column(db.Integer, db.ForeignKey('scammer.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    messages = db.relationship('Message', backref='conversation', lazy=True)
    message_screenshots = db.relationship('MessageScreenshots', backref='conversation', lazy=True)
    pause = db.Column(db.Boolean, nullable=False, default=False)
    
    previous_conversation_id = db.Column(db.Integer, nullable=True)  
    next_conversation_id = db.Column(db.Integer, nullable=True)     

    def serialize(self):
        scammer = Scammer.query.get(self.scammer_id)  # Fetch scammer details
        return {
            'id': self.id,
            'bot_id': self.bot_id,
            'scammer_id': self.scammer_id,
            'scammer_unique_id': scammer.unique_id if scammer else None,  # Include scammer's unique_id
            'platform': self.platform,
            'messages': [msg.serialize() for msg in self.messages],
            'pause': self.pause,
            'previous_conversation_id': self.previous_conversation_id,  
            'next_conversation_id': self.next_conversation_id           
        }



class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=True)
    direction = db.Column(db.String(10), nullable=False)
    message_id = db.Column(db.String(255), nullable=True)
    message_text = db.Column(db.Text, nullable=True)
    message_timestamp = db.Column(db.DateTime, nullable=True)
    use_for_llm = db.Column(db.Boolean, nullable=False, default=True)

    file_path = db.Column(db.String(255), nullable=True)
    file_type = db.Column(db.String(50), nullable=True)

    responded_to = db.Column(db.String(255), nullable=True)
    response_bef_generation_timestamp = db.Column(db.DateTime, nullable=True)
    response_aft_generation_timestamp = db.Column(db.DateTime, nullable=True)
    response_status = db.Column(db.String(10), nullable=True)

    deleted_timestamp = db.Column(db.DateTime, nullable=True)
    edited_timestamp = db.Column(db.DateTime, nullable=True)
    
    platform_type = db.Column(db.String(50), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'direction': self.direction,
            'message_id': self.message_id,
            'message_text': self.message_text,
            'message_timestamp': self.message_timestamp.isoformat() if self.message_timestamp else None,
            'use_for_llm': self.use_for_llm,
            'file_path': self.file_path,
            'file_type': self.file_type,
            'responded_to': self.responded_to,
            'response_bef_generation_timestamp': self.response_bef_generation_timestamp.isoformat() if self.response_bef_generation_timestamp else None,
            'response_aft_generation_timestamp': self.response_aft_generation_timestamp.isoformat() if self.response_aft_generation_timestamp else None,
            'response_status': self.response_status,
            'deleted_timestamp': self.deleted_timestamp.isoformat() if self.deleted_timestamp else None,
            'edited_timestamp': self.edited_timestamp.isoformat() if self.edited_timestamp else None,
            'platform_type': self.platform_type,
        }


class MessageScreenshots(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'file_path': self.file_path
        }

class ExtractedInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    key = db.Column(db.String(255), nullable=False)
    value = db.Column(db.Text, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'key': self.key,
            'value': self.value
        }

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scammer_unique_id = db.Column(db.String(255), nullable=True)
    direction = db.Column(db.String(50), nullable=True)
    alert_type = db.Column(db.String(50), nullable=True)
    platform_type = db.Column(db.String(50), nullable=True)
    message_id = db.Column(db.String(255), nullable=True)
    message_text = db.Column(db.Text, nullable=True)
    read_status = db.Column(db.Boolean, default=False, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=True)
    bot_id = db.Column(db.String(255), nullable=True)
    active = db.Column(db.Boolean, default=True, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'scammer_unique_id': self.scammer_unique_id,
            'direction': self.direction,
            'alert_type': self.alert_type,
            'platform_type': self.platform_type,
            'message_id': self.message_id,
            'message_text': self.message_text,
            'read_status': self.read_status,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'bot_id': self.bot_id,
            'active': self.active,
        }



class Edit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    scammer_unique_id = db.Column(db.String(255), nullable=True)
    original_message_text = db.Column(db.String(255), nullable=True)  
    direction = db.Column(db.String(50), nullable=True)
    platform_type = db.Column(db.String(50), nullable=True)
    message_id = db.Column(db.String(255), nullable=True)
    edited_message_text = db.Column(db.Text, nullable=True)
    bot_id = db.Column(db.String(255), nullable=True)
    edited_timestamp = db.Column(db.DateTime, nullable=True)
    
    conversation_id = db.Column(db.Integer, nullable=False)
    previous_timestamp = db.Column(db.DateTime, nullable=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if 'conversation_id' not in kwargs or kwargs['conversation_id'] is None:
            self.conversation_id = self.get_conversation_id()

    def get_conversation_id(self):
        conversation = db.session.query(Conversation).filter_by(
            bot_id=self.bot_id,
            platform=self.platform_type
        ).first()
        return conversation.id if conversation else None

    def serialize(self):
        return {
            'id': self.id,
            'scammer_unique_id': self.scammer_unique_id,
            'original_message_text': self.original_message_text, 
            'direction': self.direction,
            'platform_type': self.platform_type,
            'message_id': self.message_id,
            'edited_message_text': self.edited_message_text,
            'bot_id': self.bot_id,
            'edited_timestamp': self.edited_timestamp.isoformat() if self.edited_timestamp else None,
            'conversation_id': self.conversation_id,
            'previous_timestamp': self.previous_timestamp.isoformat() if self.previous_timestamp else None,
        }

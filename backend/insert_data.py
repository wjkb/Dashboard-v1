from datetime import datetime
from backend import create_app
from backend.models import db, Bot, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage

app = create_app()

with app.app_context():
    # Insert bots
    bots_data = [
        ('90000001', 'Lim Wei Jie', 'limweijie@gmail.com', 'Middle-aged man', 'Llama 2'),
        ('90000002', 'Chua Mei Ling', 'chuameiling@gmail.com', 'Middle-aged man', 'Llama 3'),
        ('90000003', 'Ahmad Yusof', 'ahmadyusof@gmail.com', 'Old man', 'Llama 2'),
        ('90000004', 'Wong Li Hua', 'wonglihua@gmail.com', 'Young woman', 'Llama 2'),
        ('90000005', 'Tan Wei', 'tanwei@gmail.com', 'Young man', 'Llama 3'),
        ('90000006', 'Lim Mei Ling', 'limmeiling@gmail.com', 'Middle-aged woman', 'Llama 2'),
        ('90000007', 'Rajendra Kumar', 'rajendrakumar@gmail.com', 'Old man', 'Llama 3'),
        ('90000008', 'Loh Jia Hui', 'lohjiahui@gmail.com', 'Middle-aged woman', 'Llama 2'),
        ('90000009', 'Soh Wei Lun', 'sohweilun@gmail.com', 'Young man', 'Llama 3')
    ]

    for phone, name, email, persona, model in bots_data:
        bot = Bot(phone=phone, name=name, email=email, persona=persona, model=model)
        db.session.add(bot)
    db.session.commit()

    # Insert platforms
    platforms_data = [
        (1, 'Facebook'), (1, 'WhatsApp'),
        (2, 'WhatsApp'), (2, 'Telegram'),
        (3, 'Facebook'),
        (4, 'Facebook'), (4, 'Telegram'),
        (5, 'Facebook'), (5, 'WhatsApp'),
        (6, 'WhatsApp'), (6, 'Telegram'),
        (7, 'Facebook'),
        (8, 'Telegram'),
        (9, 'Facebook'), (9, 'WhatsApp'), (9, 'Telegram')
    ]

    for bot_id, platform in platforms_data:
        platform_entry = Platform(bot_id=bot_id, platform=platform)
        db.session.add(platform_entry)
    db.session.commit()

    # Insert conversations
    conversations_data = [
        (1, 'Facebook', 'User123'), (1, 'Facebook', 'User789'),
        (1, 'WhatsApp', 'User123'), (1, 'WhatsApp', 'User456'),
        (2, 'WhatsApp', 'User789'), (2, 'WhatsApp', 'User321'),
        (2, 'Telegram', 'User123'), (2, 'Telegram', 'User456'),
        (3, 'Facebook', 'User456'), (3, 'Facebook', 'User321'),
        (4, 'Facebook', 'User789'), (4, 'Facebook', 'User654'),
        (4, 'Telegram', 'User123'), (4, 'Telegram', 'User456'),
        (5, 'WhatsApp', 'User789'), (5, 'WhatsApp', 'User654'),
        (5, 'Facebook', 'User123'),
        (6, 'WhatsApp', 'User456'), (6, 'Telegram', 'User789'),
        (7, 'Facebook', 'User123'),
        (8, 'Telegram', 'User123'),
        (9, 'Facebook', 'User789'), (9, 'WhatsApp', 'User456'), (9, 'Telegram', 'User321')
    ]

    for bot_id, platform, user in conversations_data:
        conversation = Conversation(bot_id=bot_id, platform=platform, user=user)
        db.session.add(conversation)
    db.session.commit()

    # Insert Facebook messages
    facebook_messages_data = [
        (1, datetime(2024, 5, 15, 14, 30), 'Hello, can you help me with my order?', 'incoming'),
        (1, datetime(2024, 5, 15, 14, 31), 'Sure, I\'d be happy to assist. Could you please provide your order number?', 'outgoing'),
        (1, datetime(2024, 5, 15, 14, 32), 'It\'s 12345.', 'incoming'),
        (1, datetime(2024, 5, 15, 14, 33), 'Thank you. I\'ll check the status for you now.', 'outgoing'),
        (2, datetime(2024, 5, 15, 15, 30), 'Hey Lim, do you know the store hours for today?', 'incoming'),
        (2, datetime(2024, 5, 15, 15, 31), 'Yes, the store is open from 9 AM to 8 PM today.', 'outgoing')
    ]

    for conversation_id, timestamp, message, direction in facebook_messages_data:
        facebook_message = FacebookMessage(conversation_id=conversation_id, timestamp=timestamp, message=message, direction=direction)
        db.session.add(facebook_message)
    db.session.commit()

    # Insert WhatsApp messages
    whatsapp_messages_data = [
        (3, datetime(2024, 5, 15, 14, 0), 'Hey Lim, can you recommend a good restaurant nearby?', 'incoming'),
        (3, datetime(2024, 5, 15, 14, 1), 'Sure, how about trying \'The Fancy Feast\'? It\'s highly rated.', 'outgoing'),
        (4, datetime(2024, 5, 15, 15, 0), 'Lim, do you know if the pharmacy is open today?', 'incoming'),
        (4, datetime(2024, 5, 15, 15, 1), 'Yes, it\'s open until 6 PM today.', 'outgoing')
    ]

    for conversation_id, timestamp, message, direction in whatsapp_messages_data:
        whatsapp_message = WhatsappMessage(conversation_id=conversation_id, timestamp=timestamp, message=message, direction=direction)
        db.session.add(whatsapp_message)
    db.session.commit()

    # Insert Telegram messages
    telegram_messages_data = [
        (7, datetime(2024, 5, 15, 14, 15), 'Hello Chua, can you help me find a good recipe for dinner?', 'incoming'),
        (7, datetime(2024, 5, 15, 14, 16), 'Sure! How about trying a simple stir-fry with vegetables and chicken?', 'outgoing'),
        (8, datetime(2024, 5, 15, 15, 45), 'Hi Chua, do you have any tips for meal prepping?', 'incoming'),
        (8, datetime(2024, 5, 15, 15, 46), 'Yes! Start by planning your meals for the week and prepping ingredients in advance.', 'outgoing')
    ]

    for conversation_id, timestamp, message, direction in telegram_messages_data:
        telegram_message = TelegramMessage(conversation_id=conversation_id, timestamp=timestamp, message=message, direction=direction)
        db.session.add(telegram_message)
    db.session.commit()

print("Data inserted successfully")

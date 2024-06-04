from datetime import datetime
from backend import create_app
from backend.models import db, Bot, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage

app = create_app()

with app.app_context():
    
    # Delete existing data
    db.session.query(FacebookMessage).delete()
    db.session.query(WhatsappMessage).delete()
    db.session.query(TelegramMessage).delete()
    db.session.query(Conversation).delete()
    db.session.query(Platform).delete()
    db.session.query(Bot).delete()
    db.session.commit()

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
        (2, 'Telegram', 'User123'), (2, 'Telegram', 'User456'),
    ]

    for bot_id, platform, user in conversations_data:
        conversation = Conversation(bot_id=bot_id, platform=platform, user=user)
        db.session.add(conversation)
    db.session.commit()

    # Insert Facebook messages
    facebook_messages_data = [
        (1, datetime(2024, 5, 15, 14, 30), 'Hello, can you help me with my order?', 'incoming', None, None),
        (1, datetime(2024, 5, 15, 14, 31), 'Sure, I\'d be happy to assist. Could you please provide your order number?', 'outgoing', None, None),
        (1, datetime(2024, 5, 15, 14, 32), 'It\'s 12345.', 'incoming', None, None),
        (1, datetime(2024, 5, 15, 14, 33), 'Thank you. I\'ll check the status for you now.', 'outgoing', None, None),
        (1, datetime(2024, 5, 15, 14, 35), None, 'incoming', 'files/Facebook/1/User123/image1.jpg', 'image/jpeg'),
        (1, datetime(2024, 5, 15, 14, 36), 'Why did you send me a random cat picture??', 'incoming', None, None),
        (1, datetime(2024, 5, 15, 14, 37), 'Hello? Are you there?', 'incoming', None, None),
        (1, datetime(2024, 5, 15, 14, 38), 'OMG! I am so sorry, that was an accident', 'outgoing', None, None),
        (2, datetime(2024, 5, 15, 15, 30), 'Hey Lim, do you know the store hours for today?', 'incoming', None, None),
        (2, datetime(2024, 5, 15, 15, 31), 'Yes, the store is open from 9 AM to 8 PM today.', 'outgoing', None, None),
    ]

    for conversation_id, timestamp, message, direction, file_path, file_type in facebook_messages_data:
        facebook_message = FacebookMessage(
            conversation_id=conversation_id,
            timestamp=timestamp,
            message=message,
            direction=direction,
            file_path=file_path,
            file_type=file_type
        )
        db.session.add(facebook_message)
    db.session.commit()

    # Insert WhatsApp messages
    whatsapp_messages_data = [
        (3, datetime(2024, 5, 15, 14, 0), 'Hey Lim, can you recommend a good restaurant nearby?', 'incoming', None, None),
        (3, datetime(2024, 5, 15, 14, 1), 'Sure, how about trying \'The Fancy Feast\'? It\'s highly rated.', 'outgoing', None, None),
        (3, datetime(2024, 5, 15, 16, 0), 'What do you think of this restaurant? Look at this menu.', 'incoming', 'files/WhatsApp/1/User123/menu.jpg', 'image/jpeg'),
        (4, datetime(2024, 5, 15, 15, 0), 'Lim, do you know if the pharmacy is open today?', 'incoming', None, None),
        (4, datetime(2024, 5, 15, 15, 1), 'Yes, it\'s open until 6 PM today.', 'outgoing', None, None),
    ]

    for conversation_id, timestamp, message, direction, file_path, file_type in whatsapp_messages_data:
        whatsapp_message = WhatsappMessage(
            conversation_id=conversation_id,
            timestamp=timestamp,
            message=message,
            direction=direction,
            file_path=file_path,
            file_type=file_type
        )
        db.session.add(whatsapp_message)
    db.session.commit()

    # Insert Telegram messages
    telegram_messages_data = [
        (5, datetime(2024, 5, 15, 14, 15), 'Hello Chua, can you help me find a good recipe for dinner?', 'incoming', None, None),
        (5, datetime(2024, 5, 15, 14, 16), 'Sure! How about trying a simple stir-fry with vegetables and chicken?', 'outgoing', None, None),
        (5, datetime(2024, 5, 15, 16, 0), 'Here is the recipe image.', 'outgoing', 'files/Telegram/2/User456/recipe.jpg', 'image/jpeg'),
        (6, datetime(2024, 5, 15, 15, 45), 'Hi Chua, do you have any tips for meal prepping?', 'incoming', None, None),
        (6, datetime(2024, 5, 15, 15, 46), 'Yes! Start by planning your meals for the week and prepping ingredients in advance.', 'outgoing', None, None),
    ]

    for conversation_id, timestamp, message, direction, file_path, file_type in telegram_messages_data:
        telegram_message = TelegramMessage(
            conversation_id=conversation_id,
            timestamp=timestamp,
            message=message,
            direction=direction,
            file_path=file_path,
            file_type=file_type
        )
        db.session.add(telegram_message)
    db.session.commit()

print("Data inserted successfully")

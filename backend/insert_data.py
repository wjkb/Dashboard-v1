from datetime import datetime
from backend import create_app
from backend.models import db, Bot, Scammer, Platform, Conversation, FacebookMessage, WhatsappMessage, TelegramMessage, MessageScreenshots, ExtractedInformation, Alert, Edit
app = create_app()
with app.app_context():
    # Delete existing data
    db.session.query(ExtractedInformation).delete()
    db.session.query(FacebookMessage).delete()
    db.session.query(WhatsappMessage).delete()
    db.session.query(TelegramMessage).delete()
    db.session.query(MessageScreenshots).delete()
    db.session.query(Conversation).delete()
    db.session.query(Platform).delete()
    db.session.query(Scammer).delete()
    db.session.query(Bot).delete()
    db.session.query(Alert).delete()
    db.session.query(Edit).delete()
    db.session.commit()

    # Insert bots
    bots_data = [
        ('90000001', 'Lim Wei Jie', 'limweijie@gmail.com', 'Middle-aged man', 'Llama 2', True),
        ('90000002', 'Chua Mei Ling', 'chuameiling@gmail.com', 'Middle-aged man', 'Llama 3', False),
        ('90000003', 'Ahmad Yusof', 'ahmadyusof@gmail.com', 'Old man', 'Llama 2', False),
        ('90000004', 'Wong Li Hua', 'wonglihua@gmail.com', 'Young woman', 'Llama 2', False),
        ('90000005', 'Tan Wei', 'tanwei@gmail.com', 'Young man', 'Llama 3', False),
        ('90000006', 'Lim Mei Ling', 'limmeiling@gmail.com', 'Middle-aged woman', 'Llama 2', False),
        ('90000007', 'Rajendra Kumar', 'rajendrakumar@gmail.com', 'Old man', 'Llama 3', False),
        ('90000008', 'Loh Jia Hui', 'lohjiahui@gmail.com', 'Middle-aged woman', 'Llama 2', False),
        ('90000009', 'Soh Wei Lun', 'sohweilun@gmail.com', 'Young man', 'Llama 3', False)
    ]

    for id, name, email, persona, model, pause  in bots_data:
        bot = Bot(id=id, name=name, email=email, persona=persona, model=model)
        db.session.add(bot)
    db.session.commit()

    # Insert bot platforms
    platforms_data = [
        (90000001, 'Facebook'), (90000001, 'WhatsApp'),
        (90000002, 'WhatsApp'), (90000002, 'Telegram'),
        (90000003, 'Facebook'),
        (90000004, 'Facebook'), (90000004, 'Telegram'),
        (90000005, 'Facebook'), (90000005, 'WhatsApp'),
        (90000006, 'WhatsApp'), (90000006, 'Telegram'),
        (90000007, 'Facebook'),
        (90000008, 'Telegram'),
        (90000009, 'Facebook'), (90000009, 'WhatsApp'), (90000009, 'Telegram')
    ]

    for bot_id, platform in platforms_data:
        platform_entry = Platform(bot_id=bot_id, platform=platform)
        db.session.add(platform_entry)
    db.session.commit()

    # Insert scammers
    scammers_data = [
        ('facebookid_0001', 'Facebook'),
        ('facebookid_0002', 'Facebook'),
        ('90000012', 'WhatsApp'),
        ('90000013', 'WhatsApp'),
        ('telegramid_0001', 'Telegram'),
        ('telegramid_0002', 'Telegram')
    ]

    for unique_id, platform in scammers_data:
        scammer = Scammer(unique_id=unique_id, platform=platform)
        db.session.add(scammer)

    # Insert conversations
    conversations_data = [
        (90000001, 'Facebook', 1, 0), (90000001, 'Facebook', 2, 0),
        (90000001, 'WhatsApp', 3, 0), (90000001, 'WhatsApp', 4, 0),
        (90000002, 'Telegram', 5, 0), (90000002, 'Telegram', 6, 0),
    ]

    for bot_id, platform, scammer_id, pause in conversations_data:
        conversation = Conversation(bot_id=bot_id, platform=platform, scammer_id=scammer_id)
        db.session.add(conversation)
    db.session.commit()

    whatsapp_messages_data = [
        (3, 'incoming', '1', 'Hello! can you help me with my order?', datetime(2024, 5, 15, 14, 30), None, None, "edited", None),
        (3, 'outgoing', '1', 'Sure, I\'d be happy to assist. Could you please provide your order number?', datetime(2024, 5, 15, 14, 31), None, None, "sent", None),
        (3, 'incoming', '2', 'It\'s 12345.', datetime(2024, 5, 15, 14, 32), None, None, "deleted", datetime(2024, 5, 15, 14, 33)),
        (3, 'outgoing', '2', 'Thank you. I\'ll check the status for you now.', datetime(2024, 5, 15, 14, 33), None, None, "sent", None),
        (3, 'incoming', '3', None, datetime(2024, 5, 15, 14, 34, 10), 'test/WhatsApp/90000001/90000012/cat.jpg', 'image/jpeg', None, None),
        (3, 'incoming', '4', None, datetime(2024, 5, 15, 14, 34, 20), 'test/WhatsApp/90000001/90000012/cat.mp4', 'video/mp4', None, None),
        (3, 'incoming', '5', None, datetime(2024, 5, 15, 14, 34, 30), 'test/WhatsApp/90000001/90000012/cat.mp3', 'audio/mp3', None, None),
        (3, 'incoming', '6', None, datetime(2024, 5, 15, 14, 34, 40), 'test/WhatsApp/90000001/90000012/cat.pdf', 'application/pdf', None, None),
        (3, 'incoming', '7', None, datetime(2024, 5, 15, 14, 34, 50), 'test/WhatsApp/90000001/90000012/cat.txt', 'text/plain', None, None),
        (3, 'incoming', '8', None, datetime(2024, 5, 15, 14, 35, 10), 'test/WhatsApp/90000001/90000012/cat.py', 'text/x-python', None, None),
        (3, 'outgoing', '3', 'Why did you send me random cat stuff??', datetime(2024, 5, 15, 14, 37), None, None, "sent", None),
        (3, 'outgoing', '4', 'Hello? Are you there?', datetime(2024, 5, 15, 14, 37, 30), None, None, "sent", None),
        (3, 'incoming', '9', 'OMG. I am so sorry, that was an accident', datetime(2024, 5, 15, 14, 38), None, None, "deleted", datetime(2024, 5, 15, 14, 33)),
        (3, 'incoming', '10','wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww, dfasdfsadfsadfsafadfafdafdafdafdad', datetime(2024, 5, 15, 14, 40), None, None, None, None),
        (4, 'outgoing', '5', 'Hey Lim, do you know the store hours for today?', datetime(2024, 5, 15, 15, 30), None, None, "sent", None),
        (4, 'incoming', '10', 'Yes, the store is open from 9 AM to 8 PM today.', datetime(2024, 5, 15, 15, 31), None, None, None, None),
    ]

    # Insert messages into the database
    for conversation_id, direction, message_id, message_text, message_timestamp, file_path, file_type, response_status, deleted_timestamp in whatsapp_messages_data:
        whatsapp_message = WhatsappMessage(
            conversation_id=conversation_id,
            direction=direction,
            message_id=message_id,
            message_text=message_text,
            message_timestamp=message_timestamp,
            file_path=file_path,
            file_type=file_type,
            response_status=response_status,
            deleted_timestamp=deleted_timestamp
        )
        db.session.add(whatsapp_message)
    
    # Insert screenshots into the database
    screenshot_data = [
        (3, 'test/WhatsApp/90000001/90000012/ss1.jpg'),
        (3, 'test/WhatsApp/90000001/90000012/ss2.jpg')
    ]
    for conversation_id, file_path in screenshot_data:
        screenshot = MessageScreenshots(
            conversation_id=conversation_id,
            file_path=file_path
        )
        db.session.add(screenshot)

    db.session.commit()

    # Insert Alerts
    alerts_data = [
    ('90000012', 'incoming', 'deleted_message', 'WhatsApp', '1', "Hello! can you help me with my order?", False, datetime(2024, 5, 15, 14, 34, 40), '90000001'),
    ('90000012', 'incoming', 'deleted_message', 'WhatsApp', '2', "It's 12345.", False, datetime(2024, 5, 15, 14, 35, 11), '90000001'),
    ('90000012', 'incoming', 'deleted_message', 'WhatsApp', '2', "Test1", False, datetime(2024, 5, 15, 14, 35, 12), '90000001'),
    ('90000012', 'incoming', 'deleted_message', 'WhatsApp', '2', "Test2", False, datetime(2024, 5, 15, 14, 35, 13), '90000001'),
    ('90000012', 'incoming', 'deleted_message', 'WhatsApp', '2', "Test3", False, datetime(2024, 5, 15, 14, 35, 14), '90000001'),
    ('90000012', 'incoming', 'deleted_message', 'WhatsApp', '2', "Test4", False, datetime(2024, 5, 15, 14, 35, 15), '90000001'),
    ('90000012', 'incoming', 'deleted_message', 'WhatsApp', '2', "Test5", False, datetime(2024, 5, 15, 14, 35, 16), '90000001'),
    ('90000013', 'incoming', 'deleted_message', 'WhatsApp', '2', "Test6", False, datetime(2024, 5, 15, 14, 35, 17), '90000001'),
    ('90000012', 'incoming', 'edited_message', 'WhatsApp', '1', "Hello! can you help me with my order?", False, datetime(2024, 5, 15, 14, 35, 17), '90000001'),
    (None, None, 'manual_intervention_required', 'WhatsApp', None, None, None, datetime(2024, 5, 15, 14, 32, 18), '90000001')  
    ]

    for scammer_unique_id, direction, alert_type, platform_type, message_id, message_text, read_status, timestamp, bot_id in alerts_data:
        alert = Alert(
            scammer_unique_id=scammer_unique_id,
            direction=direction,
            alert_type=alert_type,
            platform_type=platform_type,
            message_id=message_id,
            message_text=message_text,
            read_status=read_status,
            timestamp=timestamp,
            bot_id=bot_id
        )
        db.session.add(alert)

    db.session.commit()


    # Insert Edit data
    edits_data = [
        (
            '90000012', 
            'Hello! can you help me with my order?',  
            'incoming',  
            'WhatsApp',  
            '1',  
            'Hello? can you help me with my order?',  
            '90000001', 
            datetime(2024, 5, 15, 14, 35, 17) 
        ),
        (
            '90000012',  
            'Hello! can you help me with my order?',  
            'incoming',  
            'WhatsApp',  
            '1',  
            'Hello3 can you help me with my order?',  
            '90000001',  
            datetime(2024, 5, 15, 14, 35, 24)  
        ),
        (
            '90000012',  
            'Hello! can you help me with my order?',  
            'incoming',  
            'WhatsApp',  
            '1',  
            'Hello4 can you help me with my order?',  
            '90000001',  
            datetime(2024, 5, 15, 14, 35, 39)  
        ),
    ]

    for scammer_unique_id, original_message_text, direction, platform_type, message_id, edited_message_text, bot_id, edited_timestamp in edits_data:
        edit_entry = Edit(
            scammer_unique_id=scammer_unique_id,
            original_message_text=original_message_text,  
            direction=direction,
            platform_type=platform_type,
            message_id=message_id,
            edited_message_text=edited_message_text,
            bot_id=bot_id,
            edited_timestamp=edited_timestamp
        )
        db.session.add(edit_entry)
        
    db.session.commit()






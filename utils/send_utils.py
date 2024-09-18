def send_proactive_queue(message: dict):
    """
    Send a message to the specific [platform]_[bot_id]_proactive RabbitMQ queue. 

    Parameters:
    message (dict): The message to be sent, formatted as a dictionary.
                        sample_message = {
                            "platform": "WA",
                            "bot_id": "+6597558145",
                            "scammer_id": "+6591549270",  # To be engaged
                            
                            }
    """
    print('this is the message received by send_proactive_queue:', message)


def send_main_convo_message(message: dict):
    """
    Send a message to the specific [platform]_[bot_id]_main_convo RabbitMQ queue. 

    Parameters:
    message (dict): The message to be sent, formatted as a dictionary.
                        sample_message = {
                            "platform": "WA",
                            "bot_id": "+6597558145",
                            "scammer_id": "+6591549270",  # To be engaged
                            "message": "Hello, how are you?"
                            }
    """
    print('this is the message received by send_main_convo_message:', message)


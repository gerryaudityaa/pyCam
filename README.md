# PyCam - Webcam Capture with Telegram Integration
A Flask web application that captures images from the user's webcam and sends them to a Telegram chat via a bot. Built with Flask, JavaScript, and the Telegram Bot API.

## Features
- 📷 Real-time webcam access in the browser
- ⏱️ Automatic image capture every 5 seconds
- 🖼️ Image compression and resizing (800x800 max)
- ✈️ Instant delivery to Telegram via bot
- 🔒 Secure HTTPS implementation
- 📝 Activity logging

## Prerequisites
Before you begin, ensure you have:
- Python 3.7+
- Telegram account with a bot token

## Setup Instructions
1. Clone the Repository
    
    ```bash
    git clone https://github.com/gerryaudityaa/pycam.git
    cd pycam

2. Install Dependencies
    
    ```bash
    pip install flask python-dotenv requests

3. Environment Configuration
   
    ```bash
    Create a .env file in the project root with:
    TELEGRAM_BOT_TOKEN=your_bot_token_here
    TELEGRAM_CHAT_ID=your_chat_id_here

4. Run the Application

    ```bash
    python app.py

The application will be available at https://localhost:5000 (you may need to accept the self-signed certificate or use ngrok).


# Contributing
Contributions are welcome! Please open an issue or submit a pull request.

Note: This project is intended for personal/educational use. Ensure compliance with privacy laws in your jurisdiction when deploying.

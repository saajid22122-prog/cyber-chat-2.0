from flask import Flask, render_template, request, jsonify
import requests
from config import Config

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        headers = {
            "Authorization": f"Bearer {Config.OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": Config.DEFAULT_MODEL,
            "messages": [{"role": "user", "content": user_message}]
        }
        
        response = requests.post(Config.OPENROUTER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        bot_response = response.json()['choices'][0]['message']['content']
        
        return jsonify({
            'status': 'success',
            'message': bot_response
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
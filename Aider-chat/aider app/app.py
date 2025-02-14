from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import random

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quotes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    author = db.Column(db.String(100), nullable=False)

@app.route('/random-quote', methods=['GET'])
def random_quote():
    quotes = Quote.query.all()
    if not quotes:
        return jsonify({"text": "No quotes available.", "author": "System"})
    
    quote = random.choice(quotes)
    return jsonify({"text": quote.text, "author": quote.author})

@app.route('/add-quote', methods=['POST'])
def add_quote():
    data = request.json
    new_quote = Quote(text=data['text'], author=data['author'])
    db.session.add(new_quote)
    db.session.commit()
    return jsonify({"message": "Quote added successfully!"})

if __name__ == '__main__':
    # Use app.app_context() to initialize the database
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)

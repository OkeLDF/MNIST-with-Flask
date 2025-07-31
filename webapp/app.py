from flask import render_template, request, jsonify
from config import app
import joblib
import numpy as np

model = joblib.load('./model.joblib')

@app.route('/', methods=['GET'])
def get_page():
    return render_template('index.html')

@app.route('/send_img', methods=['POST'])
def post_img():
    img = request.json.get('img')

    y_pred = model.predict([img])[0]
    y_proba = model.predict_proba([img])[0].tolist()

    return jsonify({
        'status': 'ok',
        'prediction': y_pred,
        'probabilities': y_proba
    }), 200

if __name__ == '__main__':
    print(model, 'loaded successfully')
    app.run(debug=True)
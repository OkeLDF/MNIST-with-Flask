from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('./model.joblib')

@app.route('/', methods=['GET'])
def get_page():
    return render_template('index.html')

@app.route('/dataset', methods=['GET'])
def get_dataset():
    return render_template('dataset.html')

@app.route('/dataset/send', methods=['POST'])
def send_dataset():
    img = request.json.get('img')
    # Here you would typically save the image data to your dataset
    # print("Received image data:", img)

    return jsonify({"status": "ok"}), 200

@app.route('/predict', methods=['POST'])
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
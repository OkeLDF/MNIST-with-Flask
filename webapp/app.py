import joblib

model = joblib.load('./model.pkl')
print(model, 'loaded successfully')

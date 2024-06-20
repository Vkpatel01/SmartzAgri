from flask import Flask, request, jsonify
import os
import pickle
from dotenv import load_dotenv
# from sklearn.preprocessing import StandardScaler, LabelEncoder

# Get the current working directory
current_directory = os.getcwd()
app = Flask(__name__)
load_dotenv()

# Load the API key from the .env file
API_KEY = os.getenv("API_KEY")
PORT = os.getenv("PORT")

# Load the trained model
model_filename =current_directory+'/XGB/crop_prediction_model_xgb.pkl'
loaded_model = pickle.load(open(model_filename, 'rb'))

scaler_filename =current_directory+'/XGB/scaler.pkl'
scaler = pickle.load(open(scaler_filename, 'rb'))

label_encoder_filename = current_directory+'/XGB/label_encoder.pkl'
label_encoder = pickle.load(open(label_encoder_filename, 'rb'))

# Define a function to authenticate API requests
def authenticate(api_key):
    return api_key == API_KEY

# Define an endpoint for your API
@app.route('/predict', methods=['POST'])
def predict():
    # Print the request data
    print("Request data:", request.json)
    print("Header data:", request.headers)
    print(API_KEY)
    # Check if the request has the API key
    # if 'api_key' not in request.headers:
    #     return jsonify({'error': 'Missing API key'}), 401

    # api_key = request.headers['API_KEY']

    # # Authenticate the request
    # if not authenticate(api_key):
    #     return jsonify({'error': 'Unauthorized'}), 403

    

    # Get data from the request
    data = request.json
    user_values = [data['N'], data['P'], data['K'], data['pH'], data['rainfall'], data['temperature']]

    # Make predictions using the model
    user_input_scaled = scaler.transform([user_values])  # Wrap user_values in a list
    predicted_crop_encoded = loaded_model.predict(user_input_scaled)
    predicted_crop = label_encoder.inverse_transform(predicted_crop_encoded)[0]

    # Return the prediction as a response
    return jsonify({'prediction': predicted_crop})

# Error handler for 404 (page not found) error
@app.errorhandler(404)
def page_not_found(error):
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    # Specify the port to run the Flask app on
   # PORT = int(os.getenv("PORT", 5000))  # Default port is 5000 if not specified in .env

    # Run the Flask app
    app.run(debug=True)

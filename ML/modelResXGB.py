import os
import sys
import pickle
import pandas as pd
import json

from sklearn.preprocessing import StandardScaler, LabelEncoder

# Get the current working directory
current_directory = os.getcwd()

# Load the trained model
# model_filename = current_directory+'/crop_prediction_model.pkl'
model_filename = current_directory+'/ML/XGB/crop_prediction_model_xgb.pkl'
loaded_model = pickle.load(open(model_filename, 'rb'))

# Read user input from Node.js backend
user_values = pd.DataFrame([json.loads(sys.argv[1])])

# Assuming you have a variable named 'scaler' saved during model training,
# use the same scaler to transform the user input
scaler_filename = current_directory+'/ML/XGB/scaler.pkl'
scaler = pickle.load(open(scaler_filename, 'rb'))

# Standardize the user input
user_input_scaled = scaler.transform(user_values)

# Make the prediction
predicted_crop_encoded = loaded_model.predict(user_input_scaled)

# Inverse transform the encoded prediction to get the actual crop name
label_encoder = LabelEncoder()

# Assuming you have a variable named 'label_encoder' saved during model training,
# use the same label_encoder to inverse transform the prediction
label_encoder_filename = current_directory+'/ML/XGB/label_encoder.pkl'
label_encoder = pickle.load(open(label_encoder_filename, 'rb'))

predicted_crop = label_encoder.inverse_transform(predicted_crop_encoded)[0]

# Print the recommended crop
print(predicted_crop)

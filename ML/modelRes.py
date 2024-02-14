import os
import sys
import pickle
import pandas as pd
import json

# Get the current working directory
current_directory = os.getcwd()

# Load the trained model
# model_filename = current_directory+'/crop_prediction_model.pkl'
model_filename = current_directory+'/ML/crop_prediction_model.pkl'
loaded_model = pickle.load(open(model_filename, 'rb'))

# Read user input from Node.js backend
user_values = pd.DataFrame([json.loads(sys.argv[1])])

# Make the prediction
predicted_crop = loaded_model.predict(user_values)[0]

# Print the prediction for Node.js to read
print(predicted_crop)








# Checking manualy the crop pridiction 

# # Assuming feature_names is a list containing the names of your features
# feature_names = ['N', 'P', 'K', 'pH', 'rainfall','temperature']

# # Get user input for each feature
# user_values = []
# for feature in feature_names:
#     value = float(input(f"Enter value for {feature}: "))
#     user_values.append(value)

# # Create a DataFrame with user input
# new_conditions = pd.DataFrame([user_values], columns=feature_names)

# # Make the prediction
# predicted_crop = loaded_model.predict(new_conditions)[0]

# # Print the recommended crop
# print(f"Recommended Crop: {predicted_crop}")

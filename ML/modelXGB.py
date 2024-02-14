


import os

import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler, LabelEncoder
from xgboost import XGBClassifier
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score

# Get the current working directory
current_directory = os.getcwd()


# Import necessary libraries
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score



# Load your dataset
train_dataset = pd.read_csv(current_directory + "/ML/data-set/TRAINFILE/NewData.csv")
test_dataset = pd.read_csv(current_directory + "/ML/data-set/TESTFILE/NewTestData.csv")

# Droping "Unnamed: 0" which show Sirial No.
train_dataset = train_dataset.drop(columns=['Unnamed: 0'])
test_dataset = test_dataset.drop(columns=['Unnamed: 0'])


# Assuming the columns are named appropriately, adjust as needed
columns_to_drop = ['Crop']
X_train = train_dataset.drop(columns=columns_to_drop)
y_train = train_dataset['Crop']  # Target for training

columns_to_drop = ['Crop']
X_test = test_dataset.drop(columns=columns_to_drop)
y_test = test_dataset['Crop']  # Target for testing


# Label encode the target variable
label_encoder = LabelEncoder()
y_train_encoded = label_encoder.fit_transform(y_train)
y_test_encoded = label_encoder.transform(y_test)

# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize XGBoost classifier
clf_xgboost = XGBClassifier()

# Train the classifier with standardized features
clf_xgboost.fit(X_train_scaled, y_train_encoded)

# Make predictions on the test set with standardized features
y_pred_xgboost = clf_xgboost.predict(X_test_scaled)

# Evaluate the accuracy with standardized features using XGBoost
accuracy_xgboost = accuracy_score(y_test_encoded, y_pred_xgboost)
print(f"Accuracy with Standardized Features and XGBoost: {accuracy_xgboost * 100:.2f}%")


# Save the trained model using Pickle
model_filename = current_directory + '/ML/XGB/'
pickle.dump(clf_xgboost, open(model_filename+'crop_prediction_model_xgb.pkl', 'wb'))

pickle.dump(scaler, open(model_filename + 'scaler.pkl', 'wb'))
pickle.dump(label_encoder, open(model_filename + 'label_encoder.pkl', 'wb'))






# Assuming feature_names is a list containing the names of your features
feature_names = ['N', 'P', 'K', 'pH', 'rainfall','temperature']

# Get user input for each feature
user_values = []
for feature in X_train.columns:  # Use the columns from the training set
    while True:
        try:
            value = float(input(f"Enter value for {feature}: "))
            user_values.append(value)
            break
        except ValueError:
            print("Invalid input. Please enter a numerical value.")

# Create a DataFrame with user input
new_conditions = pd.DataFrame([user_values], columns=X_train.columns)

# Standardize the user input
user_input_scaled = scaler.transform(new_conditions)

# Make the prediction
predicted_crop_encoded = clf_xgboost.predict(user_input_scaled)

# Inverse transform the encoded prediction to get the actual crop name
predicted_crop = label_encoder.inverse_transform(predicted_crop_encoded)

# Print the recommended crop
print(f"Recommended Crop: {predicted_crop[0]}")

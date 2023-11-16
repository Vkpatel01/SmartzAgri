import os

import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score

# Get the current working directory
current_directory = os.getcwd()

# Load your dataset
dataset = pd.read_csv(current_directory + "/data-set/CropDataSet.csv")
# dataset.head()

# Assuming the columns are named appropriately, adjust as needed
X = dataset.drop('label', axis=1)  # Features
y = dataset['label']  # Target


# one-hot encode the categorical feature "Avarage"
dataset = pd.get_dummies(dataset, columns=['label'])

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a Naive Bayes classifier
clf = GaussianNB()

# Train the classifier
clf.fit(X_train, y_train)

# Save the trained model using Pickle
model_filename = 'crop_prediction_model.pkl'
pickle.dump(clf, open(model_filename, 'wb'))

# Make predictions on the test set
y_pred = clf.predict(X_test)

# Evaluate the accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")



# Assuming feature_names is a list containing the names of your features
feature_names = ['N', 'P', 'K', 'ph', 'rainfall']

# Get user input for each feature
user_values = []
for feature in feature_names:
    value = float(input(f"Enter value for {feature}: "))
    user_values.append(value)

# Create a DataFrame with user input
new_conditions = pd.DataFrame([user_values], columns=feature_names)

# Make the prediction
predicted_crop = clf.predict(new_conditions)[0]

# Print the recommended crop
print(f"Recommended Crop: {predicted_crop}")


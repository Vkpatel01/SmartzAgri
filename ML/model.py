import os

import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score

# Get the current working directory
current_directory = os.getcwd()


# Import necessary libraries
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score



# Load your dataset
train_dataset = pd.read_csv(current_directory + "/ML/data-set/TRAINFILE/NewData.csv")
test_dataset = pd.read_csv(current_directory + "/ML/data-set/TESTFILE/NewTestData.csv")

# Droping "Unnamed: 0" which show Sirial No.
train_dataset = train_dataset.drop(columns=['Unnamed: 0'])
test_dataset = test_dataset.drop(columns=['Unnamed: 0'])


# Assuming the columns are named appropriately, adjust as needed

columns_to_drop = ['Crop']
X_train = train_dataset.drop(columns=columns_to_drop, axis=1)
y_train = train_dataset['Crop']  # Target for training

# Assuming the columns are named appropriately, adjust as needed
columns_to_drop = ['Crop']  # Replace with your actual column names
X_test = test_dataset.drop(columns=columns_to_drop, axis=1)  # Features for training
y_test = test_dataset['Crop']  # Target for training

# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create a Naive Bayes classifier
clf = GaussianNB()

# Train the classifier with PCA-transformed features
clf.fit(X_train, y_train)

# Make predictions on the training set with PCA-transformed features
y_train_pred = clf.predict(X_train)

# Evaluate the accuracy on the training set
train_accuracy = accuracy_score(y_train, y_train_pred)

# Make predictions on the test set with PCA-transformed features
y_test_pred = clf.predict(X_test)

# Evaluate the accuracy on the test set
test_accuracy = accuracy_score(y_test, y_test_pred)


labels = ['Test Accuracy']
accuracies = [ test_accuracy]


y_pred= clf.predict(X_test)
accuracy= accuracy_score(y_test, y_pred)

print("Accuracy:", f"{accuracy*100:.2f}%")



# Save the trained model using Pickle
model_filename = current_directory + '/ML/crop_prediction_model.pkl'
pickle.dump(clf, open(model_filename, 'wb'))
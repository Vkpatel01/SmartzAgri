import requests
import json

# Define the URL of your Flask API endpoint
url = 'http://127.0.0.1:5000/predict'

# Define the API key
API_KEY = 'smartzagri#ml33221'

# Define the data to be sent in the request
data = {
    'N': 50,
    'P': 50,
    'K': 50,
    'pH': 7.2,
    'rainfall': 350,
    "temperature": 27
    # Add more fields as needed
}

# Define the headers with the API key
headers = {
    'api_key': API_KEY,
    'Content-Type': 'application/json'
}

# Make the POST request
response = requests.post(url, headers=headers, json=data)

# Print the response
print(response.json())

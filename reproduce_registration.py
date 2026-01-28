import requests
import json

url = "http://localhost:8000/auth/register"
headers = {
    "Content-Type": "application/json"
}
data = {
    "email": "test_repro@example.com",
    "password": "password123",
    "full_name": "Test Repro",
    "company_name": "Repro Corp",
    "role": "vendor"
}

try:
    print(f"Sending POST request to {url}...")
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"An error occurred: {e}")

import json
import requests
import time

def train_model():
    # Load training data
    with open('training_data.json', 'r') as f:
        training_data = json.load(f)

    # Prepare the model configuration
    model_config = {
        "name": "wine-dao-assistant",
        "base_model": "mistral",  # Using Mistral as base model
        "parameters": {
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 1000
        }
    }

    # Create the model
    response = requests.post(
        "http://localhost:11434/api/create",
        json=model_config
    )

    if response.status_code != 200:
        print("Error creating model:", response.text)
        return

    # Train the model with conversations
    for conversation in training_data["conversations"]:
        for message in conversation["messages"]:
            response = requests.post(
                "http://localhost:11434/api/train",
                json={
                    "model": "wine-dao-assistant",
                    "messages": [message]
                }
            )
            
            if response.status_code != 200:
                print(f"Error training with message: {message}")
                continue
            
            # Small delay to prevent overwhelming the API
            time.sleep(0.1)

    print("Training completed!")

if __name__ == "__main__":
    train_model()
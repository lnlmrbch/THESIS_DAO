# Wine DAO Chatbot Backend

This is the backend service for the Wine DAO chatbot, using FastAPI and Ollama for LLM integration.

## Setup

1. Install Ollama:
   ```bash
   curl https://ollama.ai/install.sh | sh
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start Ollama:
   ```bash
   ollama serve
   ```

5. Train the model:
   ```bash
   python train.py
   ```

6. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `POST /api/chat`: Send messages to the chatbot
- `GET /api/health`: Health check endpoint

## Training Data

The training data is stored in `training_data.json`. You can add more conversations to improve the chatbot's responses.
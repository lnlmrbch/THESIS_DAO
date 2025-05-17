from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
import os
from typing import List, Optional

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama API endpoint
OLLAMA_API = "http://localhost:11434/api"

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Call Ollama API
        response = requests.post(
            f"{OLLAMA_API}/chat",
            json={
                "model": "wine-dao-assistant",
                "messages": [
                    {
                        "role": "user",
                        "content": request.message
                    }
                ],
                "stream": False
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error from Ollama API")
        
        return ChatResponse(response=response.json()["message"]["content"])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
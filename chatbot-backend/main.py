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

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Standard response for all messages
    response = """Vielen Dank für Ihre Nachricht! 

Der KI-Chatbot befindet sich aktuell noch in der Konzeptionsphase. Für Ihre Anfragen oder Feedback wenden Sie sich bitte direkt an:

📧 murbalio@students.zhaw.ch

Wir freuen uns über Ihr Interesse und werden uns schnellstmöglich bei Ihnen melden!"""
    
    return ChatResponse(response=response)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
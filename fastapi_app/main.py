
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import os
from typing import Optional, Dict, Any
import json

# Import route modules
from routes import (
    agents, campaigns, contacts, scripts, 
    knowledge_base, voices, call_details, 
    call_data, entities
)

app = FastAPI(
    title="AI Calling Platform API",
    description="FastAPI replication of Supabase Edge Functions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(agents.router, prefix="/agents", tags=["agents"])
app.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
app.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
app.include_router(scripts.router, prefix="/scripts", tags=["scripts"])
app.include_router(knowledge_base.router, prefix="/knowledge-base", tags=["knowledge-base"])
app.include_router(voices.router, prefix="/voices", tags=["voices"])
app.include_router(call_details.router, prefix="/call-details", tags=["call-details"])
app.include_router(call_data.router, prefix="/call-data", tags=["call-data"])
app.include_router(entities.router, prefix="/entities", tags=["entities"])

@app.get("/")
async def root():
    return {"message": "AI Calling Platform API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

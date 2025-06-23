
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from database import get_supabase_client, authenticate_user

router = APIRouter()

class VoiceCreate(BaseModel):
    voice_name: str
    voice_id: str

class VoiceResponse(BaseModel):
    success: bool
    voice: Optional[Dict[str, Any]] = None
    voices: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None

@router.post("/create", response_model=VoiceResponse)
async def create_voice(
    voice_data: VoiceCreate,
    authorization: str = Header(..., alias="Authorization")
):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("custom_voices").insert({
            "user_id": user["id"],
            "voice_name": voice_data.voice_name,
            "voice_id": voice_data.voice_id
        }).select().single().execute()
        
        return VoiceResponse(success=True, voice=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list", response_model=VoiceResponse)
async def list_voices(authorization: str = Header(..., alias="Authorization")):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("custom_voices").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
        return VoiceResponse(success=True, voices=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

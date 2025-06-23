
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from database import get_supabase_client, authenticate_user

router = APIRouter()

class ScriptCreate(BaseModel):
    name: str
    description: Optional[str] = None
    company: Optional[str] = None
    first_message: Optional[str] = None
    sections: Optional[List[Dict[str, Any]]] = []

class ScriptResponse(BaseModel):
    success: bool
    script: Optional[Dict[str, Any]] = None
    scripts: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None

@router.post("/create", response_model=ScriptResponse)
async def create_script(
    script_data: ScriptCreate,
    authorization: str = Header(..., alias="Authorization")
):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("scripts").insert({
            "user_id": user["id"],
            "name": script_data.name,
            "description": script_data.description,
            "company": script_data.company,
            "first_message": script_data.first_message,
            "sections": script_data.sections
        }).select().single().execute()
        
        return ScriptResponse(success=True, script=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list", response_model=ScriptResponse)
async def list_scripts(authorization: str = Header(..., alias="Authorization")):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("scripts").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
        return ScriptResponse(success=True, scripts=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user-scripts", response_model=ScriptResponse)
async def get_user_scripts(authorization: str = Header(..., alias="Authorization")):
    return await list_scripts(authorization)

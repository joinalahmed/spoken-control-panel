
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from database import get_supabase_client, authenticate_user

router = APIRouter()

class AgentCreate(BaseModel):
    name: str
    voice: Optional[str] = "nova"
    status: Optional[str] = "inactive"
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    first_message: Optional[str] = None
    knowledge_base_id: Optional[str] = None
    company: Optional[str] = None
    agent_type: Optional[str] = "outbound"

class AgentResponse(BaseModel):
    success: bool
    agent: Optional[Dict[str, Any]] = None
    agents: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None

@router.post("/create", response_model=AgentResponse)
async def create_agent(
    agent_data: AgentCreate,
    authorization: str = Header(..., alias="Authorization")
):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("agents").insert({
            "user_id": user["id"],
            "name": agent_data.name,
            "voice": agent_data.voice,
            "status": agent_data.status,
            "description": agent_data.description,
            "system_prompt": agent_data.system_prompt,
            "first_message": agent_data.first_message,
            "knowledge_base_id": agent_data.knowledge_base_id,
            "company": agent_data.company,
            "agent_type": agent_data.agent_type,
            "conversations": 0
        }).select().single().execute()
        
        return AgentResponse(success=True, agent=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list", response_model=AgentResponse)
async def list_agents(authorization: str = Header(..., alias="Authorization")):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("agents").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
        return AgentResponse(success=True, agents=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/by-number")
async def get_agent_by_number(number: str):
    supabase = get_supabase_client()
    
    try:
        # Query agents by name or ID containing the number
        result = supabase.table("agents").select("*").or_(f"name.ilike.%{number}%,id.eq.{number}").limit(1).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        agent = result.data[0]
        return {
            "success": True,
            "agent": {
                "id": agent["id"],
                "name": agent["name"],
                "voice": agent["voice"],
                "status": agent["status"],
                "description": agent["description"],
                "conversations": agent["conversations"],
                "last_active": agent["last_active"],
                "system_prompt": agent["system_prompt"],
                "first_message": agent["first_message"],
                "knowledge_base_id": agent["knowledge_base_id"],
                "created_at": agent["created_at"],
                "updated_at": agent["updated_at"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

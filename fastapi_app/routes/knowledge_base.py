
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from database import get_supabase_client, authenticate_user

router = APIRouter()

class KnowledgeBaseCreate(BaseModel):
    title: str
    type: Optional[str] = "document"
    description: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = "draft"

class KnowledgeBaseResponse(BaseModel):
    success: bool
    knowledge_base: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@router.post("/create", response_model=KnowledgeBaseResponse)
async def create_knowledge_base(
    kb_data: KnowledgeBaseCreate,
    authorization: str = Header(..., alias="Authorization")
):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        from datetime import datetime
        now = datetime.utcnow().isoformat()
        
        result = supabase.table("knowledge_base").insert({
            "user_id": user["id"],
            "title": kb_data.title,
            "type": kb_data.type,
            "description": kb_data.description,
            "content": kb_data.content,
            "tags": kb_data.tags,
            "status": kb_data.status,
            "date_added": now,
            "last_modified": now
        }).select().single().execute()
        
        return KnowledgeBaseResponse(success=True, knowledge_base=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list")
async def list_knowledge_base(authorization: str = Header(..., alias="Authorization")):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("knowledge_base").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
        return {"success": True, "knowledge_base": result.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

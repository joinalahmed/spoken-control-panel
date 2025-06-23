
from fastapi import APIRouter, HTTPException, Header
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel
from database import get_supabase_client, authenticate_user

router = APIRouter()

class EntityData(BaseModel):
    # Agent fields
    name: Optional[str] = None
    voice: Optional[str] = "nova"
    status: Optional[str] = "inactive"
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    first_message: Optional[str] = None
    knowledge_base_id: Optional[str] = None
    company: Optional[str] = None
    agent_type: Optional[str] = "outbound"
    
    # Contact fields
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    
    # Knowledge base fields
    title: Optional[str] = None
    type: Optional[str] = "document"
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    
    # Campaign fields
    agent_id: Optional[str] = None
    contact_ids: Optional[List[str]] = []

class CreateEntityRequest(BaseModel):
    entityType: str
    data: EntityData

@router.post("/create-entity")
async def create_entity(
    request: CreateEntityRequest,
    authorization: str = Header(..., alias="Authorization")
):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    entity_type = request.entityType
    data = request.data
    
    try:
        if entity_type == "agent":
            result = supabase.table("agents").insert({
                "user_id": user["id"],
                "name": data.name,
                "voice": data.voice,
                "status": data.status,
                "description": data.description,
                "system_prompt": data.system_prompt,
                "first_message": data.first_message,
                "knowledge_base_id": data.knowledge_base_id,
                "company": data.company,
                "agent_type": data.agent_type,
                "conversations": 0
            }).select().single().execute()
            
        elif entity_type == "contact":
            result = supabase.table("contacts").insert({
                "user_id": user["id"],
                "name": data.name,
                "email": data.email,
                "phone": data.phone,
                "address": data.address,
                "city": data.city,
                "state": data.state,
                "zip_code": data.zip_code,
                "status": data.status or "active"
            }).select().single().execute()
            
        elif entity_type == "knowledge_base":
            from datetime import datetime
            now = datetime.utcnow().isoformat()
            
            result = supabase.table("knowledge_base").insert({
                "user_id": user["id"],
                "title": data.title,
                "type": data.type,
                "description": data.description,
                "content": data.content,
                "tags": data.tags,
                "status": data.status or "draft",
                "date_added": now,
                "last_modified": now
            }).select().single().execute()
            
        elif entity_type == "campaign":
            result = supabase.table("campaigns").insert({
                "user_id": user["id"],
                "name": data.name,
                "description": data.description,
                "agent_id": data.agent_id,
                "contact_ids": data.contact_ids,
                "status": data.status or "draft",
                "knowledge_base_id": data.knowledge_base_id
            }).select().single().execute()
            
            # Create campaign_contacts entries if contact_ids provided
            if data.contact_ids:
                campaign_contacts = [
                    {"campaign_id": result.data["id"], "contact_id": contact_id}
                    for contact_id in data.contact_ids
                ]
                supabase.table("campaign_contacts").insert(campaign_contacts).execute()
                
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported entity type: {entity_type}")
        
        return {
            "success": True,
            "data": result.data,
            "entityType": entity_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from database import get_supabase_client, authenticate_user

router = APIRouter()

class CampaignCreate(BaseModel):
    name: str
    description: Optional[str] = None
    agent_id: Optional[str] = None
    contact_ids: Optional[List[str]] = []
    status: Optional[str] = "draft"
    knowledge_base_id: Optional[str] = None

class CampaignResponse(BaseModel):
    success: bool
    campaign: Optional[Dict[str, Any]] = None
    campaigns: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None

@router.post("/create", response_model=CampaignResponse)
async def create_campaign(
    campaign_data: CampaignCreate,
    authorization: str = Header(..., alias="Authorization")
):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        # Create campaign
        result = supabase.table("campaigns").insert({
            "user_id": user["id"],
            "name": campaign_data.name,
            "description": campaign_data.description,
            "agent_id": campaign_data.agent_id,
            "contact_ids": campaign_data.contact_ids,
            "status": campaign_data.status,
            "knowledge_base_id": campaign_data.knowledge_base_id
        }).select().single().execute()
        
        # Create campaign_contacts entries if contact_ids provided
        if campaign_data.contact_ids:
            campaign_contacts = [
                {"campaign_id": result.data["id"], "contact_id": contact_id}
                for contact_id in campaign_data.contact_ids
            ]
            supabase.table("campaign_contacts").insert(campaign_contacts).execute()
        
        return CampaignResponse(success=True, campaign=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list", response_model=CampaignResponse)
async def list_campaigns(authorization: str = Header(..., alias="Authorization")):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("campaigns").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
        return CampaignResponse(success=True, campaigns=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/extracted-data/{campaign_id}")
async def get_campaign_extracted_data(campaign_id: str):
    supabase = get_supabase_client(use_service_role=True)
    
    try:
        # Get campaign
        campaign_result = supabase.table("campaigns").select("id, name, extracted_data_config").eq("id", campaign_id).single().execute()
        
        if not campaign_result.data:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Get calls with extracted data
        calls_result = supabase.table("calls").select("""
            id, phone, started_at, duration, status, extracted_data,
            contacts!inner(name)
        """).eq("campaign_id", campaign_id).not_("extracted_data", "is", None).execute()
        
        campaign = campaign_result.data
        calls = calls_result.data or []
        
        extracted_data_config = campaign.get("extracted_data_config", [])
        call_data = [
            {
                "call_id": call["id"],
                "contact_name": call["contacts"]["name"] if call["contacts"] else "Unknown",
                "phone": call["phone"],
                "started_at": call["started_at"],
                "duration": call["duration"] or 0,
                "status": call["status"],
                "extracted_data": call["extracted_data"] or {}
            }
            for call in calls
        ]
        
        return {
            "campaign": {
                "id": campaign["id"],
                "name": campaign["name"],
                "extracted_data_config": extracted_data_config
            },
            "calls": call_data,
            "total_calls": len(call_data),
            "fields_configured": len(extracted_data_config)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

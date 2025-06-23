
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from database import get_supabase_client, normalize_phone_number

router = APIRouter()

@router.get("/caller-details")
async def get_caller_details(
    phone: str = Query(...),
    campaign_type: Optional[str] = Query(None)
):
    supabase = get_supabase_client(use_service_role=True)
    
    try:
        # Find contact by phone
        normalized_phone = normalize_phone_number(phone)
        contacts_result = supabase.table("contacts").select("*").execute()
        
        contact = None
        for c in contacts_result.data:
            if c["phone"] and normalize_phone_number(c["phone"]) == normalized_phone:
                contact = c
                break
        
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        # Find active inbound campaign for this user
        campaigns_result = supabase.table("campaigns").select("*").eq("user_id", contact["user_id"]).eq("status", "active").execute()
        
        campaign = None
        for c in campaigns_result.data:
            settings = c.get("settings", {})
            if settings.get("campaign_type") == "inbound":
                campaign = c
                break
        
        if not campaign:
            raise HTTPException(status_code=404, detail="No active inbound campaigns found for this contact")
        
        # Get agent, script, and user details
        agent = None
        if campaign.get("agent_id"):
            agent_result = supabase.table("agents").select("*").eq("id", campaign["agent_id"]).single().execute()
            if agent_result.data:
                agent = agent_result.data
        
        script = None
        if campaign.get("script_id"):
            script_result = supabase.table("scripts").select("*").eq("id", campaign["script_id"]).single().execute()
            if script_result.data:
                script = script_result.data
        
        user_profile = None
        user_result = supabase.table("profiles").select("*").eq("id", contact["user_id"]).single().execute()
        if user_result.data:
            user_profile = user_result.data
        
        # Get knowledge base
        knowledge_bases = []
        if campaign.get("knowledge_base_id"):
            kb_result = supabase.table("knowledge_base").select("*").eq("id", campaign["knowledge_base_id"]).eq("status", "published").single().execute()
            if kb_result.data:
                knowledge_bases = [kb_result.data]
        
        return {
            "success": True,
            "campaign": campaign,
            "contact": contact,
            "agent": agent,
            "script": script,
            "user": user_profile,
            "knowledge_bases": knowledge_bases
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/outbound-call-details")
async def get_outbound_call_details(
    campaign_id: str = Query(...),
    phone: str = Query(...)
):
    supabase = get_supabase_client(use_service_role=True)
    
    try:
        # Get campaign
        campaign_result = supabase.table("campaigns").select("*").eq("id", campaign_id).single().execute()
        if not campaign_result.data:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        campaign = campaign_result.data
        
        # Find contact by phone
        normalized_phone = normalize_phone_number(phone)
        contacts_result = supabase.table("contacts").select("*").execute()
        
        contact = None
        for c in contacts_result.data:
            if c["phone"] and normalize_phone_number(c["phone"]) == normalized_phone:
                contact = c
                break
        
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        # Verify contact is in campaign
        campaign_contact_result = supabase.table("campaign_contacts").select("*").eq("campaign_id", campaign_id).eq("contact_id", contact["id"]).single().execute()
        
        if not campaign_contact_result.data:
            raise HTTPException(status_code=404, detail="Contact not found in the specified campaign")
        
        # Get agent details
        agent = None
        if campaign.get("agent_id"):
            agent_result = supabase.table("agents").select("*").eq("id", campaign["agent_id"]).single().execute()
            if agent_result.data:
                agent = agent_result.data
        
        if not agent:
            raise HTTPException(status_code=404, detail="No agent assigned to this outbound campaign")
        
        # Get script details
        script = None
        if campaign.get("script_id"):
            script_result = supabase.table("scripts").select("*").eq("id", campaign["script_id"]).single().execute()
            if script_result.data:
                script = script_result.data
        
        # Get user profile
        contact_user = None
        user_result = supabase.table("profiles").select("*").eq("id", contact["user_id"]).single().execute()
        if user_result.data:
            contact_user = user_result.data
        
        # Get knowledge bases
        knowledge_bases = []
        if campaign.get("knowledge_base_id"):
            kb_result = supabase.table("knowledge_base").select("*").eq("id", campaign["knowledge_base_id"]).eq("status", "published").single().execute()
            if kb_result.data:
                knowledge_bases = [kb_result.data]
        
        return {
            "success": True,
            "campaign": campaign,
            "agent": agent,
            "script": script,
            "contact_user": contact_user,
            "knowledge_bases": knowledge_bases,
            "contact": contact
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

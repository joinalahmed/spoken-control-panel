
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from database import get_supabase_client, normalize_phone_number

router = APIRouter()

class CallData(BaseModel):
    phone: str
    duration: Optional[int] = None
    status: Optional[str] = None
    direction: Optional[str] = "outbound"
    recording_url: Optional[str] = None
    transcript: Optional[str] = None
    call_id: Optional[str] = None
    started_at: Optional[str] = None
    ended_at: Optional[str] = None
    notes: Optional[str] = None
    campaign_id: Optional[str] = None
    outcome: Optional[str] = None
    sentiment: Optional[float] = None
    user_id: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    call_status: Optional[str] = "completed"
    rescheduled_for: Optional[str] = None
    objective_met: Optional[bool] = None

@router.post("/receive-call-data")
async def receive_call_data(call_data: CallData):
    supabase = get_supabase_client(use_service_role=True)
    
    try:
        # Find contact by phone number
        normalized_phone = normalize_phone_number(call_data.phone)
        contacts_result = supabase.table("contacts").select("*").execute()
        
        contact = None
        for c in contacts_result.data:
            if c["phone"] and normalize_phone_number(c["phone"]) == normalized_phone:
                contact = c
                break
        
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        # Update contact's last_called timestamp
        now = datetime.utcnow().isoformat()
        supabase.table("contacts").update({
            "last_called": call_data.ended_at or call_data.started_at or now,
            "updated_at": now
        }).eq("id", contact["id"]).execute()
        
        # Store call record
        call_record = {
            "contact_id": contact["id"],
            "campaign_id": call_data.campaign_id,
            "phone": call_data.phone,
            "duration": call_data.duration,
            "status": call_data.status or "unknown",
            "direction": call_data.direction,
            "recording_url": call_data.recording_url,
            "transcript": call_data.transcript,
            "external_call_id": call_data.call_id,
            "started_at": call_data.started_at or now,
            "ended_at": call_data.ended_at,
            "notes": call_data.notes,
            "outcome": call_data.outcome,
            "sentiment": call_data.sentiment,
            "user_id": call_data.user_id or contact["user_id"],
            "extracted_data": call_data.extracted_data,
            "call_status": call_data.call_status,
            "rescheduled_for": call_data.rescheduled_for,
            "objective_met": call_data.objective_met,
            "created_at": now,
            "updated_at": now
        }
        
        call_result = supabase.table("calls").insert(call_record).select().single().execute()
        
        return {
            "success": True,
            "message": "Call data received and stored successfully",
            "campaign_id": call_data.campaign_id,
            "contact": {
                "id": contact["id"],
                "name": contact["name"],
                "phone": contact["phone"]
            },
            "call_id": call_result.data["id"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

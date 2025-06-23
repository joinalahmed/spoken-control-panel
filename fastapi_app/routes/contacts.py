
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from database import get_supabase_client, authenticate_user

router = APIRouter()

class ContactCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    status: Optional[str] = "active"

class ContactResponse(BaseModel):
    success: bool
    contact: Optional[Dict[str, Any]] = None
    contacts: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None

@router.post("/create", response_model=ContactResponse)
async def create_contact(
    contact_data: ContactCreate,
    authorization: str = Header(..., alias="Authorization")
):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("contacts").insert({
            "user_id": user["id"],
            "name": contact_data.name,
            "email": contact_data.email,
            "phone": contact_data.phone,
            "address": contact_data.address,
            "city": contact_data.city,
            "state": contact_data.state,
            "zip_code": contact_data.zip_code,
            "status": contact_data.status
        }).select().single().execute()
        
        return ContactResponse(success=True, contact=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list", response_model=ContactResponse)
async def list_contacts(authorization: str = Header(..., alias="Authorization")):
    supabase = get_supabase_client()
    user = await authenticate_user(authorization, supabase)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        result = supabase.table("contacts").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
        return ContactResponse(success=True, contacts=result.data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

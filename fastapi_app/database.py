
import os
from supabase import create_client, Client
from typing import Optional, Dict, Any

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://vegryoncdzcxmornresu.supabase.co")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ3J5b25jZHpjeG1vcm5yZXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDQ2NzgsImV4cCI6MjA2NTAyMDY3OH0.5XnZzQzxL1ffFRmGrIjwe5NpAKQZloJ7yHd8w9uX1PI")

def get_supabase_client(use_service_role: bool = False) -> Client:
    """Get Supabase client with appropriate key"""
    key = SUPABASE_SERVICE_ROLE_KEY if use_service_role else SUPABASE_ANON_KEY
    return create_client(SUPABASE_URL, key)

def normalize_phone_number(phone: str) -> str:
    """Normalize phone number by removing spaces, dashes, dots, and parentheses"""
    return phone.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").replace(".", "")

async def authenticate_user(authorization: str, supabase: Client) -> Optional[Dict[str, Any]]:
    """Authenticate user via session token or API key"""
    try:
        # Try session authentication first
        user_response = supabase.auth.get_user(authorization.replace("Bearer ", ""))
        if user_response.user:
            return {"id": user_response.user.id}
    except:
        pass
    
    # Try API key authentication
    if authorization.startswith("Bearer dhwani_"):
        api_key = authorization.replace("Bearer ", "")
        user_settings = supabase.table("user_settings").select("user_id").eq("setting_key", "api_key").eq("setting_value", api_key).single().execute()
        
        if user_settings.data:
            return {"id": user_settings.data["user_id"]}
    
    return None

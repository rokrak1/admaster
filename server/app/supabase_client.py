import os
from supabase import create_client, Client

# Initialize Supabase client
def initialize_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    return supabase

# Export the initialized Supabase client
supabase = initialize_supabase()
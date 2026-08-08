import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://lxqznycdbpgvmxmfcvbj.supabase.co")
# Using service role key for backend admin operations bypassing RLS
SUPABASE_KEY = os.environ.get(
    "SUPABASE_SERVICE_ROLE_KEY", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cXpueWNkYnBndm14bWZjdmJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE4NTUwOCwiZXhwIjoyMTAxNzYxNTA4fQ.FW4mLN-V1wIDEb4Y4igewwYt2wVBUnuXiHPDzyhz0wA"
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

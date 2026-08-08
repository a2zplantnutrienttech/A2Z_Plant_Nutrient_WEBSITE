import os
import resend
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

resend.api_key = os.environ.get("RESEND_API_KEY", "")

params = {
    "from": os.environ.get("SENDER_EMAIL", "onboarding@resend.dev"),
    "to": ["a2zplantnutrient@gmail.com"],
    "subject": "Test Email",
    "html": "<strong>It works!</strong>"
}

try:
    print(f"Sending with api_key={resend.api_key[:5]}... and sender={params['from']}")
    r = resend.Emails.send(params)
    print("Success!", r)
except Exception as e:
    print("Failed:", e)

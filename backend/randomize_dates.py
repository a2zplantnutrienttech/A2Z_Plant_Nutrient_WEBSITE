"""One-off: give existing blogs realistic, spread-out random dates."""
import random
from datetime import datetime, timedelta, timezone

from database import supabase as db

START = datetime(2025, 1, 12, tzinfo=timezone.utc)
END = datetime(2026, 6, 5, tzinfo=timezone.utc)
span_seconds = int((END - START).total_seconds())

res = db.table("blogs").select("id,title").execute()
blogs = res.data or []
print(f"Found {len(blogs)} blogs")

used = set()
for b in blogs:
    # unique-ish random datetime within range
    while True:
        offset = random.randint(0, span_seconds)
        day_key = offset // 86400
        if day_key not in used:
            used.add(day_key)
            break
    dt = START + timedelta(seconds=offset)
    # random-ish business hour
    dt = dt.replace(hour=random.randint(8, 18), minute=random.randint(0, 59), second=random.randint(0, 59))
    iso = dt.isoformat()
    db.table("blogs").update({"created_at": iso, "updated_at": iso}).eq("id", b["id"]).execute()
    print(iso, "|", b["title"][:55])

print("Done.")

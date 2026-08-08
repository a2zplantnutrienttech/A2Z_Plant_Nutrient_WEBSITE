import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv("/app/backend/.env")

mongo_url = os.environ.get("MONGO_URL", "mongodb://127.0.0.1:27017")
db_name = os.environ.get("DB_NAME", "test_database")

print(f"Connecting to {mongo_url}, database: {db_name}")
client = MongoClient(mongo_url)
db = client[db_name]

# Update cover images for existing seeded blogs
updates = [
    {
        "title": "What Makes a Horticulture Tender Bid Actually Compliant",
        "cover_image": "/real-township-avenue-install.jpg"
    },
    {
        "title": "Compensatory Afforestation Done Right — Lessons from Highway Corridors",
        "cover_image": "/real-iocl-odisha-maintenance.jpg"
    },
    {
        "title": "Multi-Year AMC for PSU Townships: A Playbook",
        "cover_image": "/real-nursery-delivery.jpg"
    }
]

for item in updates:
    res = db.blogs.update_one(
        {"title": item["title"]},
        {"$set": {"cover_image": item["cover_image"]}}
    )
    print(f"Updated blog '{item['title']}': matched={res.matched_count}, modified={res.modified_count}")

print("Done updating blog images!")

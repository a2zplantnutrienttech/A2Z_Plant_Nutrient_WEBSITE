import os
import json

gallery_dir = "/app/frontend/public/gallery"
media_list = []

for i, filename in enumerate(sorted(os.listdir(gallery_dir))):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        media_list.append({
            "title": f"A2Z Project Execution {i+1}",
            "category": "Project Work",
            "media_type": "image",
            "data": f"/gallery/{filename}",
            "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."
        })

# Output as python string representing the list
print("gallery_media_list = [")
for m in media_list:
    print(f'    {{"title": "{m["title"]}", "category": "{m["category"]}", "media_type": "{m["media_type"]}", "data": "{m["data"]}", "description": "{m["description"]}"}},')
print("]")

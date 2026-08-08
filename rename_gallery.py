import os
import shutil

src_dir = "/app/frontend/public/gallery_bulk"
target_dir = "/app/frontend/public/gallery"

if os.path.exists(target_dir):
    shutil.rmtree(target_dir)
os.makedirs(target_dir, exist_ok=True)

for i, filename in enumerate(sorted(os.listdir(src_dir))):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        ext = os.path.splitext(filename)[1].lower()
        new_name = f"proj_{i+1:03d}{ext}"
        shutil.copy2(os.path.join(src_dir, filename), os.path.join(target_dir, new_name))
        
print(f"Renamed and copied images to {target_dir}")

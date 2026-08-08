import os
from PIL import Image

logo_path = "/app/frontend/public/logo.png"

# Open the image
try:
    img = Image.open(logo_path)
    # Convert to RGBA if not already
    img = img.convert("RGBA")
    
    # Create a white background image of the same size
    bg = Image.new("RGBA", img.size, "WHITE")
    
    # Paste the original image on top of the white background using the original image's alpha as mask
    bg.paste(img, (0, 0), img)
    
    # Convert to RGB (to remove alpha channel) and save as PNG or keep as PNG
    bg = bg.convert("RGB")
    bg.save(logo_path, "PNG")
    print("Logo updated with white background successfully!")
except Exception as e:
    print(f"Error updating logo: {e}")

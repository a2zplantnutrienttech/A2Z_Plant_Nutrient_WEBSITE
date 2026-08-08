from rembg import remove
from PIL import Image
import io

input_path = "/app/frontend/public/logo.png"

# First, read the original image
with open(input_path, "rb") as i:
    input_data = i.read()

print("Running rembg...")
# Remove background
output_data = remove(input_data)

# Open as PIL Image
img = Image.open(io.BytesBytesIO(output_data) if hasattr(io, 'BytesBytesIO') else io.BytesIO(output_data))

print("Adding white background...")
# Add white background
white_bg = Image.new("RGBA", img.size, "WHITE")
white_bg.paste(img, (0, 0), img)
white_bg = white_bg.convert("RGB")

white_bg.save(input_path, "PNG")
print("Logo successfully processed with white background!")

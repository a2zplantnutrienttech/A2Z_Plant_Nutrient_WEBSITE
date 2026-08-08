from PIL import Image

img = Image.open("/app/frontend/public/logo.png").convert("RGBA")
pixels = img.load()
width, height = img.size

# Check top-left corner
print("Top-left pixel:", pixels[0, 0])
# Check top-right
print("Top-right pixel:", pixels[width-1, 0])

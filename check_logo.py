from PIL import Image

img = Image.open("/app/frontend/public/logo.png")
img = img.convert("RGBA")
pixels = img.load()
print(f"Top left pixel: {pixels[0,0]}")

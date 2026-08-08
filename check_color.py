from PIL import Image

img = Image.open('/app/frontend/public/logos/nhai-logo.png')
# Check average color of opaque pixels
r, g, b = 0, 0, 0
count = 0
for pixel in img.getdata():
    if pixel[3] > 0:
        r += pixel[0]
        g += pixel[1]
        b += pixel[2]
        count += 1

print(f"nhai-logo.png avg color: rgb({r//count}, {g//count}, {b//count})")

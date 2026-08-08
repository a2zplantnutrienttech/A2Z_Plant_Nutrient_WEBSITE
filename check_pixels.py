from PIL import Image
import os

img = Image.open('/app/frontend/public/logos/nhai-logo.png')
# Count transparent pixels
transparent = 0
opaque = 0
for pixel in img.getdata():
    if pixel[3] == 0:
        transparent += 1
    else:
        opaque += 1

print(f"nhai-logo.png: transparent={transparent}, opaque={opaque}, total={img.width * img.height}")

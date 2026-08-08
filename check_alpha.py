from PIL import Image
import os

logos = ['bhel-logo.png', 'nhai-logo.png', 'ntpc-logo.png']
for logo in logos:
    path = f'/app/frontend/public/logos/{logo}'
    if os.path.exists(path):
        img = Image.open(path)
        print(f'{logo}: mode={img.mode}, size={img.size}')
        if img.mode == 'RGBA':
            # Check if background is transparent or white
            corners = [img.getpixel((0,0)), img.getpixel((img.width-1, 0)), img.getpixel((0, img.height-1)), img.getpixel((img.width-1, img.height-1))]
            print(f'Corners: {corners}')

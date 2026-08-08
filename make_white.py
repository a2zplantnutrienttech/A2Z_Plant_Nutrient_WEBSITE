from PIL import Image

def make_bg_white(image_path, tolerance=50):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    # We know the original bg was approx (201, 199, 200)
    bg_color = (201, 199, 200, 255)
    
    new_data = []
    for item in data:
        # If it's transparent, make it white
        if item[3] == 0:
            new_data.append((255, 255, 255, 255))
        elif (abs(item[0] - bg_color[0]) <= tolerance and
              abs(item[1] - bg_color[1]) <= tolerance and
              abs(item[2] - bg_color[2]) <= tolerance):
            # Change to white
            new_data.append((255, 255, 255, 255))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(image_path, "PNG")
    print("Background made white.")

make_bg_white("/app/frontend/public/logo.png")

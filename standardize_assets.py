import os
from PIL import Image

ASSETS_DIR = r"c:\Users\zulfi\OneDrive\Desktop\Project Izul\Web-Parfum\public\assets"
BACKUP_DIR = os.path.join(ASSETS_DIR, "original_backup")

TARGET_W = 800
TARGET_H = 1200
BOTTOM_MARGIN = 70 # Baseline margin in pixels for the contact shadow

files = ["noir.png", "urban.png", "water.png", "cedar.png"]

for fname in files:
    src_path = os.path.join(BACKUP_DIR, fname)
    dst_path = os.path.join(ASSETS_DIR, fname)
    
    img = Image.open(src_path).convert("RGBA")
    bbox = img.getbbox()
    if not bbox:
        continue
        
    # Crop tightly to the bottle
    cropped = img.crop(bbox)
    cw, ch = cropped.size
    
    # Target height for all bottles: around 2050px out of 2400px (leaving top margin for cap and bottom margin for shadow)
    target_bottle_h = 2050
    scale = target_bottle_h / ch
    new_w = int(cw * scale)
    new_h = target_bottle_h
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create canvas
    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    paste_x = (TARGET_W - new_w) // 2
    paste_y = TARGET_H - BOTTOM_MARGIN - new_h
    
    canvas.paste(resized, (paste_x, paste_y), resized)
    canvas.save(dst_path, "PNG", optimize=True)
    print(f"Standardized {fname}: bottle size {new_w}x{new_h} at ({paste_x}, {paste_y}) on {TARGET_W}x{TARGET_H}")

print("All 4 assets standardized with unified baseline and dimensions!")

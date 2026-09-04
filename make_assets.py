import os
from PIL import Image, ImageFilter, ImageOps, ImageEnhance, ImageDraw, ImageFont

SRC_DIR = r"C:\Users\zulfi\.gemini\antigravity-ide\brain\f75e8ea2-f158-4c68-8ff2-baceb16368a7"
DEST_DIR = r"c:\Users\zulfi\OneDrive\Desktop\Project Izul\Web-Parfum\public\assets"

os.makedirs(DEST_DIR, exist_ok=True)

noir_file = os.path.join(SRC_DIR, "noir_perfume_1788456720154.jpg")
urban_file = os.path.join(SRC_DIR, "urban_perfume_1788456734920.jpg")
water_file = os.path.join(SRC_DIR, "water_perfume_1788456752135.jpg")

def extract_bottle(img, bg_threshold=28, feather_radius=3):
    img = img.convert("RGBA")
    w, h = img.size
    
    # We will build a mask by finding pixels connected to the borders that have low brightness / match background
    # Convert to grayscale to detect dark background
    gray = img.convert("L")
    pixels = gray.load()
    
    # Simple BFS flood fill from 4 corners and borders
    mask = Image.new("L", (w, h), 255)
    mask_pixels = mask.load()
    
    visited = bytearray(w * h)
    queue = []
    
    # Seed queue with perimeter pixels
    for x in range(w):
        for y in (0, 1, 2, 3, h-4, h-3, h-2, h-1):
            if pixels[x, y] <= bg_threshold:
                idx = y * w + x
                visited[idx] = 1
                queue.append((x, y))
                mask_pixels[x, y] = 0
                
    for y in range(h):
        for x in (0, 1, 2, 3, w-4, w-3, w-2, w-1):
            idx = y * w + x
            if not visited[idx] and pixels[x, y] <= bg_threshold:
                visited[idx] = 1
                queue.append((x, y))
                mask_pixels[x, y] = 0
                
    # Flood fill
    head = 0
    while head < len(queue):
        cx, cy = queue[head]
        head += 1
        for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
            if 0 <= nx < w and 0 <= ny < h:
                nidx = ny * w + nx
                if not visited[nidx]:
                    visited[nidx] = 1
                    # If this pixel is dark (background), continue flood fill
                    val = pixels[nx, ny]
                    # also check bottom table reflection fading
                    if val <= bg_threshold or (ny > h * 0.88 and val <= bg_threshold + 15):
                        mask_pixels[nx, ny] = 0
                        queue.append((nx, ny))
                        
    # Feather mask
    if feather_radius > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(feather_radius))
        
    img.putalpha(mask)
    return img

print("Processing Noir...")
img_noir = Image.open(noir_file)
bottle_noir = extract_bottle(img_noir, bg_threshold=18, feather_radius=2)
bottle_noir.save(os.path.join(DEST_DIR, "noir.png"), "PNG")

print("Processing Urban...")
img_urban = Image.open(urban_file)
bottle_urban = extract_bottle(img_urban, bg_threshold=22, feather_radius=2)
bottle_urban.save(os.path.join(DEST_DIR, "urban.png"), "PNG")

print("Processing Water...")
img_water = Image.open(water_file)
bottle_water = extract_bottle(img_water, bg_threshold=18, feather_radius=2)
bottle_water.save(os.path.join(DEST_DIR, "water.png"), "PNG")

print("Processing Cedar...")
# Create Cedar from Urban silhouette with warm frosted alabaster / cedar essence tones
# Make it elegant light frosted glass with silver cap
img_cedar_src = Image.open(urban_file).convert("RGB")
# Convert green tones to warm neutral/cedar frosted tone
r, g, b = img_cedar_src.split()
# Create luminous silver/platinum & warm champagne hue
r_new = ImageEnhance.Brightness(r).enhance(1.4)
g_new = ImageEnhance.Brightness(g).enhance(1.1)
b_new = ImageEnhance.Brightness(b).enhance(1.3)
img_cedar_tint = Image.merge("RGB", (r_new, g_new, b_new))
# Invert lightly or adjust curve for frosted crystal
img_cedar_luminous = ImageEnhance.Contrast(img_cedar_tint).enhance(1.2)
bottle_cedar = extract_bottle(img_cedar_luminous, bg_threshold=24, feather_radius=2)

# Overlay "VIE CEDAR" text cleanly on the label area
draw = ImageDraw.Draw(bottle_cedar)
# Find center of bottle label area approx (512, 570)
# Draw subtle label box and text
w, h = bottle_cedar.size
# Let's save bottle_cedar
bottle_cedar.save(os.path.join(DEST_DIR, "cedar.png"), "PNG")

print("All 4 assets saved to public/assets successfully!")

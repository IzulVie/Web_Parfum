import os
import math
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw, ImageFont

SRC_DIR = r"C:\Users\zulfi\.gemini\antigravity-ide\brain\f75e8ea2-f158-4c68-8ff2-baceb16368a7"
DEST_DIR = r"c:\Users\zulfi\OneDrive\Desktop\Project Izul\Web-Parfum\public\assets"

os.makedirs(DEST_DIR, exist_ok=True)

noir_file = os.path.join(SRC_DIR, "noir_perfume_1788456720154.jpg")
urban_file = os.path.join(SRC_DIR, "urban_perfume_1788456734920.jpg")
water_file = os.path.join(SRC_DIR, "water_perfume_1788456752135.jpg")

def create_soft_vignette_mask(w, h, inner_r=410, outer_r=495):
    mask = Image.new("L", (w, h), 255)
    cx, cy = w / 2, h / 2
    pixels = mask.load()
    for y in range(h):
        dy = abs(y - cy)
        # Normalize dy so bottom/top rectangular bounds fade nicely
        for x in range(w):
            dx = abs(x - cx)
            dist = math.sqrt(dx * dx + dy * dy)
            if dist <= inner_r:
                pixels[x, y] = 255
            elif dist >= outer_r:
                pixels[x, y] = 0
            else:
                ratio = (dist - inner_r) / (outer_r - inner_r)
                # Smooth cosine curve
                alpha = int(255 * (0.5 + 0.5 * math.cos(ratio * math.pi)))
                pixels[x, y] = max(0, min(255, alpha))
    return mask

mask = create_soft_vignette_mask(1024, 1024, inner_r=380, outer_r=485)

# 1. Noir
img_noir = Image.open(noir_file).convert("RGBA")
img_noir.putalpha(mask)
img_noir.save(os.path.join(DEST_DIR, "noir.png"), "PNG")
print("Saved noir.png")

# 2. Urban
img_urban = Image.open(urban_file).convert("RGBA")
img_urban.putalpha(mask)
img_urban.save(os.path.join(DEST_DIR, "urban.png"), "PNG")
print("Saved urban.png")

# 3. Water
img_water = Image.open(water_file).convert("RGBA")
img_water.putalpha(mask)
img_water.save(os.path.join(DEST_DIR, "water.png"), "PNG")
print("Saved water.png")

# 4. Cedar
# Use the inverted noir which produced the stunning frosted crystal bottle
noir_raw = Image.open(noir_file)
inv = ImageOps.invert(noir_raw)
inv_graded = ImageEnhance.Brightness(inv).enhance(0.91)
inv_graded = ImageEnhance.Contrast(inv_graded).enhance(1.05)

# Clean the label center and re-stamp "VIE CEDAR"
cedar_img = inv_graded.convert("RGBA")
draw = ImageDraw.Draw(cedar_img)

# Clear the text area in the center with a gentle patch matching the frosted glass
# Label area is around x: 370..650, y: 460..640
# We can sample the nearby frosted glass color around (512, 430)
glass_col = cedar_img.getpixel((512, 440))
# Fill small patch with smooth blend
patch = Image.new("RGBA", (320, 180), (225, 228, 232, 240))
patch = patch.filter(ImageFilter.GaussianBlur(15))
cedar_img.paste(patch, (352, 460), patch)

# Draw VIE and CEDAR
# Try to load a nice font or default
try:
    font_vie = ImageFont.truetype("arial.ttf", 68)
    font_cedar = ImageFont.truetype("arial.ttf", 64)
    font_sub = ImageFont.truetype("arial.ttf", 22)
except Exception:
    font_vie = ImageFont.load_default()
    font_cedar = ImageFont.load_default()
    font_sub = ImageFont.load_default()

# Text color: dark charcoal/slate to match the frosted look
t_color = (40, 50, 65, 240)
draw.text((512, 490), "VIE", fill=t_color, font=font_vie, anchor="mm")
draw.text((512, 565), "CEDAR", fill=t_color, font=font_cedar, anchor="mm")
draw.text((512, 620), "PURE ESSENCE", fill=(80, 95, 115, 220), font=font_sub, anchor="mm")

cedar_img.putalpha(mask)
cedar_img.save(os.path.join(DEST_DIR, "cedar.png"), "PNG")
print("Saved cedar.png")

print("All assets finalized!")

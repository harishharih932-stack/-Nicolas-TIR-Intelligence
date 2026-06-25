"""
NICOLAS COLORIZATION ENGINE (ISRO ALIGNED)
Direct implementation for BAH 2026 PS10.
Based on baseline: merge_rgb -> downscale -> create_patches flow.
"""
import numpy as np
from PIL import Image

def percentile_stretch(image, low=2, high=98):
    # This matches ISRO baseline utils/visualization.py
    low_val = np.percentile(image, low)
    high_val = np.percentile(image, high)
    stretched = np.clip(image, low_val, high_val)
    stretched = (stretched - low_val) * 255.0 / (high_val - low_val + 1e-5)
    return stretched.astype(np.uint8)

def colorize(tir_200m_path, output_path):
    # 1. Load single channel B10
    img = Image.open(tir_200m_path).convert('L')
    data = np.array(img)
    
    # 2. Apply ISRO standard stretch
    stretched = percentile_stretch(data)
    
    # 3. Apply Nicolas land-cover mapping
    # (Simplified for script: Cold=Water, Mid=Veg, Hot=Urban)
    h, w = stretched.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)
    
    # Map logic: Channel order Blue, Green, Red (ISRO Request)
    rgb[..., 0] = np.clip(255 - stretched, 0, 255) # Blue high for cold
    rgb[..., 1] = np.clip(stretched * 0.8, 0, 255) # Green for mid
    rgb[..., 2] = np.clip(stretched * 0.5, 0, 255) # Red for hot
    
    # 4. Save as 100m simulation (Upscale 2x)
    final = Image.fromarray(rgb).resize((w*2, h*2), Image.LANCZOS)
    final.save(output_path)
    print(f"Exported to {output_path} (Blue-Green-Red order)")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        colorize(sys.argv[1], sys.argv[2])

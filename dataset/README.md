# GLIMMR - Jewellery Dataset Documentation

## Overview
This dataset contains curated jewellery items for the AR Try-On system,
outfit pairing rules, and AR configuration metadata.

## Dataset Files

### `seed.js`
MongoDB seed script containing:
- **28 jewellery items** across 7 categories
- **10 outfit types** for recommendation pairing
- AR placement configs for each item

### `jewellery_catalog.csv` (reference)
All items in CSV format for ML training.

### `outfit_rules.json` (reference)
Rule-based recommendation mappings.

## Jewellery Categories & Count

| Category   | Count | AR Anchor          |
|------------|-------|--------------------|
| earring    | 6     | left_ear           |
| necklace   | 5     | neck_center        |
| ring       | 5     | ring_finger_right  |
| bracelet   | 3     | left_wrist         |
| bangle     | 2     | left_wrist         |
| nose-ring  | 2     | left_nostril       |
| pendant    | 2     | neck_center        |

## Materials Used

| Material   | Use Case                        |
|------------|----------------------------------|
| gold       | Traditional, bridal              |
| silver     | Casual, contemporary             |
| diamond    | Luxury, gifting                  |
| rose-gold  | Romantic, contemporary           |
| white-gold | Modern, minimalist               |
| platinum   | Premium, minimalist              |
| pearl      | Traditional, elegant             |

## AR Configuration Schema

Each jewellery item has an `arConfig` object:

```json
{
  "scale": 0.8,        // Model scale relative to face/hand
  "offsetX": 0,        // X offset in 3D space
  "offsetY": -0.02,    // Y offset (negative = down)
  "offsetZ": 0,        // Z offset (depth)
  "rotationX": 0,      // Rotation in degrees
  "rotationY": 0,
  "rotationZ": 0,
  "anchorLandmark": "left_ear"  // MediaPipe landmark anchor
}
```

## MediaPipe Landmark Anchors

| Anchor               | MediaPipe Index | Usage            |
|----------------------|-----------------|------------------|
| left_ear             | 234             | Left earrings    |
| right_ear            | 454             | Right earrings   |
| left_nostril         | 49              | Nose rings       |
| right_nostril        | 279             | Nose rings (R)   |
| neck_center          | 152 (chin base) | Necklaces        |
| ring_finger_right    | Hand landmark 14| Rings            |
| left_wrist           | Hand landmark 0 | Bracelets        |

## Outfit Recommendation Rules

Jewellery `style` → recommended outfit types:

```
traditional → saree, lehenga, salwar-kameez, anarkali
bridal      → bridal-lehenga, bridal-saree, wedding-gown
contemporary→ western-dress, kurti, indo-western
casual      → jeans-top, casual-dress, co-ord-set
minimalist  → formal-wear, business-casual
fusion      → indo-western, ethnic-top-jeans
```

## Color Harmony Rules

Jewellery `material` → complementary outfit colors:

```
gold        → red, maroon, green, royal-blue, mustard
silver      → blue, black, grey, white, purple, teal
rose-gold   → pink, peach, nude, lavender, blush
diamond     → black, white, navy, grey (all colors)
pearl       → pastel, white, cream, soft-pink
```

## Running the Seed Script

```bash
# From project root
cd dataset
node seed.js

# Or with custom MongoDB URI
MONGO_URI=mongodb://your-host:27017/db node seed.js
```

## ML Training Notes

The recommendation engine uses **Content-Based Filtering**:
- Feature vectors: [category, material, style, colorTone, occasion[]]
- Similarity: Weighted Euclidean distance on encoded features
- Training data: jewelleryData array + outfit pairing rules

For advanced ML, export to CSV and use Python/Scikit-learn:
```python
import pandas as pd
from sklearn.neighbors import NearestNeighbors

df = pd.read_csv('jewellery_catalog.csv')
# Encode categorical features and train kNN model
```

# GLIMMR — 3D Jewellery Model Library

## Overview
This directory contains **28 procedurally generated GLB (Binary glTF 2.0)** 
3D model files for the AR try-on system.

## File Structure
```
models/
├── earrings/        (7 models)
│   ├── kundan_jhumka.glb      — Torus geometry, gold PBR material
│   ├── diamond_stud.glb       — Sphere geometry, diamond PBR material
│   ├── silver_hoop.glb        — Torus geometry, silver PBR material
│   ├── rose_gold_drop.glb     — Teardrop geometry, rose-gold PBR material
│   ├── pearl_chandbali.glb    — Teardrop geometry, pearl PBR material
│   ├── emerald_polki.glb      — Torus geometry, gold+emerald PBR material
│   └── oxidized_jhumka.glb    — Torus geometry, oxidized silver PBR material
│
├── necklaces/       (7 models)
│   ├── diamond_pendant.glb    — Bicone pendant, diamond PBR material
│   ├── temple_necklace.glb    — Torus geometry, gold PBR material
│   ├── boho_layered.glb       — Torus-knot, silver PBR material
│   ├── kundan_choker.glb      — Torus geometry, gold PBR material
│   ├── rose_heart.glb         — Bicone pendant, rose-gold PBR material
│   ├── jadau_set.glb          — Torus geometry, gold PBR material
│   └── gold_bar.glb           — Bicone, gold PBR material
│
├── rings/           (5 models)
│   ├── solitaire_engagement.glb — Ring geometry, diamond PBR material
│   ├── maharani_ring.glb        — Ring geometry, gold PBR material
│   ├── stackable_bands.glb      — Ring geometry, rose-gold PBR material
│   ├── sapphire_halo.glb        — Ring geometry, sapphire-blue PBR material
│   └── silver_toe.glb           — Ring geometry, silver PBR material
│
├── bracelets/       (3 models)
│   ├── diamond_tennis.glb     — Bracelet torus, diamond PBR material
│   ├── gold_kada.glb          — Bracelet torus, gold PBR material
│   └── silver_charm.glb       — Bracelet torus, silver PBR material
│
├── bangles/         (2 models)
│   ├── lac_bangles.glb        — Bangle torus, gold PBR material
│   └── glass_bangles.glb      — Bangle torus, red glass PBR material
│
├── nosering/        (2 models)
│   ├── diamond_pin.glb        — Small torus, diamond PBR material
│   └── gold_nath.glb          — Torus, gold PBR material
│
└── pendants/        (2 models)
    ├── om_pendant.glb         — Bicone pendant, gold PBR material
    └── butterfly_pendant.glb  — Bicone pendant, silver PBR material
```

## GLB Format Details
- **Format**: Binary glTF 2.0 (`.glb`)
- **Geometry**: Procedurally generated using Python/struct
- **Materials**: Physically Based Rendering (PBR) — metallicRoughness model
- **Normals**: Per-vertex smooth normals included
- **Compatible with**: Three.js (r128+), Babylon.js, A-Frame, model-viewer

## PBR Material Properties by Metal

| Material   | Base Color | Metalness | Roughness |
|------------|------------|-----------|-----------|
| Gold       | #C9A84C    | 0.90      | 0.10      |
| Silver     | #B0B8C1    | 0.95      | 0.05      |
| Diamond    | #A8D8F0    | 0.00      | 0.00      |
| Rose Gold  | #D4856A    | 0.85      | 0.15      |
| White Gold | #D0D8E0    | 0.92      | 0.08      |
| Platinum   | #C0C8D0    | 0.98      | 0.02      |
| Pearl      | #F0ECE4    | 0.10      | 0.40      |

## Loading in Three.js
```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/models/earrings/kundan_jhumka.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

## Loading via ThreeViewer Component (GLIMMR)
```jsx
import ThreeViewer from './components/ThreeViewer';

<ThreeViewer jewellery={jewelleryItem} width="100%" height={350} />
```

## Replacing with Real Models
To use professional 3D jewellery models:
1. Export your models as `.glb` from Blender/Sketchfab
2. Name them to match the existing filenames OR update `model3dUrl` in the DB
3. Ensure models are optimized (<2MB each) for web performance
4. Recommended tools: Blender (free), Sketchfab, Venture Lab

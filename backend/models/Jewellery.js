const mongoose = require('mongoose');

const jewellerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Jewellery name is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['earring', 'necklace', 'ring', 'bracelet', 'nose-ring', 'bangle', 'pendant']
  },
  subcategory: {
    type: String, // e.g., 'stud', 'hoop', 'drop' for earrings
    default: null
  },
  material: {
    type: String,
    enum: ['gold', 'silver', 'platinum', 'rose-gold', 'white-gold', 'diamond', 'gemstone', 'pearl'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  description: String,
  images: [String],          // product image URLs
  model3dUrl: String,        // path to .glb / .gltf 3D model
  thumbnailUrl: String,

  // AR placement metadata
  arConfig: {
    scale: { type: Number, default: 1.0 },
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
    offsetZ: { type: Number, default: 0 },
    rotationX: { type: Number, default: 0 },
    rotationY: { type: Number, default: 0 },
    rotationZ: { type: Number, default: 0 },
    anchorLandmark: { type: String, default: null } // e.g., 'left_ear', 'right_ear'
  },

  // Styling metadata for recommendations
  style: {
    type: String,
    enum: ['traditional', 'contemporary', 'bridal', 'casual', 'fusion', 'minimalist'],
    default: 'contemporary'
  },
  occasion: [String],    // ['wedding', 'party', 'casual', 'office']
  colorTone: String,     // 'warm', 'cool', 'neutral'
  gemstones: [String],   // ['diamond', 'ruby', 'emerald']

  brand: { type: String, default: 'GLIMMR' },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  tags: [String]
}, { timestamps: true });

jewellerySchema.index({ category: 1, material: 1, style: 1 });
jewellerySchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Jewellery', jewellerySchema);

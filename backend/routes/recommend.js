const express = require('express');
const router = express.Router();
const Jewellery = require('../models/Jewellery');

/**
 * Content-Based Recommendation Engine
 * Suggests complementary jewellery and outfit types
 * based on selected jewellery features.
 */

// Outfit pairing rules (rule-based AI)
const OUTFIT_RULES = {
  earring: {
    traditional: ['saree', 'lehenga', 'salwar-kameez', 'anarkali'],
    bridal: ['bridal-lehenga', 'bridal-saree', 'wedding-gown'],
    contemporary: ['western-dress', 'kurti', 'indo-western'],
    casual: ['jeans-top', 'casual-dress', 'co-ord-set'],
    minimalist: ['formal-wear', 'business-casual', 'monochrome-outfit'],
    fusion: ['fusion-wear', 'indo-western', 'ethnic-top-jeans']
  },
  necklace: {
    traditional: ['deep-neck-blouse', 'saree', 'lehenga-blouse'],
    bridal: ['bridal-blouse', 'off-shoulder-gown'],
    contemporary: ['boat-neck-dress', 'v-neck-top'],
    casual: ['round-neck-tee', 'casual-blouse'],
    minimalist: ['collared-shirt', 'turtleneck'],
    fusion: ['off-shoulder-kurti', 'crop-top']
  },
  ring: {
    traditional: ['all-traditional-outfits'],
    bridal: ['bridal-all'],
    contemporary: ['all-western'],
    casual: ['casual-all'],
    minimalist: ['minimal-outfits'],
    fusion: ['all-fusion']
  },
  bracelet: {
    traditional: ['blouse-saree', 'sleeveless-kurti'],
    bridal: ['sleeveless-gown', 'bridal-wear'],
    contemporary: ['sleeveless-dress', 'off-shoulder'],
    casual: ['tank-top', 'short-sleeves'],
    minimalist: ['cuffed-shirts', 'rolled-sleeves'],
    fusion: ['off-shoulder-kurti']
  }
};

const COLOR_RECOMMENDATIONS = {
  gold: ['red', 'maroon', 'green', 'royal-blue', 'off-white', 'mustard'],
  silver: ['blue', 'black', 'grey', 'white', 'purple', 'teal'],
  'rose-gold': ['pink', 'peach', 'nude', 'lavender', 'blush'],
  diamond: ['black', 'white', 'navy', 'grey', 'all-colors'],
  platinum: ['black', 'white', 'silver-grey', 'midnight-blue'],
  pearl: ['pastel', 'white', 'cream', 'soft-pink', 'powder-blue']
};

// @POST /api/recommend/jewellery  - recommend similar jewellery
router.post('/jewellery', async (req, res) => {
  try {
    const { jewelleryId, limit = 6 } = req.body;

    const source = await Jewellery.findById(jewelleryId);
    if (!source) return res.status(404).json({ success: false, message: 'Jewellery not found' });

    // Score-based content filtering
    const candidates = await Jewellery.find({
      _id: { $ne: jewelleryId },
      inStock: true
    });

    const scored = candidates.map(item => {
      let score = 0;
      if (item.category === source.category) score += 3;
      if (item.material === source.material) score += 2;
      if (item.style === source.style) score += 2;
      if (item.colorTone === source.colorTone) score += 1;
      // occasion overlap
      const overlap = item.occasion.filter(o => source.occasion.includes(o));
      score += overlap.length;
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, Number(limit)).map(s => s.item);

    res.json({ success: true, data: recommendations, basedOn: source.name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/recommend/outfit  - recommend outfit types for selected jewellery
router.post('/outfit', async (req, res) => {
  try {
    const { jewelleryId } = req.body;

    const item = await Jewellery.findById(jewelleryId);
    if (!item) return res.status(404).json({ success: false, message: 'Jewellery not found' });

    const category = item.category.replace('-', '');
    const styleRules = OUTFIT_RULES[item.category] || OUTFIT_RULES['earring'];
    const outfitSuggestions = styleRules[item.style] || styleRules['contemporary'];
    const colorSuggestions = COLOR_RECOMMENDATIONS[item.material] || ['all-colors'];

    const response = {
      jewellery: item.name,
      category: item.category,
      style: item.style,
      material: item.material,
      outfitSuggestions,
      colorSuggestions,
      stylingTips: generateStylingTips(item),
      occasions: item.occasion
    };

    res.json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/recommend/image-search  - find jewellery by image feature tags
router.post('/image-search', async (req, res) => {
  try {
    const { tags = [], style, material, category } = req.body;
    const query = { inStock: true };
    if (style) query.style = style;
    if (material) query.material = material;
    if (category) query.category = category;
    if (tags.length > 0) query.tags = { $in: tags };

    const results = await Jewellery.find(query).limit(10);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

function generateStylingTips(item) {
  const tips = [];
  if (item.material === 'gold')
    tips.push('Gold jewellery pairs beautifully with warm, rich colors like red, maroon, and deep green.');
  if (item.material === 'silver')
    tips.push('Silver jewellery complements cool tones — blues, greys, and crisp whites look stunning.');
  if (item.category === 'necklace')
    tips.push('For necklaces, choose necklines that frame the piece — V-necks for pendants, boat-necks for chokers.');
  if (item.category === 'earring')
    tips.push('Your hairstyle matters! Updos showcase chandelier earrings; studs work with any hairstyle.');
  if (item.style === 'bridal')
    tips.push('Bridal jewellery sets look best when coordinated — match metals and stones across pieces.');
  if (item.style === 'minimalist')
    tips.push('Stack minimalist pieces for impact, or wear alone for understated elegance.');
  if (tips.length === 0)
    tips.push('This versatile piece works across multiple occasions and outfit styles.');
  return tips;
}

module.exports = router;

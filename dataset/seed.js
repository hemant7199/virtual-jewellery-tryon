/**
 * JEWELLERY DATASET SEED SCRIPT
 * ==============================
 * Run from dataset/ folder:
 *   node seed.js
 * Or from project root:
 *   node dataset/seed.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jewellery_tryon';

/* ── Jewellery Schema (inline so seed.js is self-contained) ───────── */
const jewellerySchema = new mongoose.Schema({
  name: String, category: String, subcategory: String,
  material: String, price: Number, currency: { type: String, default: 'INR' },
  description: String, images: [String], model3dUrl: String, thumbnailUrl: String,
  arConfig: {
    scale: Number, offsetX: Number, offsetY: Number, offsetZ: Number,
    rotationX: Number, rotationY: Number, rotationZ: Number, anchorLandmark: String
  },
  style: String, occasion: [String], colorTone: String, gemstones: [String],
  brand: { type: String, default: 'GLIMMR' },
  inStock: { type: Boolean, default: true },
  rating: Number, reviewCount: Number, tags: [String]
}, { timestamps: true });

const Jewellery = mongoose.models.Jewellery || mongoose.model('Jewellery', jewellerySchema);

/* ── Dataset ──────────────────────────────────────────────────────── */
const jewelleryData = [
  // ── EARRINGS
  {
    name: 'Royal Kundan Jhumka', category: 'earring', subcategory: 'jhumka',
    material: 'gold', price: 18500, currency: 'INR',
    description: 'Traditional kundan jhumka earrings with intricate meenakari work. Perfect for weddings and festive occasions.',
    images: ['/images/earrings/kundan_jhumka.jpg'],
    model3dUrl: '/models/earrings/kundan_jhumka.glb',
    arConfig: { scale: 0.8, offsetX: 0, offsetY: -0.02, offsetZ: 0, anchorLandmark: 'left_ear' },
    style: 'bridal', occasion: ['wedding', 'festival', 'engagement'],
    colorTone: 'warm', gemstones: ['kundan', 'ruby', 'emerald'],
    rating: 4.8, reviewCount: 245, tags: ['traditional', 'jhumka', 'bridal', 'festive']
  },
  {
    name: 'Diamond Solitaire Studs', category: 'earring', subcategory: 'stud',
    material: 'diamond', price: 45000, currency: 'INR',
    description: 'Certified diamond stud earrings in 18K white gold. 0.5 carat total weight with excellent cut.',
    images: ['/images/earrings/diamond_stud.jpg'],
    model3dUrl: '/models/earrings/diamond_stud.glb',
    arConfig: { scale: 0.4, offsetX: 0, offsetY: -0.01, offsetZ: 0, anchorLandmark: 'left_ear' },
    style: 'minimalist', occasion: ['daily', 'office', 'party', 'wedding'],
    colorTone: 'cool', gemstones: ['diamond'],
    rating: 4.9, reviewCount: 189, tags: ['diamond', 'stud', 'minimalist', 'gifting']
  },
  {
    name: 'Silver Oxidized Hoop', category: 'earring', subcategory: 'hoop',
    material: 'silver', price: 1299, currency: 'INR',
    description: 'Oxidized silver hoop earrings with tribal pattern. Lightweight and perfect for everyday wear.',
    images: ['/images/earrings/silver_hoop.jpg'],
    model3dUrl: '/models/earrings/silver_hoop.glb',
    arConfig: { scale: 0.9, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'left_ear' },
    style: 'contemporary', occasion: ['daily', 'casual', 'college'],
    colorTone: 'cool', gemstones: [],
    rating: 4.3, reviewCount: 562, tags: ['silver', 'hoop', 'oxidized', 'casual']
  },
  {
    name: 'Rose Gold Floral Drops', category: 'earring', subcategory: 'drop',
    material: 'rose-gold', price: 8900, currency: 'INR',
    description: 'Elegant rose gold drop earrings with floral design and pink tourmaline accents.',
    images: ['/images/earrings/rose_gold_drop.jpg'],
    model3dUrl: '/models/earrings/rose_gold_drop.glb',
    arConfig: { scale: 0.7, offsetX: 0, offsetY: -0.015, offsetZ: 0, anchorLandmark: 'left_ear' },
    style: 'contemporary', occasion: ['party', 'date', 'casual'],
    colorTone: 'warm', gemstones: ['tourmaline'],
    rating: 4.6, reviewCount: 98, tags: ['rose-gold', 'floral', 'romantic']
  },
  {
    name: 'Pearl Chandbali Earrings', category: 'earring', subcategory: 'chandbali',
    material: 'gold', price: 12000, currency: 'INR',
    description: 'Classic chandbali earrings with freshwater pearl drops. Timeless Indian design.',
    images: ['/images/earrings/pearl_chandbali.jpg'],
    model3dUrl: '/models/earrings/pearl_chandbali.glb',
    arConfig: { scale: 0.85, offsetX: 0, offsetY: -0.02, offsetZ: 0, anchorLandmark: 'left_ear' },
    style: 'traditional', occasion: ['wedding', 'festival', 'puja'],
    colorTone: 'warm', gemstones: ['pearl'],
    rating: 4.7, reviewCount: 134, tags: ['pearl', 'chandbali', 'traditional']
  },
  {
    name: 'Emerald Polki Earrings', category: 'earring', subcategory: 'polki',
    material: 'gold', price: 35000, currency: 'INR',
    description: 'Uncut diamond polki earrings with natural emeralds. Royal Rajasthani craftsmanship.',
    images: ['/images/earrings/emerald_polki.jpg'],
    model3dUrl: '/models/earrings/emerald_polki.glb',
    arConfig: { scale: 0.9, offsetX: 0, offsetY: -0.025, offsetZ: 0, anchorLandmark: 'left_ear' },
    style: 'bridal', occasion: ['wedding', 'sangeet', 'engagement'],
    colorTone: 'warm', gemstones: ['diamond', 'emerald'],
    rating: 4.9, reviewCount: 67, tags: ['polki', 'emerald', 'bridal', 'luxury']
  },
  {
    name: 'Oxidized Silver Jhumka', category: 'earring', subcategory: 'jhumka',
    material: 'silver', price: 2200, currency: 'INR',
    description: 'Oxidized silver jhumka with tribal motifs. Perfect fusion of traditional and boho styles.',
    images: ['/images/earrings/oxidized_jhumka.jpg'],
    model3dUrl: '/models/earrings/oxidized_jhumka.glb',
    arConfig: { scale: 0.75, offsetX: 0, offsetY: -0.02, offsetZ: 0, anchorLandmark: 'left_ear' },
    style: 'fusion', occasion: ['casual', 'festival', 'college'],
    colorTone: 'cool', gemstones: [],
    rating: 4.5, reviewCount: 312, tags: ['oxidized', 'jhumka', 'fusion', 'boho']
  },
  // ── NECKLACES
  {
    name: 'Classic Diamond Pendant', category: 'necklace', subcategory: 'pendant',
    material: 'diamond', price: 55000, currency: 'INR',
    description: 'Solitaire diamond pendant in 18K white gold on a delicate chain. 0.75 carat center stone.',
    images: ['/images/necklaces/diamond_pendant.jpg'],
    model3dUrl: '/models/necklaces/diamond_pendant.glb',
    arConfig: { scale: 0.6, offsetX: 0, offsetY: 0.05, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'minimalist', occasion: ['party', 'date', 'office', 'wedding'],
    colorTone: 'cool', gemstones: ['diamond'],
    rating: 4.9, reviewCount: 312, tags: ['diamond', 'pendant', 'solitaire', 'gifting']
  },
  {
    name: 'Temple Jewellery Long Necklace', category: 'necklace', subcategory: 'long-necklace',
    material: 'gold', price: 65000, currency: 'INR',
    description: 'Traditional South Indian temple jewellery necklace with Lakshmi coin motifs in 22K gold.',
    images: ['/images/necklaces/temple_necklace.jpg'],
    model3dUrl: '/models/necklaces/temple_necklace.glb',
    arConfig: { scale: 1.0, offsetX: 0, offsetY: 0.08, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'traditional', occasion: ['wedding', 'temple', 'festival'],
    colorTone: 'warm', gemstones: ['ruby', 'emerald'],
    rating: 4.8, reviewCount: 89, tags: ['temple', 'gold', 'traditional', 'south-indian']
  },
  {
    name: 'Layered Boho Necklace', category: 'necklace', subcategory: 'layered',
    material: 'silver', price: 2499, currency: 'INR',
    description: 'Multi-layer bohemian silver necklace with moon and star charms.',
    images: ['/images/necklaces/boho_layered.jpg'],
    model3dUrl: '/models/necklaces/boho_layered.glb',
    arConfig: { scale: 0.9, offsetX: 0, offsetY: 0.06, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'contemporary', occasion: ['casual', 'college', 'vacation'],
    colorTone: 'cool', gemstones: [],
    rating: 4.4, reviewCount: 445, tags: ['silver', 'layered', 'boho', 'casual']
  },
  {
    name: 'Kundan Meenakari Choker', category: 'necklace', subcategory: 'choker',
    material: 'gold', price: 28000, currency: 'INR',
    description: 'Vibrant meenakari choker with kundan setting and enamel peacock motif.',
    images: ['/images/necklaces/kundan_choker.jpg'],
    model3dUrl: '/models/necklaces/kundan_choker.glb',
    arConfig: { scale: 0.95, offsetX: 0, offsetY: 0.03, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'bridal', occasion: ['wedding', 'engagement', 'sangeet'],
    colorTone: 'warm', gemstones: ['kundan', 'ruby', 'emerald'],
    rating: 4.7, reviewCount: 156, tags: ['kundan', 'choker', 'meenakari', 'bridal']
  },
  {
    name: 'Rose Gold Heart Necklace', category: 'necklace', subcategory: 'pendant',
    material: 'rose-gold', price: 9500, currency: 'INR',
    description: 'Delicate rose gold heart pendant with ruby accent. Perfect gifting option.',
    images: ['/images/necklaces/rose_heart.jpg'],
    model3dUrl: '/models/necklaces/rose_heart.glb',
    arConfig: { scale: 0.5, offsetX: 0, offsetY: 0.04, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'contemporary', occasion: ['valentine', 'anniversary', 'gifting', 'daily'],
    colorTone: 'warm', gemstones: ['ruby'],
    rating: 4.6, reviewCount: 278, tags: ['heart', 'rose-gold', 'gifting', 'romantic']
  },
  {
    name: 'Jadau Bridal Necklace Set', category: 'necklace', subcategory: 'set',
    material: 'gold', price: 185000, currency: 'INR',
    description: 'Exquisite jadau bridal necklace set with kundan, rubies, emeralds and pearls.',
    images: ['/images/necklaces/jadau_set.jpg'],
    model3dUrl: '/models/necklaces/jadau_set.glb',
    arConfig: { scale: 1.0, offsetX: 0, offsetY: 0.07, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'bridal', occasion: ['wedding', 'engagement'],
    colorTone: 'warm', gemstones: ['kundan', 'ruby', 'emerald', 'pearl'],
    rating: 4.9, reviewCount: 34, tags: ['jadau', 'bridal', 'set', 'luxury', 'royal']
  },
  {
    name: 'Minimalist Gold Bar Necklace', category: 'necklace', subcategory: 'bar',
    material: 'gold', price: 4500, currency: 'INR',
    description: 'Sleek 18K gold bar necklace for everyday minimalist elegance.',
    images: ['/images/necklaces/gold_bar.jpg'],
    model3dUrl: '/models/necklaces/gold_bar.glb',
    arConfig: { scale: 0.4, offsetX: 0, offsetY: 0.03, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'minimalist', occasion: ['daily', 'office', 'casual'],
    colorTone: 'warm', gemstones: [],
    rating: 4.6, reviewCount: 198, tags: ['bar', 'gold', 'minimalist', 'everyday']
  },
  // ── RINGS
  {
    name: 'Solitaire Engagement Ring', category: 'ring', subcategory: 'solitaire',
    material: 'diamond', price: 120000, currency: 'INR',
    description: 'Classic 4-prong solitaire engagement ring. 1 carat F/VS1 certified diamond in 18K white gold.',
    images: ['/images/rings/solitaire_engagement.jpg'],
    model3dUrl: '/models/rings/solitaire_engagement.glb',
    arConfig: { scale: 0.5, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'ring_finger_right' },
    style: 'minimalist', occasion: ['engagement', 'wedding', 'anniversary'],
    colorTone: 'cool', gemstones: ['diamond'],
    rating: 5.0, reviewCount: 87, tags: ['diamond', 'solitaire', 'engagement', 'luxury']
  },
  {
    name: 'Gold Maharani Ring', category: 'ring', subcategory: 'cocktail',
    material: 'gold', price: 22000, currency: 'INR',
    description: 'Bold cocktail ring with floral design featuring rubies and emeralds in 22K gold.',
    images: ['/images/rings/maharani_ring.jpg'],
    model3dUrl: '/models/rings/maharani_ring.glb',
    arConfig: { scale: 0.55, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'ring_finger_right' },
    style: 'traditional', occasion: ['wedding', 'festival', 'party'],
    colorTone: 'warm', gemstones: ['ruby', 'emerald'],
    rating: 4.7, reviewCount: 143, tags: ['gold', 'cocktail', 'traditional', 'statement']
  },
  {
    name: 'Stackable Bands Set', category: 'ring', subcategory: 'band',
    material: 'rose-gold', price: 15000, currency: 'INR',
    description: 'Set of 3 stackable rose gold bands with diamond accents.',
    images: ['/images/rings/stackable_bands.jpg'],
    model3dUrl: '/models/rings/stackable_bands.glb',
    arConfig: { scale: 0.48, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'ring_finger_right' },
    style: 'contemporary', occasion: ['daily', 'casual', 'party'],
    colorTone: 'warm', gemstones: ['diamond'],
    rating: 4.8, reviewCount: 267, tags: ['stackable', 'rose-gold', 'bands', 'trendy']
  },
  {
    name: 'Sapphire Halo Ring', category: 'ring', subcategory: 'halo',
    material: 'white-gold', price: 75000, currency: 'INR',
    description: 'Stunning blue sapphire center stone surrounded by a halo of brilliant diamonds.',
    images: ['/images/rings/sapphire_halo.jpg'],
    model3dUrl: '/models/rings/sapphire_halo.glb',
    arConfig: { scale: 0.52, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'ring_finger_right' },
    style: 'contemporary', occasion: ['engagement', 'anniversary', 'gifting'],
    colorTone: 'cool', gemstones: ['sapphire', 'diamond'],
    rating: 4.9, reviewCount: 52, tags: ['sapphire', 'halo', 'white-gold', 'royal']
  },
  {
    name: 'Silver Toe Ring Set', category: 'ring', subcategory: 'toe-ring',
    material: 'silver', price: 699, currency: 'INR',
    description: 'Traditional silver toe rings (bicchiya) with floral design. Set of 2.',
    images: ['/images/rings/silver_toe.jpg'],
    model3dUrl: '/models/rings/silver_toe.glb',
    arConfig: { scale: 0.3, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'ring_finger_right' },
    style: 'traditional', occasion: ['wedding', 'daily', 'traditional'],
    colorTone: 'cool', gemstones: [],
    rating: 4.5, reviewCount: 789, tags: ['silver', 'toe-ring', 'traditional', 'wedding']
  },
  // ── BRACELETS
  {
    name: 'Diamond Tennis Bracelet', category: 'bracelet', subcategory: 'tennis',
    material: 'diamond', price: 95000, currency: 'INR',
    description: 'Exquisite tennis bracelet with 3 carats of round brilliant diamonds in 18K white gold.',
    images: ['/images/bracelets/diamond_tennis.jpg'],
    model3dUrl: '/models/bracelets/diamond_tennis.glb',
    arConfig: { scale: 0.7, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'left_wrist' },
    style: 'minimalist', occasion: ['wedding', 'party', 'anniversary', 'gifting'],
    colorTone: 'cool', gemstones: ['diamond'],
    rating: 4.9, reviewCount: 45, tags: ['diamond', 'tennis', 'luxury', 'gifting']
  },
  {
    name: 'Gold Kada Bracelet', category: 'bracelet', subcategory: 'kada',
    material: 'gold', price: 42000, currency: 'INR',
    description: 'Traditional 22K gold kada with engraved floral patterns. A timeless heirloom piece.',
    images: ['/images/bracelets/gold_kada.jpg'],
    model3dUrl: '/models/bracelets/gold_kada.glb',
    arConfig: { scale: 0.8, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'left_wrist' },
    style: 'traditional', occasion: ['wedding', 'festival', 'puja', 'daily'],
    colorTone: 'warm', gemstones: [],
    rating: 4.7, reviewCount: 198, tags: ['kada', 'gold', 'traditional', 'heirloom']
  },
  {
    name: 'Silver Charm Bracelet', category: 'bracelet', subcategory: 'charm',
    material: 'silver', price: 3500, currency: 'INR',
    description: 'Sterling silver charm bracelet with 8 unique charms including elephant, lotus, and star.',
    images: ['/images/bracelets/silver_charm.jpg'],
    model3dUrl: '/models/bracelets/silver_charm.glb',
    arConfig: { scale: 0.65, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'left_wrist' },
    style: 'contemporary', occasion: ['casual', 'gifting', 'birthday'],
    colorTone: 'cool', gemstones: [],
    rating: 4.5, reviewCount: 367, tags: ['charm', 'silver', 'gifting', 'casual']
  },
  // ── BANGLES
  {
    name: 'Lac Bangles Set', category: 'bangle', subcategory: 'lac',
    material: 'gold', price: 5500, currency: 'INR',
    description: 'Traditional lac bangles with gold work and mirror detailing. Set of 12 for wedding.',
    images: ['/images/bangles/lac_bangles.jpg'],
    model3dUrl: '/models/bangles/lac_bangles.glb',
    arConfig: { scale: 0.85, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'left_wrist' },
    style: 'bridal', occasion: ['wedding', 'sangeet', 'festival'],
    colorTone: 'warm', gemstones: [],
    rating: 4.6, reviewCount: 234, tags: ['lac', 'bangles', 'bridal', 'traditional']
  },
  {
    name: 'Glass Bangle Set - Red Green', category: 'bangle', subcategory: 'glass',
    material: 'gold', price: 899, currency: 'INR',
    description: 'Colorful glass bangles in bridal red and green. Set of 24 with gold foil detailing.',
    images: ['/images/bangles/glass_bangles.jpg'],
    model3dUrl: '/models/bangles/glass_bangles.glb',
    arConfig: { scale: 0.9, offsetX: 0, offsetY: 0, offsetZ: 0, anchorLandmark: 'left_wrist' },
    style: 'traditional', occasion: ['wedding', 'festival', 'teej'],
    colorTone: 'warm', gemstones: [],
    rating: 4.4, reviewCount: 1245, tags: ['glass', 'bangles', 'colorful', 'festival', 'budget']
  },
  // ── NOSE RINGS
  {
    name: 'Diamond Nose Pin', category: 'nose-ring', subcategory: 'pin',
    material: 'diamond', price: 8500, currency: 'INR',
    description: 'Tiny brilliant diamond nose pin in 18K gold. Barely-there design for everyday elegance.',
    images: ['/images/nosering/diamond_pin.jpg'],
    model3dUrl: '/models/nosering/diamond_pin.glb',
    arConfig: { scale: 0.2, offsetX: -0.015, offsetY: -0.005, offsetZ: 0, anchorLandmark: 'left_nostril' },
    style: 'minimalist', occasion: ['daily', 'office', 'casual'],
    colorTone: 'cool', gemstones: ['diamond'],
    rating: 4.8, reviewCount: 489, tags: ['diamond', 'nose-pin', 'minimalist', 'everyday']
  },
  {
    name: 'Gold Nath Nose Ring', category: 'nose-ring', subcategory: 'nath',
    material: 'gold', price: 15000, currency: 'INR',
    description: 'Bridal nath with pearl drops and kundan work. Traditional Marathi bridal nose ring.',
    images: ['/images/nosering/gold_nath.jpg'],
    model3dUrl: '/models/nosering/gold_nath.glb',
    arConfig: { scale: 0.9, offsetX: -0.02, offsetY: 0, offsetZ: 0, anchorLandmark: 'left_nostril' },
    style: 'bridal', occasion: ['wedding'],
    colorTone: 'warm', gemstones: ['pearl', 'kundan'],
    rating: 4.7, reviewCount: 78, tags: ['nath', 'bridal', 'marathi', 'wedding']
  },
  // ── PENDANTS
  {
    name: 'Om Gold Pendant', category: 'pendant', subcategory: 'religious',
    material: 'gold', price: 6500, currency: 'INR',
    description: 'Sacred Om symbol pendant in 22K gold with diamond accents.',
    images: ['/images/pendants/om_pendant.jpg'],
    model3dUrl: '/models/pendants/om_pendant.glb',
    arConfig: { scale: 0.5, offsetX: 0, offsetY: 0.05, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'fusion', occasion: ['daily', 'religious', 'gifting'],
    colorTone: 'warm', gemstones: ['diamond'],
    rating: 4.8, reviewCount: 567, tags: ['om', 'gold', 'religious', 'spiritual']
  },
  {
    name: 'Butterfly Silver Pendant', category: 'pendant', subcategory: 'fashion',
    material: 'silver', price: 1899, currency: 'INR',
    description: 'Dainty butterfly pendant in sterling silver with rainbow sapphire accents.',
    images: ['/images/pendants/butterfly_pendant.jpg'],
    model3dUrl: '/models/pendants/butterfly_pendant.glb',
    arConfig: { scale: 0.45, offsetX: 0, offsetY: 0.04, offsetZ: 0, anchorLandmark: 'neck_center' },
    style: 'contemporary', occasion: ['casual', 'college', 'gifting'],
    colorTone: 'cool', gemstones: ['sapphire'],
    rating: 4.5, reviewCount: 342, tags: ['butterfly', 'silver', 'cute', 'casual']
  }
];

const outfitDataset = [
  { id:1, name:'Bridal Lehenga - Red', type:'lehenga', color:'red', occasion:'wedding', matches:['bridal','traditional','kundan','gold'] },
  { id:2, name:'Green Silk Saree', type:'saree', color:'green', occasion:'festival', matches:['traditional','gold','temple'] },
  { id:3, name:'Navy Blue Anarkali', type:'anarkali', color:'navy', occasion:'party', matches:['contemporary','silver','diamond'] },
  { id:4, name:'Pastel Pink Lehenga', type:'lehenga', color:'pink', occasion:'engagement', matches:['bridal','rose-gold','pearl'] },
  { id:5, name:'White Western Dress', type:'dress', color:'white', occasion:'party', matches:['minimalist','diamond','silver'] },
  { id:6, name:'Black Evening Gown', type:'gown', color:'black', occasion:'formal', matches:['minimalist','diamond','platinum'] },
  { id:7, name:'Mustard Yellow Kurti', type:'kurti', color:'mustard', occasion:'casual', matches:['traditional','gold','oxidized'] },
  { id:8, name:'Maroon Velvet Blouse', type:'blouse', color:'maroon', occasion:'wedding', matches:['bridal','kundan','polki'] },
  { id:9, name:'Indo-Western Jumpsuit', type:'jumpsuit', color:'teal', occasion:'party', matches:['fusion','silver','contemporary'] },
  { id:10, name:'Cream Silk Saree', type:'saree', color:'cream', occasion:'ceremony', matches:['pearl','minimalist','platinum'] }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    await Jewellery.deleteMany({});
    console.log('🗑️  Cleared existing jewellery data');

    const inserted = await Jewellery.insertMany(jewelleryData);
    console.log(`✅ Seeded ${inserted.length} jewellery items\n`);

    console.log('📊 Seed Summary:');
    const categories = {};
    jewelleryData.forEach(j => { categories[j.category] = (categories[j.category] || 0) + 1; });
    Object.entries(categories).forEach(([cat, count]) => console.log(`   ${cat}: ${count} items`));

    await mongoose.disconnect();
    console.log('\n✅ Seeding complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

module.exports = { jewelleryData, outfitDataset };
if (require.main === module) seed();

const express = require('express');
const router = express.Router();
const Jewellery = require('../models/Jewellery');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/jewellery  - get all with filters
router.get('/', async (req, res) => {
  try {
    const { category, material, style, occasion, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (material) query.material = material;
    if (style) query.style = style;
    if (occasion) query.occasion = { $in: [occasion] };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Jewellery.countDocuments(query);
    const items = await Jewellery.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/jewellery/categories - unique categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await Jewellery.distinct('category');
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/jewellery/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Jewellery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/jewellery  - admin creates jewellery
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const item = await Jewellery.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @PUT /api/jewellery/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Jewellery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @DELETE /api/jewellery/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await Jewellery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

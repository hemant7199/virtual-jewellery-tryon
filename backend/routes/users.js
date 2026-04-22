const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, skinTone, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, skinTone, preferences },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @POST /api/users/favorites/:jewelleryId
router.post('/favorites/:jewelleryId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.favorites.includes(req.params.jewelleryId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.jewelleryId);
      await user.save();
      return res.json({ success: true, message: 'Removed from favorites', favorited: false });
    }
    user.favorites.push(req.params.jewelleryId);
    await user.save();
    res.json({ success: true, message: 'Added to favorites', favorited: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/users/favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ success: true, data: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

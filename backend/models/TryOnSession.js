const mongoose = require('mongoose');

const tryOnSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null  // null = guest user
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  jewelleryTried: [{
    jewellery: { type: mongoose.Schema.Types.ObjectId, ref: 'Jewellery' },
    duration: Number,  // seconds spent trying
    savedSnapshot: String  // base64 or URL of saved photo
  }],
  deviceInfo: {
    userAgent: String,
    platform: String,
    screenResolution: String
  },
  fps: Number,
  trackingAccuracy: Number,  // 0-100
  feedbackRating: { type: Number, min: 1, max: 5, default: null },
  feedbackComment: String
}, { timestamps: true });

module.exports = mongoose.model('TryOnSession', tryOnSessionSchema);

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const TryOnSession = require('../models/TryOnSession');

// @POST /api/tryon/session/start
router.post('/session/start', async (req, res) => {
  try {
    const sessionId = crypto.randomUUID();
    const { userId, deviceInfo } = req.body;
    try {
      const session = await TryOnSession.create({
        sessionId, user: userId || null,
        deviceInfo: deviceInfo || {}, jewelleryTried: []
      });
      return res.status(201).json({ success: true, sessionId, sessionDbId: session._id });
    } catch (dbErr) {
      // DB unavailable - still return session ID
      return res.json({ success: true, sessionId });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/tryon/session/:sessionId/item
router.post('/session/:sessionId/item', async (req, res) => {
  try {
    const { jewelleryId, duration } = req.body;
    await TryOnSession.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $push: { jewelleryTried: { jewellery: jewelleryId, duration } } }
    );
    res.json({ success: true });
  } catch {
    res.json({ success: true }); // silent fail
  }
});

// @POST /api/tryon/session/:sessionId/feedback
router.post('/session/:sessionId/feedback', async (req, res) => {
  try {
    const { rating, comment, fps, trackingAccuracy } = req.body;
    await TryOnSession.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { feedbackRating: rating, feedbackComment: comment, fps, trackingAccuracy }
    );
    res.json({ success: true, message: 'Feedback saved, thank you!' });
  } catch {
    res.json({ success: true });
  }
});

// @GET /api/tryon/stats
router.get('/stats', async (req, res) => {
  try {
    const totalSessions = await TryOnSession.countDocuments();
    const avgArr = await TryOnSession.aggregate([
      { $match: { feedbackRating: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$feedbackRating' } } }
    ]);
    res.json({ success: true, data: { totalSessions, avgUserRating: avgArr[0]?.avg?.toFixed(2) || 'N/A' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

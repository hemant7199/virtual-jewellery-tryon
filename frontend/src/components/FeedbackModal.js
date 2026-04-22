import React, { useState } from 'react';
import { tryOnAPI } from '../utils/api';
import './FeedbackModal.css';

export default function FeedbackModal({ sessionId, onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const QUICK_FEEDBACK = [
    'Very accurate placement!',
    'Smooth and realistic',
    'Could use better lighting',
    'Loved the experience',
    'Ring tracking needs work',
    'Earring placement perfect',
  ];

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      if (sessionId) {
        await tryOnAPI.submitFeedback(sessionId, {
          rating,
          comment,
          fps: null,
          trackingAccuracy: null,
        });
      }
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } catch {
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="feedback-modal">
        {submitted ? (
          <div className="feedback-success">
            <span className="feedback-success-icon">✦</span>
            <h3>Thank you!</h3>
            <p>Your feedback helps us improve the AR experience.</p>
          </div>
        ) : (
          <>
            <div className="feedback-header">
              <h3>Rate Your AR Experience</h3>
              <button className="feedback-close" onClick={onClose}>✕</button>
            </div>

            <p className="feedback-subtitle">
              How was the jewellery try-on experience?
            </p>

            {/* Star Rating */}
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >★</button>
              ))}
            </div>
            {rating > 0 && (
              <div className="rating-label">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
              </div>
            )}

            {/* Quick tags */}
            <div className="quick-feedback">
              <span className="quick-label">Quick feedback:</span>
              <div className="quick-chips">
                {QUICK_FEEDBACK.map(f => (
                  <button
                    key={f}
                    className={`quick-chip ${comment === f ? 'active' : ''}`}
                    onClick={() => setComment(prev => prev === f ? '' : f)}
                  >{f}</button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <textarea
              className="input feedback-textarea"
              placeholder="Tell us more about your experience (optional)…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />

            <div className="feedback-actions">
              <button className="btn btn-ghost" onClick={onClose}>Skip</button>
              <button
                className="btn btn-gold"
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

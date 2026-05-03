'use client';

import { useState, useRef } from 'react';

export default function RSVPModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    attending: '',
    name: '',
    guests: [],
    song: '',
    traveling: '',
    travel_from: '',
  });
  const [guestInput, setGuestInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddGuest = () => {
    if (guestInput.trim()) {
      setFormData(prev => ({
        ...prev,
        guests: [...prev.guests, guestInput.trim()]
      }));
      setGuestInput('');
    }
  };

  const handleRemoveGuest = (index) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.attending) {
      setError('Please indicate if you will be attending');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (!formData.traveling) {
      setError('Please indicate if you will be traveling from outside Armenia');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error('Failed to submit');
      }
      
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({
      attending: '',
      name: '',
      guests: [],
      song: '',
      traveling: '',
      travel_from: '',
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>✕</button>
        
        <div className="section-header">
          <p className="section-label">Respond</p>
          <h2>RSVP</h2>
          <p>Please let us know by June 15, 2026</p>
        </div>
        
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-banner">{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Will you be attending?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="attending" value="yes" onChange={(e) => setFormData(prev => ({ ...prev, attending: e.target.value }))} />
                  <span>Joyfully attending</span>
                </label>
                <label className="radio-option">
                  <input type="radio" name="attending" value="no" onChange={(e) => setFormData(prev => ({ ...prev, attending: e.target.value }))} />
                  <span>Regretfully cannot attend</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name…"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Who else will be attending with you?</label>
              <div className="guest-list">
                {formData.guests.map((guest, idx) => (
                  <div key={idx} className="guest-row">
                    <span className="guest-name">{guest}</span>
                    <button type="button" className="guest-remove" onClick={() => handleRemoveGuest(idx)}>✕</button>
                  </div>
                ))}
              </div>
              <div className="add-guest-row">
                <input
                  type="text"
                  className="form-input"
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  placeholder="Guest name…"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGuest())}
                />
                <button type="button" className="add-guest-btn" onClick={handleAddGuest}>+ Add</button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="song">Song request <span className="optional-tag">(optional)</span></label>
              <textarea
                id="song"
                className="form-textarea"
                rows="2"
                value={formData.song}
                onChange={(e) => setFormData(prev => ({ ...prev, song: e.target.value }))}
                placeholder="What will get you on the dance floor?…"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Will you be traveling from outside Armenia?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="traveling" value="yes" onChange={(e) => setFormData(prev => ({ ...prev, traveling: e.target.value }))} />
                  <span>Yes</span>
                </label>
                <label className="radio-option">
                  <input type="radio" name="traveling" value="no" onChange={(e) => setFormData(prev => ({ ...prev, traveling: e.target.value }))} />
                  <span>No</span>
                </label>
              </div>
            </div>
            
            {formData.traveling === 'yes' && (
              <div className="form-group">
                <label className="form-label" htmlFor="travel_from">Where will you be traveling from?</label>
                <input
                  type="text"
                  id="travel_from"
                  className="form-input"
                  value={formData.travel_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, travel_from: e.target.value }))}
                  placeholder="City and country…"
                />
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button type="submit" className="form-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit RSVP'}
              </button>
            </div>
          </form>
        ) : (
          <div className="rsvp-confirm">
            <div className="rsvp-confirm-icon">
              <svg viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="34" stroke="var(--gold)" strokeWidth="2.5"/>
                <polyline points="20,37 31,48 52,26" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="rsvp-confirm-msg">
              Thank you so much for your RSVP,<br/>
              we can't wait to celebrate with you ✨<br/><br/>
              See you on the dance floor 💃🕺
            </p>
            <button className="form-submit" style={{ marginTop: '1.8rem' }} onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(38, 38, 38, 0.5);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .modal {
          position: relative;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 3rem 2.5rem;
          border-radius: 16px;
          background: rgba(243, 237, 229, 0.92);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
        }
        .modal-close {
          position: absolute;
          top: 1.2rem;
          right: 1.5rem;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: var(--taupe);
          cursor: pointer;
        }
        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .section-label {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--gold-dark);
          margin-bottom: 0.6rem;
        }
        .section-header h2 {
          font-family: var(--font-playfair);
          font-size: 1.8rem;
          color: var(--cacao);
          margin-bottom: 0.6rem;
        }
        .section-header p {
          font-size: 0.85rem;
          color: var(--taupe);
        }
        .form-group {
          margin-bottom: 1.2rem;
          text-align: left;
        }
        .form-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--cacao);
          margin-bottom: 0.4rem;
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.72rem 1.1rem;
          font-size: 0.82rem;
          color: var(--cacao);
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 8px;
          outline: none;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: var(--gold);
        }
        .radio-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        .radio-option input[type="radio"] {
          width: 18px;
          height: 18px;
          accent-color: var(--gold);
        }
        .optional-tag {
          font-size: 0.6rem;
          color: var(--taupe);
          font-style: italic;
        }
        .guest-list {
          margin-bottom: 0.5rem;
        }
        .guest-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
          background: rgba(255,255,255,0.2);
          border-radius: 6px;
          margin-bottom: 0.25rem;
        }
        .guest-remove {
          background: none;
          border: none;
          color: var(--taupe);
          cursor: pointer;
          font-size: 0.8rem;
        }
        .add-guest-row {
          display: flex;
          gap: 0.5rem;
        }
        .add-guest-btn {
          padding: 0.5rem 1rem;
          background: var(--gold);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 500;
        }
        .form-submit {
          padding: 0.85rem 2.8rem;
          background: linear-gradient(180deg, var(--gold-light) 0%, var(--gold) 100%);
          color: white;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .form-submit:hover {
          background: linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%);
          transform: translateY(-1px);
        }
        .error-banner {
          padding: 0.5rem;
          margin-bottom: 1rem;
          background: rgba(192, 57, 43, 0.1);
          border: 1px solid rgba(192, 57, 43, 0.3);
          border-radius: 6px;
          color: #c0392b;
          font-size: 0.75rem;
          text-align: center;
        }
        .rsvp-confirm {
          text-align: center;
          padding: 1rem 0 0.5rem;
        }
        .rsvp-confirm-icon svg {
          width: 72px;
          height: 72px;
        }
        .rsvp-confirm-msg {
          font-family: var(--font-playfair);
          font-size: 1rem;
          color: var(--cacao);
          margin-top: 1rem;
        }
        @media (max-width: 768px) {
          .modal {
            padding: 1.8rem 1.4rem;
          }
          .radio-group {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
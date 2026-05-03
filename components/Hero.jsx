'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero({ onOpenRSVP }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2026-08-07T16:00:00+04:00');

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (86400000)) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="flip-card-container" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
          <div className="flip-card-front">
            <p className="front-names">
              <span className="name-part">Aren</span>
              <span className="amp">&amp;</span>
              <span className="name-part">Talar</span>
            </p>
            <p className="front-date-overlay">August 7, 2026</p>
            <button className="front-hint" onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}>
              Tap to open
            </button>
          </div>
          <div className="flip-card-back">
            <div className="back-content">
              <p className="back-monogram">Together with their families</p>
              <h1 className="back-names">
                <span className="name-part">Aren Reisian</span>
                <span className="amp">&amp;</span>
                <span className="name-part">Talar Mazloumian</span>
              </h1>
              <p className="back-subtitle">invite you to celebrate their wedding on</p>
              <p className="back-main-date">Friday, August 7, 2026</p>
              <div className="back-events-grid">
                <div className="back-event-col">
                  <p className="back-event-label">Ceremony at 4:00 PM</p>
                  <p className="back-event-venue">Saint Gayane Church</p>
                  <p className="back-event-location">Vagharshapat, Armenia</p>
                </div>
                <div className="back-event-divider"><span className="back-divider-diamond">◆</span></div>
                <div className="back-event-col">
                  <p className="back-event-label">Reception at 5:30 PM</p>
                  <p className="back-event-venue">Jellyfish Restaurant</p>
                  <p className="back-event-location">Yerevan, Armenia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-below">
        <p className="hero-rsvp-sentence">
          We can't wait to celebrate with you · Kindly{' '}
          <button className="rsvp-inline" onClick={onOpenRSVP}>RSVP</button> by June 15th
        </p>
        <p className="hero-countdown-text">
          <span className="cd-num">{String(timeLeft.days).padStart(3, '0')}</span> days,
          <span className="cd-num"> {String(timeLeft.hours).padStart(2, '0')}</span> hours,
          <span className="cd-num"> {String(timeLeft.minutes).padStart(2, '0')}</span> minutes &
          <span className="cd-num"> {String(timeLeft.seconds).padStart(2, '0')}</span> seconds to go
        </p>
      </div>

      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4.5rem 2rem 3rem;
          gap: 1.5rem;
          position: relative;
        }
        .flip-card-container {
          perspective: 900px;
          cursor: pointer;
          width: min(72vw, 960px);
          filter: drop-shadow(0px 25px 50px rgba(0, 0, 0, 0.18));
        }
        .flip-card {
          width: 100%;
          aspect-ratio: 3 / 2;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
        }
        .flip-card-front {
          background: var(--cacao);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 2rem;
          background-image: linear-gradient(180deg, rgba(38, 38, 38, 0.0) 0%, rgba(38, 38, 38, 0.45) 100%),
            url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80');
          background-size: cover;
          background-position: center;
        }
        .flip-card-back {
          transform: rotateY(180deg);
          background: var(--cream);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8% 10% 9%;
          text-align: center;
        }
        .front-names {
          font-family: var(--font-great-vibes);
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          color: var(--white);
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
          line-height: 1.1;
          position: absolute;
          top: 58%;
          left: 50%;
          transform: translate(-50%, 0);
          white-space: nowrap;
        }
        .front-names .amp {
          opacity: 0.55;
          font-size: 0.7em;
          margin: 0 0.12em;
        }
        .front-date-overlay {
          position: absolute;
          top: 52%;
          left: 50%;
          transform: translate(-50%, 0);
          font-size: 0.68rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
        }
        .front-hint {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(12px);
          padding: 0.45rem 1rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
        }
        .back-monogram {
          font-size: clamp(0.58rem, 1vw, 0.78rem);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--taupe);
          margin-bottom: clamp(0.9rem, 2vw, 1.6rem);
        }
        .back-names {
          font-family: var(--font-great-vibes);
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          color: var(--cacao);
          line-height: 1.05;
          margin-bottom: clamp(1.2rem, 2.5vw, 2rem);
        }
        .back-names .amp {
          opacity: 0.35;
          font-size: 1em;
          margin: 0 0.2em;
          color: var(--taupe);
        }
        .back-subtitle {
          font-size: clamp(0.58rem, 1vw, 0.78rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--taupe);
          margin-bottom: clamp(0.25rem, 0.6vw, 0.5rem);
        }
        .back-main-date {
          font-family: var(--font-playfair);
          font-size: clamp(1rem, 1.8vw, 1.5rem);
          color: var(--cacao);
          font-weight: 500;
          margin-bottom: clamp(1.5rem, 3.5vw, 3rem);
        }
        .back-events-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: clamp(1.2rem, 3vw, 2.5rem);
          align-items: start;
          max-width: 80%;
        }
        .back-event-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .back-event-label {
          font-size: clamp(0.52rem, 0.9vw, 0.7rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--cacao);
          margin-bottom: clamp(0.4rem, 0.8vw, 0.6rem);
          font-weight: 500;
        }
        .back-event-venue {
          font-size: clamp(0.55rem, 0.95vw, 0.72rem);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--taupe);
          font-weight: 500;
        }
        .back-event-location {
          font-size: clamp(0.5rem, 0.85vw, 0.65rem);
          letter-spacing: 0.06em;
          color: var(--taupe);
          opacity: 0.7;
        }
        .back-event-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .back-divider-diamond {
          color: var(--gold);
          font-size: 0.65rem;
        }
        .hero-below {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          text-align: center;
        }
        .hero-rsvp-sentence {
          font-family: var(--font-playfair);
          font-size: clamp(0.85rem, 1.5vw, 1.05rem);
          font-weight: 300;
          font-style: italic;
          color: var(--taupe);
        }
        .rsvp-inline {
          display: inline-block;
          font-style: normal;
          font-weight: 700;
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--pearl);
          background: var(--cacao);
          padding: 0.42rem 1.3rem;
          border-radius: 50px;
          margin: 0 0.2em;
          border: none;
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .rsvp-inline:hover {
          background: var(--leather);
          transform: translateY(-2px);
        }
        .hero-countdown-text {
          font-family: var(--font-playfair);
          font-size: clamp(0.78rem, 1.3vw, 0.95rem);
          font-weight: 300;
          font-style: italic;
          color: var(--taupe);
        }
        .cd-num {
          font-family: var(--font-montserrat);
          font-weight: 600;
          font-style: normal;
          color: var(--cacao);
          font-variant-numeric: tabular-nums;
        }
        @media (max-width: 768px) {
          .flip-card-container {
            width: min(67.5vw, 308px);
          }
          .flip-card {
            aspect-ratio: 2 / 3;
          }
          .back-names .name-part {
            display: block;
          }
          .back-names .amp {
            display: block;
            font-size: 0.85em;
            margin: 0.08em 0;
          }
          .back-events-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .back-event-divider {
            flex-direction: row;
          }
          .front-names {
            font-size: 2.6rem;
          }
        }
      `}</style>
    </section>
  );
}
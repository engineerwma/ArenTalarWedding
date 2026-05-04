'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function WeddingPage() {
  // State variables
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('Eng')
  const [scrolled, setScrolled] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [guestCount, setGuestCount] = useState(0)
  const [wishOpen, setWishOpen] = useState(false)
  const [faqIndex, setFaqIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  
  const cardRef = useRef<HTMLDivElement>(null)
  const frontImageRef = useRef<HTMLDivElement>(null)

  // Countdown timer
  useEffect(() => {
    const calculateCountdown = () => {
      const weddingDate = new Date('2026-08-07T16:00:00+04:00')
      const now = new Date()
      const diff = weddingDate.getTime() - now.getTime()
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 })
        return
      }
      
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (86400000)) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    
    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Scroll handler for nav
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero')
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom
        setScrolled(heroBottom < 80)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (frontImageRef.current) {
        frontImageRef.current.style.setProperty('--front-img', `url('${ev.target?.result}')`)
      }
    }
    reader.readAsDataURL(file)
  }

  // RSVP submission
  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const guests: string[] = []
    const guestInputs = document.querySelectorAll('#guest-list input')
    guestInputs.forEach(input => {
      if ((input as HTMLInputElement).value.trim()) {
        guests.push((input as HTMLInputElement).value.trim())
      }
    })
    
    const rsvpData = {
      attending: formData.get('attending'),
      fullName: formData.get('name'),
      guests,
      songRequest: formData.get('song'),
      travelingFrom: formData.get('travelingFrom'),
    }
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData),
      })
      
      const data = await response.json()
      if (data.success) {
        setIsRsvpModalOpen(false)
        alert('Thank you for your RSVP! ✨')
      } else {
        alert('There was an error. Please try again.')
      }
    } catch (error) {
      console.error('RSVP Error:', error)
      alert('There was an error. Please try again.')
    }
  }

  // Wish submission
  const handleWishSubmit = async () => {
    const message = (document.getElementById('wishText') as HTMLTextAreaElement)?.value
    if (!message || !message.trim()) {
      alert('Please write a message first.')
      return
    }
    
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Thank you for your message! 💛')
        setWishOpen(false)
        ;(document.getElementById('wishText') as HTMLTextAreaElement).value = ''
      }
    } catch (error) {
      console.error('Wish Error:', error)
      alert('There was an error. Please try again.')
    }
  }

  // Add guest to RSVP
  const addGuest = () => {
    const newCount = guestCount + 1
    setGuestCount(newCount)
    const list = document.getElementById('guest-list')
    if (list) {
      const row = document.createElement('div')
      row.className = 'guest-row'
      row.innerHTML = `
        <input type="text" name="guest[]" class="form-input" placeholder="Guest ${newCount} full name…" autocomplete="off">
        <button type="button" class="guest-remove" onclick="this.closest('.guest-row').remove();">✕</button>
      `
      list.appendChild(row)
    }
  }

  // FAQ Carousel
  const faqItems = [
    { q: "When should I RSVP by?", a: "June 15, 2026" },
    { q: "Where should I stay?", a: "Yerevan city center is the most convenient. Check the Travel section for special hotel rates." },
    { q: "Can I bring a plus one?", a: "Yes! Let's all celebrate together — just please add their full name in the RSVP." },
    { q: "What's the dress code?", a: "Outdoor formal. Think elevated but comfortable for a summer evening." },
    { q: "Will events be outdoors?", a: "The ceremony and cocktail hour are indoors, and the reception will be outdoors." },
    { q: "What time should I arrive?", a: "Please arrive at least 15–20 minutes before the ceremony." },
  ]

  const faqPrev = () => setFaqIndex((prev) => (prev - 1 + faqItems.length) % faqItems.length)
  const faqNext = () => setFaqIndex((prev) => (prev + 1) % faqItems.length)

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <style jsx global>{`
        :root {
          color-scheme: light;
          --white: #FFFFFF;
          --pearl: #FAF8F5;
          --cream: #F3EDE5;
          --khaki: #DFDACF;
          --taupe: #A3968D;
          --cacao: #4D403A;
          --leather: #262626;
          --gold: #C4A265;
          --gold-light: #D4B87A;
          --gold-dark: #9E7E45;
          --handwriting: 'Great Vibes', cursive;
          --serif: 'Playfair Display', Georgia, serif;
          --sans: 'Montserrat', sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: var(--sans);
          color: var(--leather);
          line-height: 1.7;
          font-weight: 300;
          overflow-x: hidden;
          background: linear-gradient(150deg, #F5EDE4 0%, #E8DDD2 30%, #D4C5B5 60%, #C7B9AA 100%);
          background-attachment: fixed;
        }

        /* Your complete CSS styles from the original HTML go here */
        /* I'll include the essential styles below, but you should copy all styles from your HTML file */

        /* Navigation */
        .nav {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          padding: 0 2.2rem;
          height: 38px;
          background: linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35));
          backdrop-filter: blur(24px);
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .nav.scrolled {
          background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5));
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          list-style: none;
        }

        .nav-links a {
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 500;
          color: var(--cacao);
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          position: relative;
        }

        /* Flip Card */
        .flip-card-container {
          perspective: 900px;
          cursor: pointer;
          width: min(72vw, 960px);
          margin: 0 auto;
        }

        .flip-card {
          width: 100%;
          aspect-ratio: 3/2;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .flip-card.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          overflow: hidden;
        }

        .flip-card-front {
          background: var(--cacao);
          transform: rotateY(0deg);
        }

        .flip-card-back {
          background: var(--cream);
          transform: rotateY(180deg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        /* RSVP Modal */
        .rsvp-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(38, 38, 38, 0.5);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .rsvp-modal-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .rsvp-modal {
          background: rgba(243, 237, 229, 0.95);
          border-radius: 16px;
          max-width: 520px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          position: relative;
        }

        .rsvp-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--taupe);
        }

        /* Mobile Menu */
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1.2rem;
          z-index: 1001;
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35));
          backdrop-filter: blur(16px);
          border-radius: 50%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
        }

        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 80%;
          max-width: 340px;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
          z-index: 1002;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          padding: 5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-nav-overlay.open {
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .nav { display: none; }
          .mobile-menu-btn { display: flex; }
          .flip-card-container { width: min(67.5vw, 308px); }
          .flip-card { aspect-ratio: 2/3; }
        }

        /* Add all other styles from your HTML file here */
      `}</style>

      {/* Skip Link */}
      <a className="skip-link" href="#events" style={{ position: 'absolute', top: '-100%' }}>
        Skip to main content
      </a>

      {/* Background Orbs */}
      <div className="bg-orbs" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className="orb orb-1" style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(223,218,207,0.7) 0%, transparent 70%)', top: '-8%', left: '-5%', borderRadius: '50%', filter: 'blur(90px)' }}></div>
        <div className="orb orb-2" style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(196,162,101,0.2) 0%, transparent 65%)', top: '25%', right: '-8%', borderRadius: '50%', filter: 'blur(90px)' }}></div>
        <div className="orb orb-3" style={{ position: 'absolute', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(163,150,141,0.4) 0%, transparent 70%)', bottom: '15%', left: '10%', borderRadius: '50%', filter: 'blur(90px)' }}></div>
      </div>

      <div className="page-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Navigation */}
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
          <ul className="nav-links">
            <li><a href="#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>Wedding Day</a></li>
            <li><a href="#dresscode" onClick={(e) => { e.preventDefault(); scrollToSection('dresscode'); }}>Dress Code</a></li>
            <li><a href="#gifts" onClick={(e) => { e.preventDefault(); scrollToSection('gifts'); }}>Gifts</a></li>
            <li><a href="#travel" onClick={(e) => { e.preventDefault(); scrollToSection('travel'); }}>Travel</a></li>
            <li><a href="#faqs" onClick={(e) => { e.preventDefault(); scrollToSection('faqs'); }}>FAQs</a></li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Open navigation menu"
        >
          <span></span><span></span><span></span>
        </button>

        {/* Mobile Navigation Overlay */}
        <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
          <button className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'absolute', top: '1.2rem', left: '1.5rem', background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
          <a href="#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>Wedding Day</a>
          <a href="#dresscode" onClick={(e) => { e.preventDefault(); scrollToSection('dresscode'); }}>Dress Code</a>
          <a href="#gifts" onClick={(e) => { e.preventDefault(); scrollToSection('gifts'); }}>Gifts</a>
          <a href="#travel" onClick={(e) => { e.preventDefault(); scrollToSection('travel'); }}>Travel</a>
          <a href="#faqs" onClick={(e) => { e.preventDefault(); scrollToSection('faqs'); }}>FAQs</a>
        </div>

        {/* Hero Section */}
        <section className="hero" id="hero">
          <div className="flip-card-container">
            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
              <div className="flip-card-front" ref={frontImageRef}>
                <div className="upload-btn-wrap" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 5 }}>
                  <label className="upload-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="white" fill="none" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <p className="front-names" style={{ position: 'absolute', top: '58%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--handwriting)', fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', color: 'white', textAlign: 'center', width: '100%' }}>
                  <span>Aren</span>&amp;<span>Talar</span>
                </p>
                <p className="front-date-overlay" style={{ position: 'absolute', top: '52%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--sans)', fontSize: '0.68rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)' }}>
                  August 7, 2026
                </p>
              </div>
              <div className="flip-card-back">
                <div className="back-content" style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '1rem' }}>
                    Together with their families
                  </p>
                  <h1 style={{ fontFamily: 'var(--handwriting)', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', color: 'var(--cacao)', marginBottom: '1rem' }}>
                    Aren &amp; Talar
                  </h1>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: '0.5rem' }}>
                    invite you to celebrate their wedding on
                  </p>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1rem, 1.8vw, 1.5rem)', color: 'var(--cacao)', fontWeight: 500, marginBottom: '2rem' }}>
                    Friday, August 7, 2026
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start' }}>
                    <div>
                      <p style={{ fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>Ceremony at 4:00 PM</p>
                      <p style={{ fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Saint Gayane Church</p>
                      <p style={{ fontSize: '0.5rem', opacity: 0.7 }}>Vagharshapat, Armenia</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--gold)' }}>⬥</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>Reception at 5:30 PM</p>
                      <p style={{ fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Jellyfish Restaurant</p>
                      <p style={{ fontSize: '0.5rem', opacity: 0.7 }}>Yerevan, Armenia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-below" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p>
              We can't wait to celebrate with you &middot; 
              <button onClick={() => setIsRsvpModalOpen(true)} className="rsvp-inline" style={{ display: 'inline-block', background: 'var(--cacao)', color: 'white', padding: '0.42rem 1.3rem', borderRadius: '50px', marginLeft: '0.5rem', border: 'none', cursor: 'pointer' }}>
                RSVP
              </button> by June 15th
            </p>
            <p style={{ marginTop: '1rem' }}>
              <span className="cd-num" style={{ fontWeight: 600 }}>{countdown.days}</span> days,
              <span className="cd-num" style={{ fontWeight: 600 }}> {countdown.hours}</span> hours,
              <span className="cd-num" style={{ fontWeight: 600 }}> {countdown.mins}</span> minutes &
              <span className="cd-num" style={{ fontWeight: 600 }}> {countdown.secs}</span> seconds to go
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="about-inner" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', padding: '3rem 2.5rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>
                <span style={{ width: '35px', height: '1px', background: 'var(--gold)' }}></span>
                <span>⬥</span>
                <span style={{ width: '35px', height: '1px', background: 'var(--gold)' }}></span>
              </div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1.3rem' }}>
                We're getting married in Armenia
              </h2>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)', fontStyle: 'italic', maxWidth: '50ch', margin: '0 auto' }}>
                We're bringing our favorite people from all over the world together for one unforgettable weekend in Yerevan.
              </p>
            </div>
          </div>
        </section>

        {/* Wedding Day Section */}
        <section id="events" style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>Wedding Day</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Wedding Day</h2>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', marginTop: '0.3rem', fontStyle: 'italic' }}>Friday, August 7, 2026</p>
            </div>

            {/* Event 1 - Ceremony */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '1.8rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '2.5rem' }}>
                <p style={{ fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>4:00 – 5:00 PM</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.45rem', fontWeight: 500, marginBottom: '0.3rem' }}>Ceremony</h3>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '0.78rem', color: 'var(--taupe)', fontStyle: 'italic', marginBottom: '0.8rem' }}>A traditional ceremony in one of the most beautiful historic churches.</p>
                <p style={{ display: 'flex', gap: '0.6rem', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span>📍</span>
                  <span><strong>Saint Gayane Church</strong><br />Vagharshapat, Armenia<br /><span style={{ fontSize: '0.68rem', opacity: 0.7 }}>~20 km / 12 mi from Yerevan center</span></span>
                </p>
                <a href="https://maps.google.com/?q=Saint+Gayane+Church+Etchmiadzin" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 1.2rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', color: 'var(--cacao)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', textDecoration: 'none', marginTop: '1rem' }}>
                  View Map →
                </a>
              </div>
              <div style={{ position: 'relative', minHeight: '280px', background: 'url(https://hyurservice.com/images/attractions/1/16117743401225/hqdefault.webp) center/cover' }}></div>
            </div>

            {/* Event 2 - Cocktail Hour */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '1.8rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '2.5rem' }}>
                <p style={{ fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>5:30 – 7:00 PM</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.45rem', fontWeight: 500, marginBottom: '0.3rem' }}>Cocktail Hour</h3>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '0.78rem', color: 'var(--taupe)', fontStyle: 'italic', marginBottom: '0.8rem' }}>Drinks, bites, and time to mingle before the party begins.</p>
                <p style={{ display: 'flex', gap: '0.6rem', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span>📍</span>
                  <span><strong>Jellyfish Restaurant (Indoor)</strong><br />Yerevan, Armenia<br /><span style={{ fontSize: '0.68rem', opacity: 0.7 }}>~2 km / 1.2 mi from city center</span></span>
                </p>
                <a href="https://maps.google.com/?q=Jellyfish+Restaurant+Yerevan" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 1.2rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', color: 'var(--cacao)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', textDecoration: 'none', marginTop: '1rem' }}>
                  View Map →
                </a>
              </div>
              <div style={{ position: 'relative', minHeight: '280px', background: 'url(https://static.ucraft.net/fs/ucraft/userFiles/jellyfish/images/r1069-restaurant-iamge-1-17119875498648.webp) center/cover' }}></div>
            </div>

            {/* Event 3 - Reception */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '2.5rem' }}>
                <p style={{ fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>7:00 PM – 1:00 AM</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.45rem', fontWeight: 500, marginBottom: '0.3rem' }}>Reception</h3>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '0.78rem', color: 'var(--taupe)', fontStyle: 'italic', marginBottom: '0.8rem' }}>Dinner, dancing, and a full night of celebration.</p>
                <p style={{ display: 'flex', gap: '0.6rem', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span>📍</span>
                  <span><strong>Jellyfish Restaurant (Outdoor)</strong><br />Yerevan, Armenia<br /><span style={{ fontSize: '0.68rem', opacity: 0.7 }}>Same venue as cocktail hour</span></span>
                </p>
                <a href="https://maps.google.com/?q=Jellyfish+Restaurant+Yerevan" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 1.2rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', color: 'var(--cacao)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', textDecoration: 'none', marginTop: '1rem' }}>
                  View Map →
                </a>
              </div>
              <div style={{ position: 'relative', minHeight: '280px', background: 'url(https://static.ucraft.net/fs/ucraft/userFiles/jellyfish/images/r1194-events-landing-copy-1-17126753439126.webp) center/cover' }}></div>
            </div>
          </div>
        </section>

        {/* Dress Code Section */}
        <section id="dresscode" style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>What to Wear</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Dress Code</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '860px', margin: '0 auto' }}>
              <div style={{ padding: '2.5rem 1.8rem', textAlign: 'center', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(18px)', borderRadius: '12px' }}>
                <div style={{ width: '58px', height: '58px', margin: '0 auto 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(223,218,207,0.3))', borderRadius: '50%' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--gold)" fill="none"><path d="M12 2l3 5h5l-4 4 2 6-6-3-6 3 2-6-4-4h5l3-5z" /></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Outdoor Formal</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--taupe)' }}>Think elevated, but comfortable for a summer evening.</p>
              </div>
              <div style={{ padding: '2.5rem 1.8rem', textAlign: 'center', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(18px)', borderRadius: '12px' }}>
                <div style={{ width: '58px', height: '58px', margin: '0 auto 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(223,218,207,0.3))', borderRadius: '50%' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--gold)" fill="none"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Summer Tones</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--taupe)' }}>Light colors, soft tones, and breathable fabrics are your best friend.</p>
              </div>
              <div style={{ padding: '2.5rem 1.8rem', textAlign: 'center', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(18px)', borderRadius: '12px' }}>
                <div style={{ width: '58px', height: '58px', margin: '0 auto 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(223,218,207,0.3))', borderRadius: '50%' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--gold)" fill="none"><path d="M17 8C17 5.24 14.76 3 12 3S7 5.24 7 8c0 3.53 5 10 5 10s5-6.47 5-10z" /><circle cx="12" cy="8" r="2" /></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Chic &amp; Effortless</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--taupe)' }}>Dress to impress, but make it feel like you.</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a href="https://www.pinterest.com/search/pins/?q=outdoor%20formal&rs=typed" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--serif)', fontSize: '0.92rem', fontStyle: 'italic', color: 'var(--cacao)', textDecoration: 'none' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#E60023"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.39.04-3.42.22-.93 1.4-5.94 1.4-5.94s-.36-.72-.36-1.78c0-1.66.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 4-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.78-2.26 3.78-5.5 0-2.88-2.07-4.89-5.02-4.89-3.42 0-5.43 2.57-5.43 5.22 0 1.03.4 2.14.89 2.74.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.78 2.74-7.25 7.92-7.25 4.16 0 7.39 2.96 7.39 6.93 0 4.13-2.6 7.46-6.22 7.46-1.21 0-2.36-.63-2.75-1.37l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14A12 12 0 1 0 12 0z" /></svg>
                Looking for outfit ideas? Browse our Pinterest inspiration →
              </a>
            </div>
          </div>
        </section>

        {/* Gifts Section */}
        <section id="gifts" style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>With Gratitude</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Gifts</h2>
            </div>
            <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem', color: 'var(--taupe)' }}>Your presence is the greatest gift. If you'd like to contribute to our next chapter, we've provided details below.</p>
              
              {/* Gift Accordion - AMD */}
              <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)', borderRadius: '10px', marginBottom: '1rem', overflow: 'hidden' }}>
                <button style={{ width: '100%', padding: '1rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.78rem', color: 'var(--cacao)' }}>
                  <span>🇦🇲 AMD Account - Ameria Bank</span>
                  <span>▼</span>
                </button>
                <div style={{ padding: '0 1.4rem 1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(163,150,141,0.1)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--taupe)' }}>Account Holder</span>
                    <span>Talar Mazloumian</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--taupe)' }}>Card Number</span>
                    <span>4083 0600 9648 4528</span>
                  </div>
                </div>
              </div>
              
              {/* Gift Accordion - USD */}
              <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)', borderRadius: '10px', marginBottom: '1rem', overflow: 'hidden' }}>
                <button style={{ width: '100%', padding: '1rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.78rem', color: 'var(--cacao)' }}>
                  <span>🇺🇸 USD Account - Venmo</span>
                  <span>▼</span>
                </button>
                <div style={{ padding: '0 1.4rem 1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(163,150,141,0.1)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--taupe)' }}>Account</span>
                    <span>@Talar-Mazloumian</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--taupe)' }}>Phone</span>
                    <span>+1 (415) 518-4724</span>
                  </div>
                </div>
              </div>
              
              {/* Wish Section */}
              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => setWishOpen(!wishOpen)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', fontFamily: 'var(--serif)', fontSize: '0.92rem', fontStyle: 'italic', color: 'var(--gold)', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
                  Write a Wish or Message
                </button>
                {wishOpen && (
                  <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(14px)', borderRadius: '12px' }}>
                    <textarea id="wishText" placeholder="Write your message to Aren &amp; Talar…" style={{ width: '100%', padding: '1rem', fontFamily: 'var(--sans)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px', minHeight: '110px', resize: 'vertical' }}></textarea>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button onClick={() => setWishOpen(false)} style={{ padding: '0.6rem 1.4rem', background: 'rgba(255,255,255,0.4)', color: 'var(--taupe)', border: '1px solid rgba(163,150,141,0.3)', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                      <button onClick={handleWishSubmit} style={{ padding: '0.6rem 1.4rem', background: 'linear-gradient(180deg, var(--gold-light), var(--gold))', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Send Message</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Travel Section */}
        <section id="travel" style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>Getting There</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Travel &amp; Explore</h2>
              <p style={{ color: 'var(--taupe)', fontSize: '0.85rem' }}>We're so excited to have you in Armenia. Here's everything you need.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Getting Around */}
              <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(18px)', borderRadius: '12px' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: '1rem' }}>Getting Around</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <p><strong>Zvartnots International Airport (EVN)</strong></p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--taupe)' }}>Yerevan's main airport, about 20 minutes from the city center.</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p><strong>Money &amp; Payments</strong></p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--taupe)' }}>Cards are widely accepted, but having some local cash (AMD) is helpful.</p>
                </div>
                <div>
                  <p><strong>Transportation</strong></p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--taupe)' }}>We recommend using the GG Taxi app for quick, affordable rides.</p>
                </div>
              </div>
              
              {/* Where to Stay */}
              <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(18px)', borderRadius: '12px' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: '1rem' }}>Where to Stay</h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--taupe)', marginBottom: '1rem' }}>We recommend staying in central Yerevan, close to restaurants and cafés.</p>
                <div style={{ marginBottom: '0.5rem' }}>
                  <a href="https://www.wyndhamhotels.com/ramada/yerevan-armenia/ramada-by-wyndham-yerevan/overview" target="_blank" style={{ color: 'var(--cacao)', textDecoration: 'none', fontWeight: 500 }}>Ramada by Wyndham</a>
                  <p style={{ fontSize: '0.7rem', color: 'var(--taupe)' }}>58,000 AMD / night · Double room</p>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <a href="https://www.ihg.com/holidayinn/hotels/us/en/yerevan/evnha/hoteldetail" target="_blank" style={{ color: 'var(--cacao)', textDecoration: 'none', fontWeight: 500 }}>Holiday Inn Republic Square</a>
                  <p style={{ fontSize: '0.7rem', color: 'var(--taupe)' }}>58,000 AMD / night · Double room</p>
                </div>
                <div>
                  <a href="https://www.marriott.com/en-us/hotels/evnry-courtyard-yerevan/overview/" target="_blank" style={{ color: 'var(--cacao)', textDecoration: 'none', fontWeight: 500 }}>Courtyard by Marriott</a>
                  <p style={{ fontSize: '0.7rem', color: 'var(--taupe)' }}>62,000 AMD / night · Double room</p>
                </div>
              </div>
              
              {/* Explore Armenia */}
              <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(18px)', borderRadius: '12px' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: '1rem' }}>Explore Armenia</h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--taupe)', marginBottom: '1rem' }}>If you're staying a little longer, it's absolutely worth exploring beyond the city. Armenia has so much to offer.</p>
                <div>
                  <p><strong>Book with Armine</strong></p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--taupe)' }}>+374 43 222865 (Viber / WhatsApp)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faqs" style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>Questions</p>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>FAQs</h2>
            </div>
            
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', borderRadius: '14px', padding: '3rem 2.5rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', fontWeight: 500, marginBottom: '1rem' }}>
                  {faqItems[faqIndex].q}
                </p>
                <p style={{ fontSize: '0.92rem', color: 'var(--taupe)' }}>{faqItems[faqIndex].a}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '1.4rem' }}>
                <button onClick={faqPrev} style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ←
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {faqItems.map((_, idx) => (
                    <button key={idx} onClick={() => setFaqIndex(idx)} style={{ width: idx === faqIndex ? '24px' : '8px', height: '8px', borderRadius: idx === faqIndex ? '4px' : '50%', background: idx === faqIndex ? 'var(--gold)' : 'rgba(163,150,141,0.35)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} />
                  ))}
                </div>
                <button onClick={faqNext} style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '4.5rem 2rem', margin: '3rem 2rem 2rem', borderRadius: '18px', background: '#4D403A', position: 'relative' }}>
          <div>
            <p style={{ fontFamily: 'var(--handwriting)', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', color: 'white', marginBottom: '0.4rem' }}>Aren &amp; Talar</p>
            <div style={{ width: '50px', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '0.4rem auto 0.8rem' }}></div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '0.92rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>August 7, 2026</p>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1.4rem' }}>Yerevan, Armenia</p>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.82)', maxWidth: '380px', margin: '0 auto 1.5rem' }}>We can't wait to celebrate with you.</p>
            <button onClick={() => setIsRsvpModalOpen(true)} style={{ padding: '0.85rem 2.6rem', background: 'linear-gradient(180deg, var(--gold-light), var(--gold))', border: 'none', borderRadius: '50px', color: 'var(--leather)', fontFamily: 'var(--sans)', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '1.8rem' }}>
              Kindly RSVP
            </button>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.2rem' }}>
              Our official hashtag is <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>#Renalat</span>
            </p>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>© 2026 Aren &amp; Talar</p>
          </div>
        </footer>
      </div>

      {/* RSVP Modal */}
      <div className={`rsvp-modal-overlay ${isRsvpModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsRsvpModalOpen(false) }}>
        <div className="rsvp-modal">
          <button className="rsvp-modal-close" onClick={() => setIsRsvpModalOpen(false)}>✕</button>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>Respond</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>RSVP</h2>
            <p style={{ color: 'var(--taupe)', fontSize: '0.85rem' }}>Please let us know by June 15, 2026</p>
          </div>
          
          <form onSubmit={handleRsvpSubmit} className="rsvp-form" style={{ maxWidth: '540px', margin: '0 auto' }}>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, marginBottom: '0.4rem' }}>Will you be attending?</label>
              <div className="radio-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="attending" value="yes" required /> <span>Joyfully attending</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="attending" value="no" required /> <span>Regretfully cannot attend</span>
                </label>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" htmlFor="rsvp-name" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, marginBottom: '0.4rem' }}>Full Name</label>
              <input type="text" id="rsvp-name" name="name" className="form-input" style={{ width: '100%', padding: '0.72rem 1.1rem', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '8px' }} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, marginBottom: '0.4rem' }}>Who else will be attending with you?</label>
              <div id="guest-list"></div>
              <button type="button" onClick={addGuest} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.7rem', marginTop: '0.5rem' }}>+ Add another guest</button>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" htmlFor="rsvp-song" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, marginBottom: '0.4rem' }}>Song request <span style={{ fontSize: '0.6rem', color: 'var(--taupe)', fontStyle: 'italic' }}>(optional)</span></label>
              <textarea id="rsvp-song" name="song" className="form-textarea" rows={1} style={{ width: '100%', padding: '0.72rem 1.1rem', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '8px', resize: 'vertical' }} placeholder="What will get you on the dance floor?…"></textarea>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, marginBottom: '0.4rem' }}>Will you be traveling from outside Armenia?</label>
              <div className="radio-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="traveling" value="yes" /> <span>Yes</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="traveling" value="no" /> <span>No</span>
                </label>
              </div>
            </div>
            
            <div className="form-group conditional-field" id="travelFromGroup" style={{ display: 'none', marginBottom: '1.2rem' }}>
              <label className="form-label" htmlFor="rsvp-travel-from" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, marginBottom: '0.4rem' }}>Where will you be traveling from?</label>
              <input type="text" id="rsvp-travel-from" name="travelingFrom" className="form-input" style={{ width: '100%', padding: '0.72rem 1.1rem', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '8px' }} />
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button type="submit" className="form-submit" style={{ padding: '0.85rem 2.8rem', background: 'linear-gradient(180deg, var(--gold-light), var(--gold))', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Submit RSVP
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Show/hide travel from field based on radio selection */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('input[name="traveling"]').forEach(radio => {
            radio.addEventListener('change', function() {
              const travelGroup = document.getElementById('travelFromGroup');
              if (travelGroup) {
                travelGroup.style.display = this.value === 'yes' ? 'block' : 'none';
              }
            });
          });
        `
      }} />
    </>
  )
}
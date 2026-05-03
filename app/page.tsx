// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <WeddingInvitation />;
}

function WeddingInvitation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        setScrolled(heroBottom < 80);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <div className="orb orb-5"></div>
      </div>
      
      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
        <ul className="nav-links">
          <li><a href="#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>Wedding Day</a></li>
          <li><a href="#dresscode" onClick={(e) => { e.preventDefault(); scrollToSection('dresscode'); }}>Dress Code</a></li>
          <li><a href="#gifts" onClick={(e) => { e.preventDefault(); scrollToSection('gifts'); }}>Gifts</a></li>
          <li><a href="#travel" onClick={(e) => { e.preventDefault(); scrollToSection('travel'); }}>Travel</a></li>
          <li><a href="#faqs" onClick={(e) => { e.preventDefault(); scrollToSection('faqs'); }}>FAQs</a></li>
        </ul>
      </nav>
      
      {/* Mobile Menu Button */}
      <button className={`mobile-menu-btn ${scrolled ? 'scrolled' : ''}`} onClick={handleMobileMenuToggle} aria-label="Open navigation menu">
        <span></span><span></span><span></span>
      </button>
      
      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-scrim ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={closeMobileMenu}>✕</button>
        <a href="#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>Wedding Day</a>
        <a href="#dresscode" onClick={(e) => { e.preventDefault(); scrollToSection('dresscode'); }}>Dress Code</a>
        <a href="#gifts" onClick={(e) => { e.preventDefault(); scrollToSection('gifts'); }}>Gifts</a>
        <a href="#travel" onClick={(e) => { e.preventDefault(); scrollToSection('travel'); }}>Travel</a>
        <a href="#faqs" onClick={(e) => { e.preventDefault(); scrollToSection('faqs'); }}>FAQs</a>
      </div>
      
      <div className="page-content">
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <DressCodeSection />
        <GiftsSection />
        <TravelSection />
        <FAQsSection />
        <FooterSection />
        <RSVPModal />
      </div>
      
      <div id="copyToast" className="copy-toast" role="status">Copied ✓</div>
    </>
  );
}

function HeroSection() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const front = document.getElementById('cardFront');
      if (front) front.style.setProperty('--front-img', `url('${ev.target?.result}')`);
    };
    reader.readAsDataURL(file);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <section className="hero" id="hero">
      <div className="flip-card-container" id="cardContainer" tabIndex={0}>
        <div className="flip-card" id="flipCard" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.6s ease' }}>
          <div className="flip-card-front" id="cardFront">
            <div className="card-glare" id="cardGlare"></div>
            <div className="upload-btn-wrap" onClick={(e) => e.stopPropagation()}>
              <label className="upload-btn" htmlFor="photoUpload">
                <svg viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" fill="none" strokeWidth="1.5" />
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" fill="none" strokeWidth="1.5" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </label>
              <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoUpload} />
            </div>
            <p className="front-names"><span className="name-part">Aren</span><span className="amp">&amp;</span><span className="name-part">Talar</span></p>
            <p className="front-date-overlay">August 7, 2026</p>
            <button className="front-hint" type="button" onClick={flipCard}>
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" fill="none" strokeWidth="1.5" /></svg>
              Tap to open
            </button>
          </div>
          <div className="flip-card-back">
            <div className="back-content">
              <p className="back-monogram">Together with their families</p>
              <h1 className="back-names"><span className="name-part">Aren Reisian</span><span className="amp">&amp;</span><span className="name-part">Talar Mazloumian</span></h1>
              <p className="back-subtitle">invite you to celebrate their wedding on</p>
              <p className="back-main-date">Friday, August 7, 2026</p>
              <div className="back-events-grid">
                <div className="back-event-col">
                  <p className="back-event-label">Ceremony at <span className="back-time-inline">4:00 <sup>PM</sup></span></p>
                  <p className="back-event-venue">Saint Gayane Church</p>
                  <p className="back-event-location">Vagharshapat, Armenia</p>
                </div>
                <div className="back-event-divider"><span className="back-divider-diamond">&#9670;</span></div>
                <div className="back-event-col">
                  <p className="back-event-label">Reception at <span className="back-time-inline">5:30 <sup>PM</sup></span></p>
                  <p className="back-event-venue">Jellyfish Restaurant</p>
                  <p className="back-event-location">Yerevan, Armenia</p>
                </div>
              </div>
            </div>
            <img className="back-discobowl" src="/discobowl.svg" alt="" />
            <button className="back-flip-hint" type="button" onClick={flipCard}>Flip back</button>
          </div>
        </div>
      </div>
      <div className="hero-below">
        <p className="hero-rsvp-sentence">
          We can't wait to celebrate with you<span className="desktop-sep"> &middot; </span>
          <br className="mobile-br" />
          <span style={{ display: 'inline-block' }}>
            Kindly <a href="javascript:void(0)" className="rsvp-inline" onClick={() => {
              const event = new CustomEvent('openRSVPModal');
              window.dispatchEvent(event);
            }}>RSVP</a> by June 15th
          </span>
        </p>
        <p className="hero-countdown-text" id="countdownRow">
          <span className="cd-num" id="cd-days">000</span> days,
          <span className="cd-num" id="cd-hours">00</span> hours,
          <span className="cd-num" id="cd-mins">00</span> minutes &amp;
          <span className="cd-num" id="cd-secs">00</span> seconds to go
        </p>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-inner">
          <div className="about-ornament-top">
            <span className="about-line"></span>
            <span className="about-diamond">&#9670;</span>
            <span className="about-line"></span>
          </div>
          <h2 className="embossed about-title">
            <span className="about-title-full">We're getting married in Armenia</span>
            <span className="about-title-mobile">We're getting married</span>
          </h2>
          <p className="about-lead">We're bringing our favorite people from all over the world together for one unforgettable weekend in Yerevan.</p>
          <p className="about-scroll">
            <svg className="scroll-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="7" y="3" width="10" height="18" rx="5" />
              <line x1="12" y1="7" x2="12" y2="11" />
            </svg>
            Scroll for all the details you need to know
          </p>
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  return (
    <section id="events">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Wedding Day</p>
          <h2 className="embossed">Wedding Day</h2>
          <p className="section-date">Friday, August 7, 2026</p>
        </div>
        <div className="event-row">
          <div className="event-card">
            <p className="event-label">4:00 &ndash; 5:00 PM</p>
            <h3 className="event-title">Ceremony</h3>
            <p className="event-note">A traditional ceremony in one of the most beautiful historic churches.</p>
            <p className="event-detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="event-venue-block">
                <span className="event-venue-name">Saint Gayane Church</span>
                <span className="event-venue-address">Vagharshapat, Armenia</span>
                <span className="event-venue-distance">~20 km / 12 mi from Yerevan center</span>
              </span>
            </p>
            <a href="https://maps.google.com/?q=Saint+Gayane+Church+Etchmiadzin" target="_blank" className="btn-outline event-map-btn">View Map &rarr;</a>
          </div>
          <div className="event-map-panel">
            <div className="event-image-layer" style={{ backgroundImage: "url('https://hyurservice.com/images/attractions/1/16117743401225/hqdefault.webp')" }}></div>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.5!2d44.2906!3d40.1614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abd!2sSaint%20Gayane%20Church!5e0!3m2!1sen!2sam!4v1700000000000" loading="lazy"></iframe>
          </div>
        </div>
        <div className="event-row map-left">
          <div className="event-card">
            <p className="event-label">5:30 &ndash; 7:00 PM</p>
            <h3 className="event-title">Cocktail Hour</h3>
            <p className="event-note">Drinks, bites, and time to mingle before the party begins. You'll be indoors!</p>
            <p className="event-detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="event-venue-block">
                <span className="event-venue-name">Jellyfish Restaurant (Indoor)</span>
                <span className="event-venue-address">Yerevan, Armenia</span>
                <span className="event-venue-distance">~2 km / 1.2 mi from city center</span>
              </span>
            </p>
            <a href="https://maps.google.com/?q=Jellyfish+Restaurant+Yerevan" target="_blank" className="btn-outline event-map-btn">View Map &rarr;</a>
          </div>
          <div className="event-map-panel">
            <div className="event-image-layer" style={{ backgroundImage: "url('https://static.ucraft.net/fs/ucraft/userFiles/jellyfish/images/r1069-restaurant-iamge-1-17119875498648.webp?v=1711987686')" }}></div>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.2!2d44.5085!3d40.1852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abcf94f!2sYerevan!5e0!3m2!1sen!2sam!4v1700000000001" loading="lazy"></iframe>
          </div>
        </div>
        <div className="event-row">
          <div className="event-card">
            <p className="event-label">7:00 PM &ndash; 1:00 AM</p>
            <h3 className="event-title">Reception</h3>
            <p className="event-note">Dinner, dancing, and a full night of celebration.</p>
            <p className="event-detail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="event-venue-block">
                <span className="event-venue-name">Jellyfish Restaurant (Outdoor)</span>
                <span className="event-venue-address">Yerevan, Armenia</span>
                <span className="event-venue-distance">Same venue as cocktail hour</span>
              </span>
            </p>
            <a href="https://maps.google.com/?q=Jellyfish+Restaurant+Yerevan" target="_blank" className="btn-outline event-map-btn">View Map &rarr;</a>
          </div>
          <div className="event-map-panel">
            <div className="event-image-layer" style={{ backgroundImage: "url('https://static.ucraft.net/fs/ucraft/userFiles/jellyfish/images/r1194-events-landing-copy-1-17126753439126.webp?v=1712675362')" }}></div>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.2!2d44.5085!3d40.1852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abcf94f!2sYerevan!5e0!3m2!1sen!2sam!4v1700000000002" loading="lazy"></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

function DressCodeSection() {
  return (
    <section id="dresscode">
      <div className="container">
        <div className="section-header">
          <p className="section-label">What to Wear</p>
          <h2 className="embossed">Dress Code</h2>
        </div>
        <div className="dresscode-grid">
          <div className="dresscode-card">
            <div className="dresscode-icon"><svg viewBox="0 0 24 24"><path d="M12 2l3 5h5l-4 4 2 6-6-3-6 3 2-6-4-4h5l3-5z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
            <h3>Outdoor Formal</h3>
            <p>Think elevated, but comfortable for a summer evening.</p>
          </div>
          <div className="dresscode-card">
            <div className="dresscode-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
            <h3>Summer Tones</h3>
            <p>Light colors, soft tones, and breathable fabrics are your best friend.</p>
          </div>
          <div className="dresscode-card">
            <div className="dresscode-icon"><svg viewBox="0 0 24 24"><path d="M17 8C17 5.24 14.76 3 12 3S7 5.24 7 8c0 3.53 5 10 5 10s5-6.47 5-10z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
            <h3>Chic &amp; Effortless</h3>
            <p>Dress to impress, but make it feel like you.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="https://www.pinterest.com/search/pins/?q=outdoor%20formal&rs=typed" target="_blank" className="pinterest-link">
            <span className="pinterest-row1"><svg className="pinterest-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.39.04-3.42.22-.93 1.4-5.94 1.4-5.94s-.36-.72-.36-1.78c0-1.66.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 4-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.78-2.26 3.78-5.5 0-2.88-2.07-4.89-5.02-4.89-3.42 0-5.43 2.57-5.43 5.22 0 1.03.4 2.14.89 2.74.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.78 2.74-7.25 7.92-7.25 4.16 0 7.39 2.96 7.39 6.93 0 4.13-2.6 7.46-6.22 7.46-1.21 0-2.36-.63-2.75-1.37l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14A12 12 0 1 0 12 0z" /></svg> Looking for outfit ideas? Browse our</span>
            <span className="pinterest-row2"> <span className="pinterest-highlight">Pinterest inspiration</span> &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function GiftsSection() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showWish, setShowWish] = useState(false);
  const [wishMessage, setWishMessage] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const toast = document.getElementById('copyToast');
    if (toast) {
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 1600);
    }
  };

  const sendWish = async () => {
    if (!wishMessage.trim()) {
      alert('Please write a message first.');
      return;
    }
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: wishMessage, timestamp: new Date().toISOString() })
      });
      if (response.ok) {
        alert('Thank you for your message! 💛');
        setWishMessage('');
        setShowWish(false);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending wish:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="gifts">
      <div className="container">
        <div className="section-header">
          <p className="section-label">With Gratitude</p>
          <h2 className="embossed">Gifts</h2>
        </div>
        <div className="gifts-content">
          <p>Your presence is the greatest gift. If you'd like to contribute to our next chapter, we've provided details below.</p>
          <div className="gift-accordion-group">
            <div className={`accordion gift-accordion ${openAccordion === 'amd' ? 'open' : ''}`}>
              <button className="accordion-header" onClick={() => toggleAccordion('amd')}>
                <span className="gift-header-inner">
                  <span className="gift-flag">🇦🇲</span>
                  <span className="gift-header-text">
                    <span className="gift-header-currency">AMD Account</span>
                    <span className="gift-header-bank">Ameria Bank</span>
                  </span>
                </span>
                <span className="accordion-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="2,5 7,9 12,5" /></svg></span>
              </button>
              <div className="accordion-body">
                <div className="bank-detail"><span className="bank-detail-label">Account Holder</span><span className="bank-detail-value copyable" onClick={() => copyToClipboard('Talar Mazloumian')}>Talar Mazloumian</span></div>
                <div className="bank-detail"><span className="bank-detail-label">Card Number</span><span className="bank-detail-value copyable" onClick={() => copyToClipboard('4083060096484528')}>4083 0600 9648 4528</span></div>
              </div>
            </div>
            <div className={`accordion gift-accordion ${openAccordion === 'usd' ? 'open' : ''}`}>
              <button className="accordion-header" onClick={() => toggleAccordion('usd')}>
                <span className="gift-header-inner">
                  <span className="gift-flag">🇺🇸</span>
                  <span className="gift-header-text">
                    <span className="gift-header-currency">USD Account</span>
                    <span className="gift-header-bank">Venmo</span>
                  </span>
                </span>
                <span className="accordion-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="2,5 7,9 12,5" /></svg></span>
              </button>
              <div className="accordion-body">
                <div className="bank-detail"><span className="bank-detail-label">Account</span><span className="bank-detail-value copyable" onClick={() => copyToClipboard('Talar-Mazloumian')}>@Talar-Mazloumian</span></div>
                <div className="bank-detail"><span className="bank-detail-label">Phone</span><span className="bank-detail-value copyable" onClick={() => copyToClipboard('+4155184724')}>+1 (415) 518-4724</span></div>
                <a href="https://account.venmo.com/u/Talar-Mazloumian" target="_blank" className="gift-link-btn">Open in Venmo</a>
              </div>
            </div>
            <div className={`accordion gift-accordion ${openAccordion === 'egp' ? 'open' : ''}`}>
              <button className="accordion-header" onClick={() => toggleAccordion('egp')}>
                <span className="gift-header-inner">
                  <span className="gift-flag">🇪🇬</span>
                  <span className="gift-header-text">
                    <span className="gift-header-currency">EGP Account</span>
                    <span className="gift-header-bank">Instapay</span>
                  </span>
                </span>
                <span className="accordion-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="2,5 7,9 12,5" /></svg></span>
              </button>
              <div className="accordion-body">
                <div className="bank-detail"><span className="bank-detail-label">Account</span><span className="bank-detail-value copyable" onClick={() => copyToClipboard('talararen@instapay')}>talararen@instapay</span></div>
                <a href="https://ipn.eg/C/Q/talararen/instapay" target="_blank" className="gift-link-btn">Pay via Instapay</a>
              </div>
            </div>
          </div>
          <div className="wish-section">
            {!showWish ? (
              <button className="wish-toggle" onClick={() => setShowWish(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
                Write a Wish or Message
              </button>
            ) : (
              <div className="wish-panel open">
                <textarea className="wish-textarea" value={wishMessage} onChange={(e) => setWishMessage(e.target.value)} placeholder="Write your message to Aren &amp; Talar…"></textarea>
                <div className="wish-actions">
                  <button className="wish-btn wish-btn-cancel" onClick={() => setShowWish(false)}>Close</button>
                  <button className="wish-btn wish-btn-send" onClick={sendWish}>Send Message</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TravelSection() {
  return (
    <section id="travel">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Getting There</p>
          <h2 className="embossed">Travel &amp; Explore</h2>
          <p>We're so excited to have you in Armenia. Here's everything you need.</p>
        </div>
        <div className="travel-grid travel-grid-3">
          <div className="travel-block">
            <div className="travel-block-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              <h3>Getting Around</h3>
            </div>
            <div className="travel-item"><p className="travel-item-title">Zvartnots International Airport (EVN)</p><p className="travel-item-desc">Yerevan's main airport, about 20 minutes from the city center.</p></div>
            <div className="travel-item"><p className="travel-item-title">Money &amp; Payments</p><p className="travel-item-desc">Cards are widely accepted, but having some local cash (AMD) is helpful for taxis and smaller spots.</p></div>
            <div className="travel-item"><p className="travel-item-title">Transportation</p><p className="travel-item-desc">We recommend using the GG Taxi app — Armenia's version of Uber — for quick, affordable, and reliable rides.</p></div>
          </div>
          <div className="travel-block">
            <div className="travel-block-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <h3>Where to Stay</h3>
            </div>
            <div className="travel-item hotel-item"><a href="https://www.wyndhamhotels.com/ramada/yerevan-armenia/ramada-by-wyndham-yerevan/overview" target="_blank" className="hotel-link">Ramada by Wyndham</a><p className="hotel-rate-mobile">58,000 AMD / night · Double room</p></div>
            <div className="travel-item hotel-item"><a href="https://www.ihg.com/holidayinn/hotels/us/en/yerevan/evnha/hoteldetail" target="_blank" className="hotel-link">Holiday Inn Republic Square</a><p className="hotel-rate-mobile">58,000 AMD / night · Double room</p></div>
            <div className="travel-item hotel-item"><a href="https://www.marriott.com/en-us/hotels/evnry-courtyard-yerevan/overview/" target="_blank" className="hotel-link">Courtyard by Marriott</a><p className="hotel-rate-mobile">62,000 AMD / night · Double room</p></div>
            <div className="travel-item hotel-item"><a href="https://all.accor.com/hotel/9514/index.en.shtml" target="_blank" className="hotel-link">ibis Yerevan Center</a><p className="hotel-rate-mobile">43,000 AMD / night · Double room</p></div>
          </div>
          <div className="travel-block">
            <div className="travel-block-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              <h3>Explore Armenia</h3>
            </div>
            <div className="travel-item"><p className="travel-item-desc">If you're staying a little longer, it's absolutely worth exploring beyond the city.</p></div>
          </div>
        </div>
        <ExploreSection />
      </div>
    </section>
  );
}

function ExploreSection() {
  const [activeTab, setActiveTab] = useState('all');
  const categories = ['all', 'sights', 'cafes', 'restaurants', 'nightlife'];

  const places = [
    { name: 'Cascade Complex', desc: 'Iconic landmark with sunset views of Mt. Ararat.', category: 'sights', image: 'https://images.unsplash.com/photo-1559588232-aa14e88f9bd3?w=600&q=80' },
    { name: 'Republic Square', desc: 'The heart of Yerevan with dancing fountains.', category: 'sights', image: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=600&q=80' },
    { name: 'Vernissage Market', desc: 'Weekend market for jewelry, art, and rugs.', category: 'sights', image: 'https://images.unsplash.com/photo-1601779331600-ed5b0c93edcb?w=600&q=80' },
    { name: 'Lumen Coffee', desc: 'Specialty coffee in a stylish setting.', category: 'cafes', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
    { name: 'Jazzve', desc: 'Local Armenian coffee chain. People-watch outside.', category: 'cafes', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80' },
    { name: 'Dolmama', desc: 'Refined Armenian cuisine in a historic building.', category: 'restaurants', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
    { name: 'Sherep', desc: 'Modern Armenian dishes with open kitchen.', category: 'restaurants', image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80' },
    { name: 'The Club', desc: 'Inventive cocktails and late-night vibes.', category: 'nightlife', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80' },
    { name: 'Calumet Ethnic Lounge Bar', desc: 'Cozy spot with local musicians.', category: 'nightlife', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80' }
  ];

  const filteredPlaces = activeTab === 'all' ? places : places.filter(p => p.category === activeTab);

  return (
    <div className="explore-subsection">
      <div className="section-header">
        <p className="section-label">Explore Yerevan</p>
        <h2 className="embossed" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>Make the most of your time here</h2>
      </div>
      <div className="explore-tabs" role="tablist">
        {categories.map(cat => (
          <button key={cat} className={`explore-tab ${activeTab === cat ? 'active' : ''}`} role="tab" onClick={() => setActiveTab(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="explore-grid">
        {filteredPlaces.map((place, i) => (
          <a key={i} href="https://www.visityerevan.am" target="_blank" className="explore-card" style={{ backgroundImage: `url(${place.image})` }}>
            <div className="explore-card-content">
              <h4>{place.name}</h4>
              <p>{place.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function FAQsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const faqs = [
    { q: 'When should I RSVP by?', a: 'June 15, 2026' },
    { q: 'Where should I stay?', a: 'Yerevan city center is the most convenient. Check the Travel section for special hotel rates.' },
    { q: 'Can I bring a plus one?', a: 'Yes! Let\'s all celebrate together — just please add their full name in the RSVP.' },
    { q: 'What\'s the dress code?', a: 'Outdoor formal. Think elevated but comfortable for a summer evening.' },
    { q: 'Will events be outdoors?', a: 'The ceremony and cocktail hour are indoors, and the reception will be outdoors.' },
    { q: 'What time should I arrive?', a: 'Please arrive at least 15–20 minutes before the ceremony.' }
  ];

  const next = () => setCurrentIndex((currentIndex + 1) % faqs.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + faqs.length) % faqs.length);

  return (
    <section id="faqs">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Questions</p>
          <h2 className="embossed">FAQs</h2>
        </div>
        <div className="faq-carousel">
          <button className="faq-arrow faq-prev" onClick={prev}>←</button>
          <div className="faq-track">
            <div className="faq-card">
              <p className="faq-q">{faqs[currentIndex].q}</p>
              <p className="faq-a">{faqs[currentIndex].a}</p>
            </div>
          </div>
          <button className="faq-arrow faq-next" onClick={next}>→</button>
        </div>
        <div className="faq-dots">
          {faqs.map((_, i) => (
            <button key={i} className={`faq-dot ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-names">Aren &amp; Talar</p>
        <div className="footer-divider"></div>
        <p className="footer-date">August 7, 2026</p>
        <p className="footer-location">Yerevan, Armenia</p>
        <p className="footer-note">We can't wait to celebrate with you.</p>
        <button className="footer-rsvp" onClick={() => {
          const event = new CustomEvent('openRSVPModal');
          window.dispatchEvent(event);
        }}>Kindly RSVP</button>
        <p className="footer-hashtag-line">Our official hashtag is <span className="footer-hashtag-bold">#Renalat</span></p>
        <p className="footer-copy">&copy; 2026 Aren &amp; Talar</p>
      </div>
    </footer>
  );
}

function RSVPModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attending, setAttending] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [guests, setGuests] = useState<string[]>([]);
  const [song, setSong] = useState('');
  const [traveling, setTraveling] = useState<string | null>(null);
  const [travelFrom, setTravelFrom] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openRSVPModal', handleOpen);
    return () => window.removeEventListener('openRSVPModal', handleOpen);
  }, []);

  const addGuest = () => setGuests([...guests, '']);
  const removeGuest = (index: number) => setGuests(guests.filter((_, i) => i !== index));
  const updateGuest = (index: number, value: string) => {
    const newGuests = [...guests];
    newGuests[index] = value;
    setGuests(newGuests);
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!attending) newErrors.attending = true;
    if (!name.trim()) newErrors.name = true;
    guests.forEach((g, i) => { if (!g.trim()) newErrors[`guest_${i}`] = true; });
    if (!traveling) newErrors.traveling = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attending: attending === 'yes',
          name: name.trim(),
          guests: guests.filter(g => g.trim()),
          song: song.trim(),
          traveling: traveling === 'yes',
          travelFrom: traveling === 'yes' ? travelFrom.trim() : '',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setAttending(null);
        setName('');
        setGuests([]);
        setSong('');
        setTraveling(null);
        setTravelFrom('');
        setErrors({});
      } else {
        alert('Failed to submit RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to submit RSVP. Please try again.');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmitted(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className={`rsvp-modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="rsvp-modal">
        <button className="rsvp-modal-close" onClick={closeModal}>✕</button>
        {!submitted ? (
          <>
            <div className="section-header">
              <p className="section-label">Respond</p>
              <h2 className="embossed">RSVP</h2>
              <p>Please let us know by June 15, 2026</p>
            </div>
            <form className="rsvp-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Will you be attending?</label>
                <div className="radio-group">
                  <label className="radio-option"><input type="radio" name="attending" value="yes" checked={attending === 'yes'} onChange={() => setAttending('yes')} /> <span>Joyfully attending</span></label>
                  <label className="radio-option"><input type="radio" name="attending" value="no" checked={attending === 'no'} onChange={() => setAttending('no')} /> <span>Regretfully cannot attend</span></label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-name">Full Name</label>
                <input type="text" id="rsvp-name" className={`form-input ${errors.name ? 'form-error' : ''}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name…" />
              </div>
              <div className="form-group">
                <label className="form-label">Who else will be attending with you?</label>
                <div id="guest-list">
                  {guests.map((guest, i) => (
                    <div key={i} className="guest-row">
                      <input type="text" className={`form-input ${errors[`guest_${i}`] ? 'form-error' : ''}`} value={guest} onChange={(e) => updateGuest(i, e.target.value)} placeholder={`Guest ${i + 1} full name…`} />
                      <button type="button" className="guest-remove" onClick={() => removeGuest(i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button type="button" className="add-guest-btn" onClick={addGuest}>+ Add another guest</button>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="rsvp-song">Song request <span className="optional-tag">(optional)</span></label>
                <textarea id="rsvp-song" className="form-textarea" value={song} onChange={(e) => setSong(e.target.value)} placeholder="What will get you on the dance floor?…"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Will you be traveling from outside Armenia?</label>
                <div className="radio-group">
                  <label className="radio-option"><input type="radio" name="traveling" value="yes" checked={traveling === 'yes'} onChange={() => setTraveling('yes')} /> <span>Yes</span></label>
                  <label className="radio-option"><input type="radio" name="traveling" value="no" checked={traveling === 'no'} onChange={() => setTraveling('no')} /> <span>No</span></label>
                </div>
              </div>
              {traveling === 'yes' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="rsvp-travel-from">Where will you be traveling from?</label>
                  <input type="text" id="rsvp-travel-from" className="form-input" value={travelFrom} onChange={(e) => setTravelFrom(e.target.value)} placeholder="City and country…" />
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="form-submit" type="submit">Submit RSVP</button>
              </div>
            </form>
          </>
        ) : (
          <div className="rsvp-confirm show" style={{ display: 'flex' }}>
            <div className="rsvp-confirm-icon">
              <svg viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="34" stroke="#C4A265" strokeWidth="2.5" />
                <polyline points="20,37 31,48 52,26" stroke="#C4A265" strokeWidth="3" />
              </svg>
            </div>
            <p className="rsvp-confirm-msg">
              Thank you so much for your RSVP,<br />we can't wait to celebrate with you ✨<br /><br />See you on the dance floor 💃🕺
            </p>
            <button className="form-submit" style={{ marginTop: '1.8rem' }} onClick={closeModal}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function updateCountdown() {
  const target = new Date('2026-08-07T16:00:00+04:00');
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    const row = document.getElementById('countdownRow');
    if (row) row.textContent = 'Today is the day!';
    return;
  }
  const days = document.getElementById('cd-days');
  const hours = document.getElementById('cd-hours');
  const mins = document.getElementById('cd-mins');
  const secs = document.getElementById('cd-secs');
  if (days) days.textContent = Math.floor(diff / 86400000).toString().padStart(3, '0');
  if (hours) hours.textContent = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
  if (mins) mins.textContent = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
  if (secs) secs.textContent = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
}
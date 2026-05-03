'use client';

import { useState, useEffect } from 'react';

export default function Navbar({ onOpenRSVP }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      const heroBottom = hero?.getBoundingClientRect().bottom || 0;
      setScrolled(heroBottom < 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#events', label: 'Wedding Day' },
    { href: '#dresscode', label: 'Dress Code' },
    { href: '#gifts', label: 'Gifts' },
    { href: '#travel', label: 'Travel' },
    { href: '#faqs', label: 'FAQs' },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .nav {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2.2rem;
          height: 38px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.35));
          backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 50px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.5s ease;
        }
        .nav.scrolled {
          border-color: rgba(255, 255, 255, 1);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          list-style: none;
          white-space: nowrap;
        }
        .nav-links a {
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 500;
          color: var(--cacao);
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
          transition: color 0.25s ease;
        }
        .nav-links a:hover {
          color: #1E1510;
        }
        @media (max-width: 768px) {
          .nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
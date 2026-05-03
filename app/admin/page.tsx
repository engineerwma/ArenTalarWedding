// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface RSVPEntry {
  Timestamp: string;
  Attending: string;
  'Full Name': string;
  Guests: string;
  'Song Request': string;
  'Traveling From Abroad': string;
  'Travel From Location': string;
}

interface WishEntry {
  Timestamp: string;
  Message: string;
}

export default function AdminPage() {
  const [rsvpData, setRsvpData] = useState<RSVPEntry[]>([]);
  const [wishesData, setWishesData] = useState<WishEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'wishes'>('rsvp');
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const ADMIN_PASSWORD = 'Renalat2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchData();
    } else {
      alert('Incorrect password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rsvpRes, wishesRes] = await Promise.all([
        fetch('/api/rsvp'),
        fetch('/api/wishes')
      ]);
      const rsvpJson = await rsvpRes.json();
      const wishesJson = await wishesRes.json();
      if (rsvpJson.success) setRsvpData(rsvpJson.data);
      if (wishesJson.success) setWishesData(wishesJson.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async (type: 'rsvp' | 'wishes') => {
    const response = await fetch(`/api/export?type=${type}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(150deg, #F5EDE4 0%, #E8DDD2 100%)',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(20px)',
          padding: '2.5rem',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#4D403A', marginBottom: '1.5rem' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                padding: '0.75rem 1rem',
                width: '250px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.3)',
                marginBottom: '1rem',
                fontSize: '1rem'
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                padding: '0.75rem 2rem',
                background: '#4D403A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #F5EDE4 0%, #E8DDD2 100%)',
      padding: '2rem',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ color: '#4D403A', fontFamily: 'Playfair Display, serif' }}>Wedding Admin Dashboard</h1>
          <button
            onClick={() => setAuthenticated(false)}
            style={{
              padding: '0.5rem 1rem',
              background: '#A3968D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('rsvp')}
            style={{
              padding: '0.75rem 2rem',
              background: activeTab === 'rsvp' ? '#4D403A' : 'rgba(255,255,255,0.3)',
              color: activeTab === 'rsvp' ? 'white' : '#4D403A',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            RSVPs ({rsvpData.length})
          </button>
          <button
            onClick={() => setActiveTab('wishes')}
            style={{
              padding: '0.75rem 2rem',
              background: activeTab === 'wishes' ? '#4D403A' : 'rgba(255,255,255,0.3)',
              color: activeTab === 'wishes' ? 'white' : '#4D403A',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Wishes ({wishesData.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
        ) : (
          <>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>Total {activeTab === 'rsvp' ? 'RSVPs' : 'Wishes'}:</strong> {activeTab === 'rsvp' ? rsvpData.length : wishesData.length}
              </div>
              <button
                onClick={() => downloadExcel(activeTab)}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#C4A265',
                  color: '#4D403A',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Download Excel
              </button>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              overflowX: 'auto',
              padding: '1rem'
            }}>
              {activeTab === 'rsvp' ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(77,64,58,0.2)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Attending</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Guests</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Song</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Traveling</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>From</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpData.map((rsvp, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(77,64,58,0.1)' }}>
                        <td style={{ padding: '0.75rem' }}>{new Date(rsvp.Timestamp).toLocaleDateString()}</td>
                        <td style={{ padding: '0.75rem' }}>{rsvp.Attending}</td>
                        <td style={{ padding: '0.75rem' }}>{rsvp['Full Name']}</td>
                        <td style={{ padding: '0.75rem' }}>{rsvp.Guests || '-'}</td>
                        <td style={{ padding: '0.75rem' }}>{rsvp['Song Request'] || '-'}</td>
                        <td style={{ padding: '0.75rem' }}>{rsvp['Traveling From Abroad']}</td>
                        <td style={{ padding: '0.75rem' }}>{rsvp['Travel From Location'] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(77,64,58,0.2)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishesData.map((wish, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(77,64,58,0.1)' }}>
                        <td style={{ padding: '0.75rem' }}>{new Date(wish.Timestamp).toLocaleDateString()}</td>
                        <td style={{ padding: '0.75rem' }}>{wish.Message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
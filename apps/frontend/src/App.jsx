import React, { useState, useEffect } from 'react'
import Walkthrough from './Walkthrough'
import LanguageSelector from './LanguageSelector'
import PollingBoothLocator from './PollingBoothLocator'
import Countdown from './Countdown'
import { useLanguage } from './LanguageContext'
import './index.css'

function App() {
  const { t, speak, stopSpeaking, isReading } = useLanguage();
  const [timeline, setTimeline] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check network status
    window.addEventListener('offline', () => setIsOffline(true));
    window.addEventListener('online', () => setIsOffline(false));
    if (!navigator.onLine) setIsOffline(true);

    // Fetch from Backend API
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => setTimeline(data.phases))
      .catch(err => {
        console.error('Failed to fetch timeline:', err);
        // Fallback to offline cached data
        setTimeline([
          { phase: 1, date: 'April 10, 2026' },
          { phase: 2, date: 'April 18, 2026' },
          { results: 'May 15, 2026' }
        ]);
      });
  }, []);

  const toggleReading = () => {
    if (isReading) {
      stopSpeaking();
    } else {
      speak(`${t.title}. ${t.subtitle}`);
    }
  };

  return (
    <div className="app-container">
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <LanguageSelector />
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          <span style={{ color: 'var(--color-primary)' }}>IN</span> {t.title.replace('🇮🇳 ', '')}
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#4a5568', margin: '0 0 24px 0' }}>{t.subtitle}</p>
        
        <button 
          className="btn" 
          onClick={toggleReading}
          style={{ 
            background: isReading ? 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)' : '#edf2f7', 
            color: isReading ? '#fff' : '#2d3748', 
            marginTop: '0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}
        >
          {isReading ? `🔇 ${t.stopReading.replace('🔇 ', '')}` : `🔊 ${t.readToMe.replace('🔊 ', '')}`}
        </button>
      </header>

      <main>
        {isOffline && (
          <div className="card" style={{ background: 'linear-gradient(135deg, #fefcbf 0%, #faf089 100%)', padding: '16px', textAlign: 'center', color: '#744210', fontWeight: 'bold' }}>
            ⚠️ Offline Mode: Showing saved data.
          </div>
        )}

        <Countdown />

        <Walkthrough />
        
        <PollingBoothLocator />
        
        <div className="card" style={{ background: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)', border: 'none' }}>
          <h3 style={{ color: '#2b6cb0' }}>📅 {t.importantDates}</h3>
          {!timeline ? (
            <div style={{ textAlign: 'center', color: '#4a5568', padding: '20px' }}>Loading...</div>
          ) : (
            <ul className="custom-list">
              <li>Phase 1: {timeline[0]?.date || 'April 10, 2026'}</li>
              <li>Phase 2: {timeline[1]?.date || 'April 18, 2026'}</li>
              <li style={{ borderLeftColor: 'var(--color-primary)' }}><strong>Results: {timeline[2]?.results || 'May 15, 2026'}</strong></li>
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default App

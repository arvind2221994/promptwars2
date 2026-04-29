import React, { useState, useEffect } from 'react'
import Walkthrough from './Walkthrough'
import LanguageSelector from './LanguageSelector'
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
    fetch('http://localhost:5000/api/timeline')
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
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <LanguageSelector />
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <button 
          className="btn" 
          onClick={toggleReading}
          style={{ background: isReading ? '#ffcccc' : '#f0f0f0', color: '#333', marginTop: '0' }}
        >
          {isReading ? t.stopReading : t.readToMe}
        </button>
      </header>

      <main>
        {isOffline && (
          <div style={{ background: '#ffcc00', padding: '8px', borderRadius: '4px', textAlign: 'center', marginBottom: '16px', color: '#333', fontWeight: 'bold' }}>
            ⚠️ Offline Mode: Showing saved data.
          </div>
        )}

        <Walkthrough />
        
        <div className="card" style={{ marginTop: '24px', background: '#eef8ff' }}>
          <h3>{t.importantDates}</h3>
          {!timeline ? (
            <p>Loading...</p>
          ) : (
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Phase 1: {timeline[0]?.date || 'April 10, 2026'}</li>
              <li>Phase 2: {timeline[1]?.date || 'April 18, 2026'}</li>
              <li><strong>Results: {timeline[2]?.results || 'May 15, 2026'}</strong></li>
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default App

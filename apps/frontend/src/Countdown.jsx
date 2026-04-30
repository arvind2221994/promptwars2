import React, { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  
  // Set to a future date
  const targetDate = new Date('2026-04-10T00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card" style={{ background: '#2d3748', color: '#fff', textAlign: 'center', padding: '24px 16px' }}>
      <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Countdown to Election Day
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', minWidth: '70px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{timeLeft.days}</div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e0' }}>Days</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', minWidth: '70px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{timeLeft.hours}</div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e0' }}>Hours</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', minWidth: '70px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{timeLeft.minutes}</div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e0' }}>Mins</div>
        </div>
      </div>
    </div>
  );
}

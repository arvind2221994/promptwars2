import React from 'react';
import { useLanguage } from './LanguageContext';
import { locales } from './locales';

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
      {Object.keys(locales).map((key) => (
        <button
          key={key}
          onClick={() => setLang(key)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: lang === key ? '2px solid var(--color-primary)' : '1px solid #ccc',
            background: lang === key ? '#FFF4EB' : '#FFF',
            fontWeight: lang === key ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          {locales[key].languageName}
        </button>
      ))}
    </div>
  );
}

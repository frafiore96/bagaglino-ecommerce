import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <button
        onClick={() => setLanguage('it')}
        className={`lang-btn ${language === 'it' ? 'active' : ''}`}
        title="Italiano"
      >
        🇮🇹
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        title="English"
      >
        🇬🇧
      </button>
    </div>
  );
};

export default LanguageSelector;
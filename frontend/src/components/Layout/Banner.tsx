import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Banner: React.FC = () => {
  const handleBannerClick = () => {
    window.open('https://www.instagram.com/bagaglino_abbigliamento/', '_blank');
  };
  const { t } = useLanguage();

  return (
    <div className="promo-banner" onClick={handleBannerClick}>
      <div className="banner-content">
        <div className="scrolling-text">
          {t('promo_banner_text')}
        </div>
      </div>
    </div>
  );
};

export default Banner;
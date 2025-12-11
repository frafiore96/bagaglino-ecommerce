import React from 'react';

const Banner: React.FC = () => {
  const handleBannerClick = () => {
    window.open('https://www.instagram.com/bagaglino_abbigliamento/', '_blank');
  };

  return (
    <div className="promo-banner" onClick={handleBannerClick}>
      <div className="banner-content">
        <div className="scrolling-text">
          PROMO! SALDI FINO AL 50% NELLO STORE FISICO
        </div>
      </div>
    </div>
  );
};

export default Banner;
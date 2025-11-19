import React, { useEffect, useState } from 'react';

interface WelcomePopupProps {
  userName: string;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ userName, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostra il popup dopo un piccolo delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Nasconde automaticamente dopo 3 secondi
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Aspetta che l'animazione finisca
  };

  return (
    <div 
      className={`welcome-popup-overlay ${isVisible ? 'visible' : ''}`}
      onClick={handleClose}
    >
      <div 
        className={`welcome-popup ${isVisible ? 'visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="welcome-popup-content">
          <h3>Ciao, {userName}!</h3>
          <p>Benvenuto di nuovo su Bagaglino</p>
          <button className="welcome-popup-close" onClick={handleClose}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
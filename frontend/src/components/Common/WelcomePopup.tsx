import React, { useEffect, useState } from 'react';

interface WelcomePopupProps {
  userName: string;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ userName, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the popup after a small delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Hide automatically after 3 seconds
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
    }, 300); // Wait for animation to finish
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
          <h3>Hello, {userName}!</h3>
          <p>Welcome back to Bagaglino</p>
          <button className="welcome-popup-close" onClick={handleClose}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
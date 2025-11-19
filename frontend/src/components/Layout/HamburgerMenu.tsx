import React, { useEffect, useRef } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface HamburgerMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ items, isOpen, onToggle }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button 
        onClick={onToggle}
        className={`hamburger-btn ${isOpen ? 'open' : ''}`}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      {isOpen && (
        <div className="menu-dropdown">
          <ul className="menu-items">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    item.onClick();
                    onToggle();
                  }}
                  className="menu-item"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
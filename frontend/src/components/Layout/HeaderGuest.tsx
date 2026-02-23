import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import { useLanguage } from '../../context/LanguageContext';

const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

const HeaderGuest: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGender, setActiveGender] = useState<string | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const categories = [
    { name: 't-shirt', label: t('t-shirt') },
    { name: 'maglioni', label: t('maglioni') },
    { name: 'giacche', label: t('giacche') },
    { name: 'pantaloni', label: t('pantaloni') },
    { name: 'scarpe', label: t('scarpe') },
    { name: 'camicie', label: t('camicie') },
    { name: 'felpe', label: t('felpe') },
    { name: 'giubbotti', label: t('giubbotti') },
    { name: 'accessori', label: t('accessori') },
  ];

  const menuItems = [
    { label: t('login'), onClick: () => navigate('/login') },
    { label: t('register'), onClick: () => navigate('/register') },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          BAGAGLINO
        </Link>
        
        <div className="header-center">
          <SearchBar />
        </div>
        
        <div className="header-right">
          <LanguageSelector />
          <HamburgerMenu 
            items={menuItems}
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>
      
      <nav className="categories-nav">
        {(['uomo', 'donna', 'unisex'] as const).map((gender) => (
          <div
            key={gender}
            className="gender-menu"
            onMouseEnter={() => !isTouchDevice() && setActiveGender(gender)}
            onMouseLeave={() => !isTouchDevice() && setActiveGender(null)}
          >
            <Link
              to={`/category/${gender}/all`}
              className="category-link"
              onClick={(e) => {
                if (isTouchDevice()) {
                  if (activeGender !== gender) {
                    e.preventDefault();
                    setActiveGender(gender);
                  } else {
                    setActiveGender(null);
                  }
                }
              }}
            >
              {t(gender)}
            </Link>
            {activeGender === gender && (
              <div className="category-dropdown">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${gender}/${category.name}`}
                    className="category-dropdown-item"
                    onClick={() => setActiveGender(null)}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default HeaderGuest;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import { useLanguage } from '../../context/LanguageContext';

const HeaderGuest: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredGender, setHoveredGender] = useState<string | null>(null);
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
        <div 
          className="gender-menu"
          onMouseEnter={() => setHoveredGender('uomo')}
          onMouseLeave={() => setHoveredGender(null)}
        >
          <Link to="/category/uomo/all" className="category-link">{t('uomo')}</Link>
          {hoveredGender === 'uomo' && (
            <div className="category-dropdown">
              {categories.map((category) => (
                <Link 
                  key={category.name} 
                  to={`/category/uomo/${category.name}`} 
                  className="category-dropdown-item"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div 
          className="gender-menu"
          onMouseEnter={() => setHoveredGender('donna')}
          onMouseLeave={() => setHoveredGender(null)}
        >
          <Link to="/category/donna/all" className="category-link">{t('donna')}</Link>
          {hoveredGender === 'donna' && (
            <div className="category-dropdown">
              {categories.map((category) => (
                <Link 
                  key={category.name} 
                  to={`/category/donna/${category.name}`} 
                  className="category-dropdown-item"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div 
          className="gender-menu"
          onMouseEnter={() => setHoveredGender('unisex')}
          onMouseLeave={() => setHoveredGender(null)}
        >
          <Link to="/category/unisex/all" className="category-link">{t('unisex')}</Link>
          {hoveredGender === 'unisex' && (
            <div className="category-dropdown">
              {categories.map((category) => (
                <Link 
                  key={category.name} 
                  to={`/category/unisex/${category.name}`} 
                  className="category-dropdown-item"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default HeaderGuest;
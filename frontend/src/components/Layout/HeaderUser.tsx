import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { userAPI } from '../../services/api'; // AGGIUNGI QUESTO

const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

const HeaderUser: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGender, setActiveGender] = useState<string | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(0); // AGGIUNGI QUESTO
  const { t } = useLanguage();
  const { logout } = useAuth();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth(); // AGGIUNGI QUESTO
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

  // AGGIUNGI QUESTO USEEFFECT
  useEffect(() => {
    const loadFavoritesCount = async () => {
      if (isAuthenticated()) {
        try {
          const response = await userAPI.getFavorites();
          setFavoritesCount(response.data.length);
        } catch (error) {
          console.error('Error loading favorites count');
        }
      }
    };
    
    loadFavoritesCount();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const menuItems = [
    { label: t('profile'), onClick: () => navigate('/user/personal-area') },
    { label: t('my_orders'), onClick: () => navigate('/user/purchases') },
    { label: t('favorites'), onClick: () => navigate('/user/favorites') },
    { label: t('cart'), onClick: () => navigate('/user/cart') },
    { label: t('logout'), onClick: handleLogout },
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
          
          <Link to="/user/favorites" className="icon-link">
            <span className="icon">♥</span>
            {/* MODIFICA QUI - AGGIUNGI BADGE */}
            {favoritesCount > 0 && (
              <span className="badge">{favoritesCount}</span>
            )}
          </Link>
          
          <Link to="/user/cart" className="icon-link">
            <span className="icon">🛒</span>
            {totalItems > 0 && (
              <span className="badge">{totalItems}</span>
            )}
          </Link>
          
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

export default HeaderUser;
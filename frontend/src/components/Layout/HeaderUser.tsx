import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { userAPI } from '../../services/api'; // AGGIUNGI QUESTO

const HeaderUser: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredGender, setHoveredGender] = useState<string | null>(null);
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
      
      {/* resto del codice uguale */}
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

export default HeaderUser;
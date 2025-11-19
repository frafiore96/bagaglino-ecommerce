import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import HamburgerMenu from './HamburgerMenu';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const HeaderAdmin: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const menuItems = [
    { label: 'Area personale', onClick: () => navigate('/admin/personal-area') },
    { label: 'Le mie vendite', onClick: () => navigate('/admin/sales') },
    { label: 'I miei articoli', onClick: () => navigate('/admin/products') },
    { label: 'Carica un articolo', onClick: () => navigate('/admin/create-product') },
    { label: t('logout'), onClick: handleLogout },
  ];

  return (
    <header className="header admin-header">
      <div className="header-container">
        <Link to="/admin/dashboard" className="logo">
          BAGAGLINO ADMIN
        </Link>
        
        <div className="header-right">
          <LanguageSelector />
          <HamburgerMenu 
            items={menuItems}
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
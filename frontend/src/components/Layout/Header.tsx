import React from 'react';
import { useAuth } from '../../context/AuthContext';
import HeaderGuest from './HeaderGuest';
import HeaderUser from './HeaderUser';
import HeaderAdmin from './HeaderAdmin';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated()) {
    return isAdmin() ? <HeaderAdmin /> : <HeaderUser />;
  }

  return <HeaderGuest />;
};

export default Header;
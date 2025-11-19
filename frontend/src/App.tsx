import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import AppRoutes from './routes/AppRoutes';
import WelcomePopup from './components/Common/WelcomePopup';
import './App.css';

const AppContent: React.FC = () => {
  const { user, showWelcomePopup, setShowWelcomePopup } = useAuth();

  return (
    <div className="App">
      <AppRoutes />
      {showWelcomePopup && user && (
        <WelcomePopup 
          userName={user.name} 
          onClose={() => setShowWelcomePopup(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
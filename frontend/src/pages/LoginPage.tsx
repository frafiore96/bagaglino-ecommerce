import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      const redirectTo = result.user?.role === 'admin' ? '/admin/dashboard' : from;
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.message || 'Errore durante il login');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="logo">BAGAGLINO</Link>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{t('login')}</h2>
          
          {error && (
            <div className="error-message">{error}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? t('loading') : t('login')}
          </button>
          
          <div className="auth-links">
            <span>{t('dont_have_account')} </span>
            <Link to="/register">{t('register_here')}</Link>
          </div>
        </form>

        {/* Test Credentials */}
        <div className="test-credentials">
          <h3>Credenziali di test:</h3>
          <p><strong>Admin:</strong> admin@bagaglino.com / password</p>
          <button 
            onClick={() => {
              setEmail('admin@bagaglino.com');
              setPassword('password');
            }}
            className="test-btn"
          >
            Usa credenziali admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo e descrizione */}
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">BAGAGLINO</h3>
            <p className="footer-description">
              {t('footer_description')}
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/bagaglinoabbigliamento/" aria-label="Facebook" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/bagaglino_abbigliamento/" aria-label="Instagram" className="social-link" target='_blank' rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Link rapidi */}
          <div className="footer-section">
            <h4 className="footer-title">{t('quick_links')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/category/uomo/all">{t('uomo')}</Link></li>
              <li><Link to="/category/donna/all">{t('donna')}</Link></li>
              <li><Link to="/category/unisex/all">{t('unisex')}</Link></li>
              <li><Link to="/user/favorites">{t('favorites')}</Link></li>
            </ul>
          </div>

          {/* Supporto */}
          <div className="footer-section">
            <h4 className="footer-title">{t('customer_support')}</h4>
            <ul className="footer-links">
              <li><a href="https://share.google/qtyR4Vq1ouatoNHqc" aria-label="Instagram" target='_blank' rel="noopener noreferrer">{t('contact_us')}</a></li>
            </ul>
          </div>

          {/* Informazioni legali */}
          <div className="footer-section">
            <h4 className="footer-title">{t('legal_info')}</h4>
            <ul className="footer-links">
              <li><a href="https://www.instagram.com/bagaglino_abbigliamento/" aria-label="Instagram" target='_blank' rel="noopener noreferrer">{t('about_us')}
              </a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 Bagaglino. {t('all_rights_reserved')}
            </p>
            <div className="payment-methods">
              <span className="payment-text">{t('payment_methods')}:</span>
              <div className="payment-icons">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-paypal"></i>
                <i className="fab fa-cc-amex"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
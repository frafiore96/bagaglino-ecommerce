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
              <a href="#" aria-label="Facebook" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Link rapidi */}
          <div className="footer-section">
            <h4 className="footer-title">{t('quick_links')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/category/uomo">{t('uomo')}</Link></li>
              <li><Link to="/category/donna">{t('donna')}</Link></li>
              <li><Link to="/category/unisex">{t('unisex')}</Link></li>
              <li><Link to="/favorites">{t('favorites')}</Link></li>
            </ul>
          </div>

          {/* Categorie */}
          <div className="footer-section">
            <h4 className="footer-title">{t('categories')}</h4>
            <ul className="footer-links">
              <li><Link to="/category/t-shirt">{t('t-shirt')}</Link></li>
              <li><Link to="/category/maglioni">{t('maglioni')}</Link></li>
              <li><Link to="/category/giacche">{t('giacche')}</Link></li>
              <li><Link to="/category/pantaloni">{t('pantaloni')}</Link></li>
              <li><Link to="/category/accessori">{t('accessori')}</Link></li>
            </ul>
          </div>

          {/* Supporto */}
          <div className="footer-section">
            <h4 className="footer-title">{t('customer_support')}</h4>
            <ul className="footer-links">
              <li><Link to="/contact">{t('contact_us')}</Link></li>
              <li><Link to="/shipping">{t('shipping_info')}</Link></li>
              <li><Link to="/returns">{t('return_policy')}</Link></li>
              <li><Link to="/size-guide">{t('size_guide')}</Link></li>
              <li><Link to="/faq">{t('faq')}</Link></li>
            </ul>
          </div>

          {/* Informazioni legali */}
          <div className="footer-section">
            <h4 className="footer-title">{t('legal_info')}</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">{t('privacy_policy')}</Link></li>
              <li><Link to="/terms">{t('terms_conditions')}</Link></li>
              <li><Link to="/cookies">{t('cookie_policy')}</Link></li>
              <li><Link to="/about">{t('about_us')}</Link></li>
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
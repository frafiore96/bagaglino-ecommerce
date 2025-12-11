import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { userAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartItem {
  id: number;
  quantity: number;
  product_id: number;
  product_code: string;
  name: string;
  price: string;
  image_url?: string;
  stock: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await userAPI.getCart();
        setCartItems(response.data);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      await userAPI.updateCart(productId, newQuantity);
      setCartItems(cartItems.map(item => 
        item.product_id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
      refreshCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Errore durante aggiornamento');
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await userAPI.removeFromCart(productId);
      setCartItems(cartItems.filter(item => item.product_id !== productId));
      refreshCart();
      alert('Prodotto rimosso dal carrello');
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Errore durante rimozione');
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.price) * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Caricamento carrello...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1>{t('my_cart')}</h1>
            <p>{getTotalItems()} {t('products')}</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>{t('cart_empty')}</p>
              <Link to="/" className="btn-primary">{t('continue_shopping')}</Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <Link to={`/product/${item.product_id}`} className="item-image">
                      <img 
                        src={item.image_url || `https://via.placeholder.com/150x200/f0f0f0/333?text=${encodeURIComponent(item.name)}`} 
                        alt={item.name}
                      />
                    </Link>
                    
                    <div className="item-details">
                      <Link to={`/product/${item.product_id}`}>
                        <h3>{item.name}</h3>
                      </Link>
                      <p className="item-code">{t('code')}: {item.product_code}</p>
                      <p className="item-price">€{(Number(item.price) || 0).toFixed(2)}</p>
                    </div>
                    
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="qty-btn"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total">
                      €{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.product_id)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-card">
                  <h3>{t('order_summary')}</h3>
                  <div className="summary-line">
                    <span>{t('products')} ({getTotalItems()})</span>
                    <span>€{getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>{t('shipping')}</span>
                    <span>{t('free')}</span>
                  </div>
                  <div className="summary-total">
                    <span>{t('total')} </span>
                    <span>€{getTotalAmount().toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/user/checkout')}
                    className="checkout-btn"
                  >
                    {t('place_order')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
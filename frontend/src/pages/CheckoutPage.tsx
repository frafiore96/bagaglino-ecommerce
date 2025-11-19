import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { userAPI } from '../services/api';
import { useCart } from '../context/CartContext';

interface CartItem {
  id: number;
  quantity: number;
  product_id: number;
  name: string;
  price: string;
  image_url?: string;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_surname: '',
    customer_email: '',
    customer_phone: '',
    billing_address: '',
    shipping_address: '',
    sameAddress: true
  });

  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await userAPI.getCart();
        setCartItems(response.data);
        
        if (response.data.length === 0) {
          navigate('/user/cart');
          return;
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        navigate('/user/cart');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
        ...(name === 'sameAddress' && checked ? { shipping_address: formData.billing_address } : {})
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        ...(name === 'billing_address' && formData.sameAddress ? { shipping_address: value } : {})
      });
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.price) * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderData = {
        customer_name: formData.customer_name,
        customer_surname: formData.customer_surname,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        billing_address: formData.billing_address,
        shipping_address: formData.sameAddress ? formData.billing_address : formData.shipping_address
      };

      await userAPI.checkout(orderData);
      clearCart();
      
      // Simula successo acquisto
      alert(`🎉 Ordine completato con successo!\nTotale: €${getTotalAmount().toFixed(2)}\nGrazie per il tuo acquisto!`);
      navigate('/user/purchases');
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Errore durante l\'acquisto');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Caricamento...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="checkout-page">
        <div className="container">
          <div className="page-header">
            <h1>Completa l'acquisto</h1>
          </div>

          <div className="checkout-content">
            <div className="checkout-form">
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>Dati personali</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="customer_name">Nome *</label>
                      <input
                        id="customer_name"
                        name="customer_name"
                        type="text"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customer_surname">Cognome *</label>
                      <input
                        id="customer_surname"
                        name="customer_surname"
                        type="text"
                        value={formData.customer_surname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="customer_email">Email *</label>
                    <input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="customer_phone">Telefono *</label>
                    <input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Indirizzo di fatturazione</h3>
                  <div className="form-group">
                    <label htmlFor="billing_address">Indirizzo completo *</label>
                    <textarea
                      id="billing_address"
                      name="billing_address"
                      value={formData.billing_address}
                      onChange={handleChange}
                      rows={3}
                      required
                      placeholder="Via, numero civico, città, CAP"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Indirizzo di spedizione</h3>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="sameAddress"
                        checked={formData.sameAddress}
                        onChange={handleChange}
                      />
                      Uguale all'indirizzo di fatturazione
                    </label>
                  </div>
                  
                  {!formData.sameAddress && (
                    <div className="form-group">
                      <label htmlFor="shipping_address">Indirizzo di spedizione *</label>
                      <textarea
                        id="shipping_address"
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleChange}
                        rows={3}
                        required={!formData.sameAddress}
                        placeholder="Via, numero civico, città, CAP"
                      />
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h3>Pagamento</h3>
                  <div className="payment-info">
                    <p>💳 Questo è un ordine di test - nessun pagamento reale verrà elaborato</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="complete-order-btn"
                  disabled={processing}
                >
                  {processing ? 'Elaborando...' : `Completa ordine - €${getTotalAmount().toFixed(2)}`}
                </button>
              </form>
            </div>

            <div className="order-summary">
              <h3>Riepilogo ordine</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img 
                      src={item.image_url || `https://via.placeholder.com/60x80/f0f0f0/333?text=${encodeURIComponent(item.name)}`} 
                      alt={item.name}
                    />
                    <div className="item-info">
                      <p>{item.name}</p>
                      <p>Quantità: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      €{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <p>Totale: €{getTotalAmount().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
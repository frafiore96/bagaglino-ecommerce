import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import { userAPI } from '../services/api';

interface Purchase {
  id: number;
  total_amount: string;
  customer_name: string;
  customer_surname: string;
  status: string;
  created_at: string;
  products: string;
}

const MyPurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const response = await userAPI.getPurchases();
        setPurchases(response.data);
      } catch (error) {
        console.error('Error loading purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge completed">Completato</span>;
      case 'pending':
        return <span className="status-badge pending">In elaborazione</span>;
      case 'cancelled':
        return <span className="status-badge cancelled">Annullato</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Caricamento ordini...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="purchases-page">
        <div className="container">
          <div className="page-header">
            <h1>I miei acquisti</h1>
            <p>{purchases.length} ordini effettuati</p>
          </div>

          {purchases.length === 0 ? (
            <div className="no-purchases">
              <p>Non hai ancora effettuato nessun acquisto.</p>
              <a href="/" className="btn-primary">Inizia lo shopping</a>
            </div>
          ) : (
            <div className="purchases-list">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="purchase-card">
                  <div className="purchase-header">
                    <div className="order-info">
                      <h3>Ordine #{purchase.id}</h3>
                      <p className="order-date">{formatDate(purchase.created_at)}</p>
                    </div>
                    <div className="order-status">
                      {getStatusBadge(purchase.status)}
                    </div>
                  </div>
                  
                  <div className="purchase-details">
                    <div className="customer-info">
                      <p><strong>Cliente:</strong> {purchase.customer_name} {purchase.customer_surname}</p>
                    </div>
                    
                    <div className="products-info">
                      <p><strong>Prodotti:</strong></p>
                      <p className="products-list">{purchase.products}</p>
                    </div>
                    
                    <div className="total-amount">
                      <span className="total-label">Totale pagato:</span>
                      <span className="total-value">€{(Number(purchase.total_amount) || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyPurchasesPage;
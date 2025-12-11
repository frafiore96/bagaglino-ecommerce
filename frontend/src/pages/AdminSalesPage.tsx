import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import { adminAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface Sale {
  id: number;
  total_amount: string;
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone: string;
  billing_address: string;
  shipping_address: string;
  created_at: string;
  products: string;
}

const AdminSalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useLanguage();
  const loadSales = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSales();
      setSales(response.data.sales);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="admin-container">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="admin-container">
        <div className="page-header">
          <h1>{t('sales')}</h1>
          <div className="sales-summary">
            {t('total_sales')}: {sales.length}
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="no-sales">
            <p>{t('no_sales')}</p>
          </div>
        ) : (
          <div className="sales-table">
            <div className="table-header">
              <div>{t('order')}</div>
              <div>{t('date')}</div>
              <div>{t('customer')}</div>
              <div>{t('email')}</div>
              <div>{t('phone')}</div>
              <div>{t('products')}</div>
              <div>{t('total')}</div>
              <div>{t('actions')}</div>
            </div>
            
            {sales.map(sale => (
              <div key={sale.id} className="table-row">
                <div>#{sale.id}</div>
                <div>{formatDate(sale.created_at)}</div>
                <div>{sale.customer_name} {sale.customer_surname}</div>
                <div>{sale.customer_email}</div>
                <div>{sale.customer_phone}</div>
                <div className="products-cell">{sale.products}</div>
                <div className="total">€{parseFloat(sale.total_amount).toFixed(2)}</div>
                <div className="actions">
                  <button 
                    onClick={() => alert(`Indirizzo fatturazione: ${sale.billing_address}\n\nIndirizzo spedizione: ${sale.shipping_address}`)}
                    className="btn-info"
                  >
                    {t('details')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="btn-page"
            >
              Precedente
            </button>
            <span className="page-info">
              Pagina {page} di {totalPages}
            </span>
            <button 
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="btn-page"
            >
              Successiva
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSalesPage;
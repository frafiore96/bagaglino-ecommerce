import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { adminAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface DashboardData {
  total_products: number;
  total_sales: number;
  total_revenue: number;
}

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    total_products: 0,
    total_sales: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await adminAPI.getDashboard();
        setData(response.data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

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
        <h1>Dashboard Admin</h1>
        
        {/* Counter Section */}
        <div className="stats-section">
          <div className="stat-card">
            <h3>{t('products_sold')}</h3>
            <div className="stat-number">{data.total_sales}</div>
          </div>
          <div className="stat-card">
            <h3>{t('total_revenue')}</h3>
            <div className="stat-number">€{data.total_revenue.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <h3>{t('total_products')}</h3>
            <div className="stat-number">{data.total_products}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <Link to="/admin/sales" className="action-card">
            <h3>{t('sales_report')}</h3>
            <p>{t('view_all')}</p>
          </Link>
          <Link to="/admin/products" className="action-card">
            <h3>{t('my_products')}</h3>
            <p>{t('manage_products')}</p>
          </Link>
          <Link to="/admin/create-product" className="action-card">
            <h3>{t('add_product')}</h3>
            <p>{t('upload_new_product')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
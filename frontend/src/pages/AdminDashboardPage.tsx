import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { adminAPI } from '../services/api';

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
        <div className="admin-container">Caricamento...</div>
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
            <h3>Articoli Venduti</h3>
            <div className="stat-number">{data.total_sales}</div>
          </div>
          <div className="stat-card">
            <h3>Guadagni Totali</h3>
            <div className="stat-number">€{data.total_revenue.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <h3>Prodotti Caricati</h3>
            <div className="stat-number">{data.total_products}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <Link to="/admin/sales" className="action-card">
            <h3>Le mie vendite</h3>
            <p>Visualizza tutti gli ordini</p>
          </Link>
          <Link to="/admin/products" className="action-card">
            <h3>I miei articoli</h3>
            <p>Gestisci prodotti</p>
          </Link>
          <Link to="/admin/create-product" className="action-card">
            <h3>Carica un articolo</h3>
            <p>Aggiungi nuovo prodotto</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
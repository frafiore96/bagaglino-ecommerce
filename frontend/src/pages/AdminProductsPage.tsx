import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { adminAPI, Product } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const archiveProduct = async (id: number, name: string) => {
    if (window.confirm(`Archiviare il prodotto "${name}"? Non sarà più visibile sul sito.`)) {
      try {
        await fetch(`http://localhost:8000/api/admin/archive-product.php?id=${id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(products.filter(p => p.id !== id));
        alert('Product archived!');
      } catch (error) {
        alert('Error during archiving');
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (gender === '' || product.gender === gender) &&
      (category === '' || product.category === category)
    );
  });

  return (
    <div>
      <Header />
      <div className="admin-container">
        <div className="page-header">
          <h1>{t('my_products')}</h1>
          <Link to="/admin/create-product" className="btn-primary">
            + {t('upload_new_product')}
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder={t('search_products')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
            className="filter-select"
          >
            <option value="">{t('all_genders')}</option>
            <option value="uomo">{t('uomo')}</option>
            <option value="donna">{t('donna')}</option>
            <option value="unisex">{t('unisex')}</option>
          </select>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">{t('all_categories')}</option>
            <option value="t-shirt">{t('giubbotti')}</option>
            <option value="maglioni">{t('maglioni')}</option>
            <option value="giacche">{t('giacche')}</option>
            <option value="pantaloni">{t('pantaloni')}</option>
            <option value="scarpe">{t('scarpe')}</option>
            <option value="camicie">{t('camicie')}</option>
            <option value="felpe">{t('felpe')}</option>
            <option value="accessori">{t('accessori')}</option>
          </select>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="loading">{t('loading')}</div>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <div>{t('code')}</div>
              <div>{t('name')}</div>
              <div>{t('gender')}</div>
              <div>{t('category')}</div>
              <div>{t('price')}</div>
              <div>{t('stock')}</div>
              <div>{t('actions')}</div>
            </div>
            {filteredProducts.map(product => (
              <div key={product.id} className="table-row">
                <div>{product.product_code}</div>
                <div>{product.name}</div>
                <div className="capitalize">{product.gender}</div>
                <div className="capitalize">{product.category}</div>
                <div>€{(Number(product.price) || 0).toFixed(2)}</div>
                <div>{product.stock}</div>
                <div className="actions">
                  <button 
                    onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                    className="btn-edit"
                  >
                    {t('modify')}
                  </button>
                  <button 
                    onClick={() => archiveProduct(product.id, product.name)}
                    className="btn-archive"
                  >
                    {t('archive')}
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="no-products">
              {t('no_results')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
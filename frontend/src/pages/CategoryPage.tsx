import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { productsAPI, Product } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const CategoryPage: React.FC = () => {
  const { gender, category } = useParams<{ gender: string; category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll(gender || '', category === 'all' ? '' : category || '');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [gender, category]);

  const getTitle = () => {
    if (category === 'all') {
      return `${t(gender || '')} - Tutti i prodotti`;
    }
    return `${t(gender || '')} - ${t(category || '')}`;
  };

  return (
    <div>
      <Header />
      
      <main className="category-page">
        <div className="container">
          <div className="page-header">
            <h1>{getTitle()}</h1>
            <p>{products.length} prodotti trovati</p>
          </div>

          {loading ? (
            <div className="loading">Caricamento prodotti...</div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>Nessun prodotto trovato in questa categoria.</p>
              <Link to="/" className="btn-primary">Torna alla home</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link 
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    <img 
                      src={product.image_url || `https://via.placeholder.com/300x400/f0f0f0/333?text=${encodeURIComponent(product.name)}`} 
                      alt={product.name}
                    />
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="stock-badge">Ultimi {product.stock}</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">€{(Number(product.price) || 0).toFixed(2)}</p>
                    <p className="category">{t(product.category)} • {t(product.gender)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
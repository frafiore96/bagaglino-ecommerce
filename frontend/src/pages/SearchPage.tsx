import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { productsAPI, Product } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q') || '';
  const { t } = useLanguage();

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const response = await productsAPI.search(query);
        const data = response.data;
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <div>
      <Header />
      <main className="search-page">
        <div className="container">
          <h1>{t('results_for')} "{query}"</h1>
          <p>{products.length} {t('found_products')}</p>
          
          {loading ? (
            <div className="loading">Ricerca in corso...</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="product-card">
                  <div className="product-image">
                    <img src={product.image_url || `https://via.placeholder.com/300x400/f0f0f0/333?text=${encodeURIComponent(product.name)}`} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">€{(Number(product.price) || 0).toFixed(2)}</p>
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

export default SearchPage;
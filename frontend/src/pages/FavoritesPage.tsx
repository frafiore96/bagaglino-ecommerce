import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { userAPI, Product } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await userAPI.getFavorites();
        setFavorites(response.data);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (productId: number) => {
    try {
      await userAPI.removeFavorite(productId);
      setFavorites(favorites.filter(product => product.id !== productId));
      alert('Rimosso dai preferiti!');
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error during removal');
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Caricamento preferiti...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="favorites-page">
        <div className="container">
          <div className="page-header">
            <h1>{t('favorites')}</h1>
            <p>{favorites.length} {t('saved_products')}</p>
          </div>

          {favorites.length === 0 ? (
            <div className="no-favorites">
              <p>{t('no_products')}</p>
              <Link to="/" className="btn-primary">{t('discover_products')}</Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((product) => (
                <div key={product.id} className="favorite-card">
                  <Link to={`/product/${product.id}`} className="product-link">
                    <div className="product-image">
                      <img 
                        src={product.image_url || `https://via.placeholder.com/300x400/f0f0f0/333?text=${encodeURIComponent(product.name)}`} 
                        alt={product.name}
                      />
                    </div>
                  </Link>
                  
                  <div className="product-info">
                    <Link to={`/product/${product.id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <p className="price">€{(Number(product.price) || 0).toFixed(2)}</p>
                    <p className="category">{t(product.category)} • {t(product.gender)}</p>
                    
                    <div className="actions">
                      <button 
                        onClick={() => removeFavorite(product.id)}
                        className="btn-remove"
                      >
                        ♥ {t('remove')}
                      </button>
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

export default FavoritesPage;
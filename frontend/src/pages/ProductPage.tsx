import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { productsAPI, userAPI, Product } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface SizeStock {
  [key: string]: number;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [sizeStock, setSizeStock] = useState<SizeStock>({});
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [productResponse, sizesResponse] = await Promise.all([
          productsAPI.getById(parseInt(id)),
          productsAPI.getSizes(parseInt(id))
        ]);
        
        setProduct(productResponse.data);
        const sizes: SizeStock = sizesResponse.data || {};
        setSizeStock(sizes);
        
        // Seleziona prima taglia disponibile
        const availableSizes = Object.entries(sizes)
          .filter(([_, stock]) => (stock as number) > 0)
          .map(([size, _]) => size);
        
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
        
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
  
    loadProduct();
  }, [id, navigate]);

  const getTotalStock = () => {
    return Object.values(sizeStock).reduce((total, stock) => total + stock, 0);
  };

  const getAvailableStock = () => {
    return selectedSize ? sizeStock[selectedSize] || 0 : getTotalStock();
  };

  const handleAddToCart = async () => {
    if (!product || !isAuthenticated()) {
      navigate('/login');
      return;
    }
  
    if (!selectedSize) {
      alert('Seleziona una taglia');
      return;
    }
  
    if (sizeStock[selectedSize] === 0) {
      alert('Taglia non disponibile');
      return;
    }
  
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1, selectedSize); // AGGIUNGI selectedSize
      alert('Prodotto aggiunto al carrello!');
    } catch (error) {
      alert('Errore durante aggiunta al carrello');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!product || !isAuthenticated()) {
      navigate('/login');
      return;
    }

    setAddingToFavorites(true);
    try {
      await userAPI.addFavorite(product.id);
      alert('Prodotto aggiunto ai preferiti!');
    } catch (error) {
      alert('Errore durante aggiunta ai preferiti');
    } finally {
      setAddingToFavorites(false);
    }
  };


  const handleBuyNow = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (!selectedSize) {
      alert('Seleziona una taglia');
      return;
    }
    
    try {
      if (product) {
        await addToCart(product.id, 1, selectedSize);
      }
      navigate('/user/checkout');
    } catch (error) {
      alert('Errore durante aggiunta al carrello');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Caricamento prodotto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="no-product">Prodotto non trovato</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="product-page">
        <div className="container">
          <div className="product-detail">
            <div className="product-image-large">
              <img 
                src={product.image_url || `https://via.placeholder.com/500x600/f0f0f0/333?text=${encodeURIComponent(product.name)}`} 
                alt={product.name}
              />
            </div>
            
            <div className="product-details">
              <div className="product-meta">
                <span className="product-code">{product.product_code}</span>
                <span className="category">{t(product.category)} • {t(product.gender)}</span>
              </div>
              
              <h1>{product.name}</h1>
              
              {product.description && (
                <p className="description">{product.description}</p>
              )}
              
              <div className="price-section">
                <span className="price">€{(Number(product.price) || 0).toFixed(2)}</span>
              </div>
              
              <div className="size-selector">
                <label>Taglia:</label>
                <div className="sizes">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={sizeStock[size] === 0}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''} ${sizeStock[size] === 0 ? 'disabled' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="stock-info">
                {selectedSize ? (
                  <span className={sizeStock[selectedSize] > 0 ? 'in-stock' : 'out-of-stock'}>
                    {sizeStock[selectedSize] > 0 
                      ? `${sizeStock[selectedSize]} disponibili in taglia ${selectedSize}` 
                      : 'Non disponibile in questa taglia'
                    }
                  </span>
                ) : (
                  <span className="in-stock">
                    {getTotalStock()} pezzi disponibili totali
                  </span>
                )}
              </div>
              
              {getTotalStock() > 0 && (
                <div className="actions">
                  <button 
                    onClick={handleAddToFavorites}
                    disabled={addingToFavorites}
                    className="btn-secondary"
                  >
                    {addingToFavorites ? 'Aggiungendo...' : '♥ Aggiungi ai preferiti'}
                  </button>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart || !selectedSize || (!!selectedSize && sizeStock[selectedSize] === 0)}
                    className="btn-primary"
                  >
                    {addingToCart ? 'Aggiungendo...' : 'Aggiungi al carrello'}
                  </button>
                  
                  <button 
                    onClick={handleBuyNow}
                    disabled={!selectedSize || (!!selectedSize && sizeStock[selectedSize] === 0)}
                    className="btn-buy-now"
                  >
                    Acquista ora
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
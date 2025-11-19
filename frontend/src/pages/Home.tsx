import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { productsAPI, Product } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredGender, setHoveredGender] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        setFeaturedProducts(response.data.products.slice(0, 12)); // Più prodotti per lo slider
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = [
    { name: 't-shirt', label: t('t-shirt') },
    { name: 'maglioni', label: t('maglioni') },
    { name: 'giacche', label: t('giacche') },
    { name: 'pantaloni', label: t('pantaloni') },
    { name: 'scarpe', label: t('scarpe') },
    { name: 'camicie', label: t('camicie') },
    { name: 'felpe', label: t('felpe') },
    { name: 'giubbotti', label: t('giubbotti') },
    { name: 'accessori', label: t('accessori') },
  ];

  const genders = [
    { key: 'uomo', label: t('uomo') },
    { key: 'donna', label: t('donna') },
    { key: 'unisex', label: t('unisex') }
  ];

  const gridImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'
  ];

  const productsPerSlide = 4;
  const totalSlides = Math.ceil(featuredProducts.length / productsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentProducts = () => {
    const start = currentSlide * productsPerSlide;
    return featuredProducts.slice(start, start + productsPerSlide);
  };

  return (
    <div>
      <Header />
      
      <main className="home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>BAGAGLINO</h1>
            <p>Collezione Primavera/Estate 2025</p>
            <Link to="/category/donna/all" className="cta-button">
              Scopri la collezione
            </Link>
          </div>
        </section>
        {/* Photo Grid 2x3 with 4:5 aspect ratio */}
<section className="photo-grid-section">
  <div className="photo-grid">
    <div className="grid-item">
      <img 
        src="/images/1.png"
        alt="Fashion 1"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
        }}
      />
    </div>
    <div className="grid-item">
      <img 
        src="/images/2.png"
        alt="Fashion 2"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop';
        }}
      />
    </div>
    <div className="grid-item">
      <img 
        src="/images/3.png"
        alt="Fashion 3"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop';
        }}
      />
    </div>
    <div className="grid-item">
      <img 
        src="/images/4.png"
        alt="Fashion 4"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop';
        }}
      />
    </div>
    <div className="grid-item">
      <img 
        src="/images/5.png"
        alt="Fashion 5"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop';
        }}
      />
    </div>
    <div className="grid-item">
      <img 
        src="/images/6.png"
        alt="Fashion 6"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop';
        }}
      />
    </div>
  </div>
</section>

        {/* Featured Products Slider */}
        {!loading && featuredProducts.length > 0 && (
          <section className="featured-section">
            <h2>Prodotti in evidenza</h2>
            <div className="slider-container">
              <button onClick={prevSlide} className="slider-btn prev">‹</button>
              
              <div className="product-slider">
                <div 
                  className="slider-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="slide">
                      {featuredProducts
                        .slice(slideIndex * productsPerSlide, (slideIndex + 1) * productsPerSlide)
                        .map((product) => (
                          <Link 
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="product-card-small"
                          >
                            <div className="product-image-small">
                              <img 
                                src={product.image_url || `https://via.placeholder.com/150x200/f0f0f0/333?text=${encodeURIComponent(product.name)}`} 
                                alt={product.name}
                              />
                            </div>
                            <div className="product-info-small">
                              <h5>{product.name}</h5>
                              <p className="price">€{(Number(product.price) || 0).toFixed(2)}</p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
              
              <button onClick={nextSlide} className="slider-btn next">›</button>
            </div>
            
            <div className="slider-dots">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
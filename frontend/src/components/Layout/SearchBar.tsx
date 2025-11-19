import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface Product {
  id: number;
  name: string;
  category: string;
  gender: string;
  price: string;
  image_url?: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Chiudi suggestions quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/products/search.php?q=${encodeURIComponent(value)}`);
        const data = await response.json();
        setSuggestions(data.slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="search-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Cerca prodotti..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </form>

      {showSuggestions && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-item loading">Ricerca...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="suggestion-item"
                onClick={handleSuggestionClick}
              >
                <div className="suggestion-image">
                  <img 
                    src={product.image_url || `https://via.placeholder.com/40x40/f0f0f0/333?text=${encodeURIComponent(product.name)}`} 
                    alt={product.name}
                  />
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-name">{product.name}</div>
                  <div className="suggestion-meta">
                    {t(product.category)} • {t(product.gender)} • €{(Number(product.price) || 0).toFixed(2)}
                  </div>
                </div>
              </Link>
            ))
          ) : query.length > 2 ? (
            <div className="suggestion-item no-results">Nessun risultato trovato</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
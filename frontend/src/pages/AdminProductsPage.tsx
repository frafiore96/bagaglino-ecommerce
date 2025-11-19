import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { adminAPI, Product } from '../services/api';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

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
        alert('Prodotto archiviato!');
      } catch (error) {
        alert('Errore durante archiviazione');
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
          <h1>I miei articoli</h1>
          <Link to="/admin/create-product" className="btn-primary">
            + Aggiungi Prodotto
          </Link>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="Cerca prodotto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
            className="filter-select"
          >
            <option value="">Tutti i generi</option>
            <option value="uomo">Uomo</option>
            <option value="donna">Donna</option>
            <option value="unisex">Unisex</option>
          </select>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Tutte le categorie</option>
            <option value="t-shirt">T-shirt</option>
            <option value="maglioni">Maglioni</option>
            <option value="giacche">Giacche</option>
            <option value="pantaloni">Pantaloni</option>
            <option value="scarpe">Scarpe</option>
            <option value="camicie">Camicie</option>
            <option value="felpe">Felpe</option>
            <option value="giubbotti">Giubbotti</option>
            <option value="accessori">Accessori</option>
          </select>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="loading">Caricamento prodotti...</div>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <div>Codice</div>
              <div>Nome</div>
              <div>Genere</div>
              <div>Categoria</div>
              <div>Prezzo</div>
              <div>Stock</div>
              <div>Azioni</div>
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
                    Modifica
                  </button>
                  <button 
                    onClick={() => archiveProduct(product.id, product.name)}
                    className="btn-archive"
                  >
                    Archivia
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="no-products">
                Nessun prodotto trovato
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
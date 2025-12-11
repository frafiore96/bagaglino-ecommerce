import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { adminAPI, productsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    gender: 'unisex' as 'unisex' | 'uomo' | 'donna',
    category: 't-shirt' as 't-shirt' | 'maglioni' | 'giacche' | 'pantaloni' | 'scarpe' | 'camicie' | 'felpe' | 'giubbotti' | 'accessori'
  });
  const [sizeStock, setSizeStock] = useState({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const [productResponse, sizesResponse] = await Promise.all([
          productsAPI.getById(parseInt(id)),
          productsAPI.getSizes(parseInt(id))
        ]);
        
        const product = productResponse.data;
        setFormData({
          name: product.name,
          description: product.description || '',
          price: String(product.price),
          image_url: product.image_url || '',
          gender: product.gender,
          category: product.category
        });
        
        const sizes = sizesResponse.data || {};
        setSizeStock({
          XS: sizes.XS || 0,
          S: sizes.S || 0,
          M: sizes.M || 0,
          L: sizes.L || 0,
          XL: sizes.XL || 0,
          XXL: sizes.XXL || 0
        });
        
        setImagePreview(product.image_url || '');
        
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSizeChange = (size: string, value: number) => {
    setSizeStock({
      ...sizeStock,
      [size]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo file PNG, JPG, JPEG sono permessi');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File troppo grande. Massimo 5MB');
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Pulisci URL se viene caricato file
      setFormData({ ...formData, image_url: '' });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image_url: '' });
  };

  const getTotalStock = () => {
    return Object.values(sizeStock).reduce((total, stock) => total + stock, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (getTotalStock() === 0) {
      setError('Inserire almeno una quantità per una taglia');
      setSaving(false);
      return;
    }

    try {
      let finalImageUrl = formData.image_url;

      // Upload nuova immagine se presente
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        try {
          const uploadResponse = await fetch('http://localhost:8000/api/admin/upload-image.php', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataUpload
          });
          const uploadResult = await uploadResponse.json();
          
          if (uploadResult.image_url) {
            finalImageUrl = uploadResult.image_url;
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setError('Errore durante upload immagine');
          setSaving(false);
          return;
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: finalImageUrl,
        gender: formData.gender,
        category: formData.category,
        stock: getTotalStock(),
        sizes: sizeStock
      };

      await adminAPI.updateProduct(parseInt(id!), productData);
      alert('Prodotto aggiornato con successo!');
      navigate('/admin/products');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Errore durante aggiornamento');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="admin-container">
        <div className="page-header">
          <h1>{t('edit_product')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">{t('product_name')} *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">{t('price')} (€) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">{t('gender')} *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="uomo">{t('uomo')}</option>
                <option value="donna">{t('donna')}</option>
                <option value="unisex">{t('unisex')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">{t('category')} *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="t-shirt">{t('t-shirt')}</option>
                <option value="maglioni">{t('maglioni')}</option>
                <option value="giacche">{t('giacche')}</option>
                <option value="pantaloni">{t('pantaloni')}</option>
                <option value="scarpe">{t('scarpe')}</option>
                <option value="camicie">{t('camicie')}</option>
                <option value="felpe">{t('felpe')}</option>
                <option value="giubbotti">{t('giubbotti')}</option>
                <option value="accessori">{t('accessori')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('product_image')} </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" onClick={removeImage} className="remove-image-btn">
                  {t('remove')} 
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
            </div>

          </div>

          <div className="form-group full-width">
            <label>Stock *</label>
            <div className="size-grid">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <div key={size} className="size-input">
                  <label>{size}</label>
                  <input
                    type="number"
                    min="0"
                    value={sizeStock[size as keyof typeof sizeStock]}
                    onChange={(e) => handleSizeChange(size, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
            <p className="stock-total">{t('total')}: {getTotalStock()} {t('products')}</p>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">{t('description')}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/products')}
              className="btn-secondary"
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Salvando...' : t('save') }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
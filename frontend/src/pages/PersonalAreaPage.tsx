import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import { userAPI, User } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const PersonalAreaPage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    billing_address: '',
    shipping_address: '',
    profile_image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserData(response.data);
        setFormData({
          name: response.data.name || '',
          surname: response.data.surname || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          billing_address: response.data.billing_address || '',
          shipping_address: response.data.shipping_address || '',
          profile_image: response.data.profile_image || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userAPI.updateProfile(formData);
      setUserData({ ...userData!, ...formData });
      setIsEditing(false);
      alert('Profilo aggiornato con successo!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Errore durante aggiornamento');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        surname: userData.surname || '',
        email: userData.email || '',
        phone: userData.phone || '',
        billing_address: userData.billing_address || '',
        shipping_address: userData.shipping_address || '',
        profile_image: userData.profile_image || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Caricamento profilo...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <main className="personal-area-page">
        <div className="container">
          <div className="page-header">
            <h1>{t('personal_area')}</h1>
            <p>{t('account_settings')}</p>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {formData.profile_image ? (
                    <img src={formData.profile_image} alt="Profilo" />
                  ) : (
                    <div className="avatar-placeholder">
                      {formData.name.charAt(0)}{formData.surname.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h2>{userData?.name} {userData?.surname}</h2>
                  <p>{userData?.email}</p>
                  <span className="role-badge">
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                <div className="profile-actions">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                    >
                      {t('edit_profile')}
                    </button>
                  ) : (
                    <button 
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      {t('cancel')}
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  <h3>{t('personal_info')}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">{t('name')}</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="surname">{t('surname')}</label>
                      <input
                        id="surname"
                        name="surname"
                        type="text"
                        value={formData.surname}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">{t('email')}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true} // Email non modificabile
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">{t('phone')}</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                  
                  {/* <div className="form-group">
                    <label htmlFor="profile_image">URL Foto profilo</label>
                    <input
                      id="profile_image"
                      name="profile_image"
                      type="url"
                      value={formData.profile_image}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="https://esempio.com/foto.jpg"
                    />
                  </div> */}
                </div>

                <div className="form-section">
                  <h3>{t('address')}</h3>
                  <div className="form-group">
                    <label htmlFor="billing_address">{t('billing_address')}</label>
                    <textarea
                      id="billing_address"
                      name="billing_address"
                      value={formData.billing_address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="shipping_address">{t('shipping_address')}</label>
                    <textarea
                      id="shipping_address"
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={saving}
                    >
                      {saving ? 'Salvando...' : t('save')}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalAreaPage;
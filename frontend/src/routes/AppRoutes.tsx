import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminEditProductPage from '../pages/AdminEditProductPage';

// Pages
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CategoryPage from '../pages/CategoryPage';
import ProductPage from '../pages/ProductPage';
import FavoritesPage from '../pages/FavoritesPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PersonalAreaPage from '../pages/PersonalAreaPage';
import MyPurchasesPage from '../pages/MyPurchasesPage';

// Admin Pages
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminSalesPage from '../pages/AdminSalesPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminCreateProductPage from '../pages/AdminCreateProductPage';
import SearchPage from '../pages/SearchPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/category/:gender/:category" element={<CategoryPage />} />
      <Route path="/product/:id" element={<ProductPage />} />

      {/* Protected User Routes */}
      <Route path="/user/favorites" element={
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      } />
      <Route path="/user/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />
      <Route path="/user/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/user/personal-area" element={
        <ProtectedRoute>
          <PersonalAreaPage />
        </ProtectedRoute>
      } />
      <Route path="/user/purchases" element={
        <ProtectedRoute>
          <MyPurchasesPage />
        </ProtectedRoute>
      } />

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/sales" element={
        <ProtectedRoute adminOnly>
          <AdminSalesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute adminOnly>
          <AdminProductsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/create-product" element={
        <ProtectedRoute adminOnly>
          <AdminCreateProductPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/personal-area" element={
        <ProtectedRoute adminOnly>
          <PersonalAreaPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/edit-product/:id" element={
        <ProtectedRoute adminOnly>
          <AdminEditProductPage />
        </ProtectedRoute>
      } />
      <Route path="/search" element={<SearchPage />} />

      {/* 404 Route */}
      <Route path="*" element={<div>Pagina non trovata</div>} />
    </Routes>
  );
};

export default AppRoutes;
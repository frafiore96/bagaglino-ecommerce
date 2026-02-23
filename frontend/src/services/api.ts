import axios, { AxiosResponse } from 'axios';
import config from '../config/config';

const API_BASE_URL = config.apiBaseUrl;

// Types
interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: 'user' | 'admin';
  phone?: string;
  profile_image?: string;
  billing_address?: string;
  shipping_address?: string;
}

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone?: string;
}

interface Product {
  id: number;
  product_code: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  gender: 'uomo' | 'donna' | 'unisex';
  category: 't-shirt' | 'maglioni' | 'giacche' | 'pantaloni' | 'scarpe' | 'camicie' | 'felpe' | 'giubbotti' | 'accessori';
  stock: number;
  created_at: string;
}

interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  gender: 'uomo' | 'donna' | 'unisex';
  category: 't-shirt' | 'maglioni' | 'giacche' | 'pantaloni' | 'scarpe' | 'camicie' | 'felpe' | 'giubbotti' | 'accessori';
  stock: number;
}

interface OrderData {
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone: string;
  billing_address: string;
  shipping_address: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => 
    api.post('/auth/login.php', { email, password }),
  register: (userData: RegisterData): Promise<AxiosResponse<LoginResponse>> => 
    api.post('/auth/register.php', userData),
  logout: (): Promise<AxiosResponse<{ message: string }>> => 
    api.post('/auth/logout.php'),
};

export const adminAPI = {
  getDashboard: (): Promise<AxiosResponse<any>> => 
    api.get('/admin/dashboard.php'),
  getProducts: (): Promise<AxiosResponse<Product[]>> => 
    api.get('/admin/products.php'),
  createProduct: (productData: ProductFormData): Promise<AxiosResponse<Product>> => 
    api.post('/admin/create-product.php', productData),
  updateProduct: (id: number, productData: ProductFormData): Promise<AxiosResponse<Product>> => 
    api.put(`/admin/update-product.php?id=${id}`, productData),
  deleteProduct: (id: number): Promise<AxiosResponse<{ message: string }>> => 
    api.delete(`/admin/delete-product.php?id=${id}`),
  getSales: (): Promise<AxiosResponse<any>> => 
    api.get('/admin/sales.php'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile.php'),
  updateProfile: (data: any) => api.put('/user/profile.php', data),
  getCart: () => api.get('/user/cart.php'),
  addToCart: (productId: number, quantity: number, size: string) => 
    api.post('/user/cart.php', { product_id: productId, quantity, size }),
  updateCart: (productId: number, quantity: number) => 
    api.put('/user/cart.php', { product_id: productId, quantity }),
  removeFromCart: (productId: number) => 
    api.delete(`/user/cart.php?product_id=${productId}`),
  getFavorites: () => api.get('/user/favorites.php'),
  addFavorite: (productId: number) => 
    api.post('/user/favorites.php', { product_id: productId }),
  removeFavorite: (productId: number) => 
    api.delete(`/user/favorites.php?product_id=${productId}`),
  getPurchases: () => api.get('/user/purchases.php'),
  checkout: (orderData: any) => api.post('/user/checkout.php', orderData)
};

export const productsAPI = {
  getAll: (gender: string = '', category: string = '', search: string = ''): Promise<AxiosResponse<any>> => 
    api.get(`/products/list.php?gender=${gender}&category=${category}&search=${search}`),
  getById: (id: number): Promise<AxiosResponse<Product>> => 
    api.get(`/products/detail.php?id=${id}`),
  search: (query: string): Promise<AxiosResponse<any>> => 
    api.get(`/products/search.php?q=${query}`),
  getCategories: (): Promise<AxiosResponse<any>> => 
    api.get('/products/categories.php'),
  getSizes: (productId: number) => api.get(`/products/sizes.php?product_id=${productId}`)};


export type { User, Product, ProductFormData, OrderData, LoginResponse, RegisterData };
export default api;
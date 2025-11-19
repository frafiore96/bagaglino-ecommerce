import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  quantity: number;
  product_id: number;
  name: string;
  price: string;
  image_url?: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number, size?: string) => Promise<boolean>; // Aggiungi size
  removeFromCart: (productId: number) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum: number, item: CartItem) => {
    if (!item || !item.price) return sum;
    return sum + (Number(item.price) * item.quantity);
  }, 0);

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated()) return;
    
    try {
      setLoading(true);
      const response = await userAPI.getCart();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, size?: string): Promise<boolean> => {
    if (!isAuthenticated()) return false;
    
    if (!size) {
      throw new Error('Taglia richiesta');
    }
  
    try {
      await userAPI.addToCart(productId, quantity, size);
      await refreshCart();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId: number): Promise<boolean> => {
    if (!isAuthenticated()) return false;

    try {
      await userAPI.removeFromCart(productId);
      setItems(items.filter(item => item.product_id !== productId));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateQuantity = async (productId: number, quantity: number): Promise<boolean> => {
    if (!isAuthenticated()) return false;
    if (quantity <= 0) return removeFromCart(productId);

    try {
      await userAPI.updateCart(productId, quantity);
      setItems(items.map(item => 
        item.product_id === productId 
          ? { ...item, quantity }
          : item
      ));
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  };

  const clearCart = (): void => {
    setItems([]);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated()]);

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
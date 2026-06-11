import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '../types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem('cart') || '[]'
      );

      setCart(stored);
    } catch (error) {
      // there should be a logic for better error handling
      console.error(error);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);



  const addToCart = (item: Omit<CartItem, 'productId'> & { productId: string }) => {
    const id = uuidv4();
    console.log('adding to cart, entry id:', id);

    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice };
}

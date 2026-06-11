export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type SearchResult = any;

export type ProductCategory = 'Tools' | 'Fasteners' | 'Safety Equipment' | 'Power Tools';

export type CartCtx = {
  cart: {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'productId'> & { productId: string }) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
  }
}
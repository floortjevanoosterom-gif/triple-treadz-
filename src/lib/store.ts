import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from './data';

export type CartItem = {
  key: string;
  type: 'shoe' | 'lace';
  productId: string;
  name: string;
  price: number;
  size?: string;
  qty: number;
  ph?: string;
  img?: string;
  c1?: string;
  c2?: string;
};

type StoreState = {
  lang: 'nl' | 'en' | 'de' | 'es';
  setLang: (lang: 'nl' | 'en' | 'de' | 'es') => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  stock: Record<string, Record<string, number>>;
  clearCart: () => void;
};

const initialStock: Record<string, Record<string, number>> = {};
PRODUCTS.forEach(p => {
  initialStock[p.id] = { ...p.sizes };
});

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      lang: 'nl',
      setLang: (lang) => set({ lang }),
      cart: [],
      stock: initialStock,
      addToCart: (item) => set((state) => {
    const existing = state.cart.find(c => c.key === item.key);
    let newCart;
    if (existing) {
      newCart = state.cart.map(c => c.key === item.key ? { ...c, qty: c.qty + item.qty } : c);
    } else {
      newCart = [...state.cart, item];
    }
    
    const newStock = { ...state.stock };
    if (item.type === 'shoe' && item.size) {
      newStock[item.productId] = { ...newStock[item.productId] };
      newStock[item.productId][item.size] = Math.max(0, newStock[item.productId][item.size] - item.qty);
    }
    return { cart: newCart, stock: newStock };
  }),
  removeFromCart: (key) => set((state) => {
    const item = state.cart.find(c => c.key === key);
    const newCart = state.cart.filter(c => c.key !== key);
    const newStock = { ...state.stock };
    if (item && item.type === 'shoe' && item.size) {
      newStock[item.productId] = { ...newStock[item.productId] };
      newStock[item.productId][item.size] += item.qty;
    }
    return { cart: newCart, stock: newStock };
  }),
  updateQty: (key, qty) => set((state) => {
    const item = state.cart.find(c => c.key === key);
    if (!item) return state;
    const diff = qty - item.qty;
    
    const newStock = { ...state.stock };
    if (item.type === 'shoe' && item.size) {
       if (newStock[item.productId][item.size] < diff) {
          // not enough stock
          return state;
       }
       newStock[item.productId] = { ...newStock[item.productId] };
       newStock[item.productId][item.size] -= diff;
    }

    if (qty <= 0) {
      return {
        cart: state.cart.filter(c => c.key !== key),
        stock: newStock
      };
    }

    return {
      cart: state.cart.map(c => c.key === key ? { ...c, qty } : c),
      stock: newStock
    };
  }),
  clearCart: () => set({ cart: [] })
    }),
    {
      name: 'triplethreadz-store',
      partialize: (state) => ({ lang: state.lang, cart: state.cart }),
    }
  )
);

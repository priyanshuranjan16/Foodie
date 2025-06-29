'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartItem, MenuItem } from '@/lib/convex';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity?: number; specialInstructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: { menuItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity = 1, specialInstructions } = action.payload;
      const existingItem = state.items.find(item => item.menuItem._id === menuItem._id);

      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.menuItem._id === menuItem._id
            ? { ...item, quantity: item.quantity + quantity, specialInstructions }
            : item
        );
      } else {
        newItems = [...state.items, { menuItem, quantity, specialInstructions }];
      }

      const total = newItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.menuItem._id !== action.payload.menuItemId);
      const total = newItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { menuItemId, quantity } = action.payload;
      const newItems = quantity > 0
        ? state.items.map(item =>
            item.menuItem._id === menuItemId
              ? { ...item, quantity }
              : item
          )
        : state.items.filter(item => item.menuItem._id !== menuItemId);

      const total = newItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };

    case 'LOAD_CART': {
      const items = action.payload;
      const total = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return { items, total, itemCount };
    }

    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodie-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodie-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (menuItem: MenuItem, quantity = 1, specialInstructions?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, quantity, specialInstructions } });
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { menuItemId } });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
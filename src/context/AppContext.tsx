import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { CartItem, Product, User } from '../types';

interface AppState {
  cart: CartItem[];
  wishlist: string[]; // Array of product IDs
  user: User | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  searchQuery: string;
  isAuthModalOpen: boolean;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; selectedColor?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'TOGGLE_WISHLIST' }
  | { type: 'SET_WISHLIST_OPEN'; payload: boolean }
  | { type: 'LOAD_WISHLIST'; payload: string[] }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_AUTH_MODAL' };

const initialState: AppState = {
  cart: [],
  wishlist: [],
  user: null,
  isCartOpen: false,
  isWishlistOpen: false,
  searchQuery: '',
  isAuthModalOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.product.id && 
        item.selectedColor === action.payload.selectedColor
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id && 
            item.selectedColor === action.payload.selectedColor
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, {
          product: action.payload.product,
          quantity: action.payload.quantity,
          selectedColor: action.payload.selectedColor,
        }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    case 'SET_CART_OPEN':
      return { ...state, isCartOpen: action.payload };
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.includes(action.payload)) {
        return state;
      }
      const newWishlist = [...state.wishlist, action.payload];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return { ...state, wishlist: newWishlist };
    case 'REMOVE_FROM_WISHLIST':
      const filteredWishlist = state.wishlist.filter(id => id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
      return { ...state, wishlist: filteredWishlist };
    case 'TOGGLE_WISHLIST':
      return { ...state, isWishlistOpen: !state.isWishlistOpen };
    case 'SET_WISHLIST_OPEN':
      return { ...state, isWishlistOpen: action.payload };
    case 'LOAD_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_AUTH_MODAL':
      return { ...state, isAuthModalOpen: !state.isAuthModalOpen };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load wishlist from localStorage on mount
  React.useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        if (Array.isArray(wishlist)) {
          dispatch({ type: 'LOAD_WISHLIST', payload: wishlist });
        }
      } catch (error) {
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
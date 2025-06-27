export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  material: string;
  colors: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank' | 'cod';
  icon: string;
  isEnabled: boolean;
}

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface BillingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  billingAddress: BillingAddress;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

// Database Types
export interface DatabaseConfig {
  name: string;
  version: string;
  lastUpdated: Date;
}

export interface Collection<T> {
  name: string;
  data: T[];
  indexes: Record<string, any>;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface DatabaseQuery {
  collection: string;
  operation: 'find' | 'findOne' | 'insert' | 'update' | 'delete';
  data?: any;
  query?: any;
  options?: QueryOptions;
}

export interface UserProfile extends User {
  role: 'admin' | 'customer';
  isVerified: boolean;
  avatar?: string;
  lastLoginAt?: Date;
  passwordHash: string; // For authentication
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  };
  addresses: BillingAddress[];
  orders: Order[];
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  lastUpdated: Date;
  location: string;
}

export interface Analytics {
  id: string;
  eventType: 'view' | 'click' | 'purchase' | 'cart_add' | 'cart_remove';
  productId?: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  helpful: number;
  verified: boolean;
}

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  addedAt: Date;
}
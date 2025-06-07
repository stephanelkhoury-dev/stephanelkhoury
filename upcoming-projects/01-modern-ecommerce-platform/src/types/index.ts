export interface User {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'CUSTOMER';
  isVerified: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  categoryId: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  rating?: number;
  reviewCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number;
  sku: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  children?: Category[];
  productCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount?: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Address {
  id?: string;
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    username: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

// Enums
export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export type PaymentMethod = 
  | 'STRIPE'
  | 'PAYPAL'
  | 'BANK_TRANSFER';

export type AddressType = 
  | 'SHIPPING'
  | 'BILLING';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface CheckoutForm {
  email: string;
  shippingAddress: Omit<Address, 'id' | 'type' | 'isDefault'>;
  billingAddress: Omit<Address, 'id' | 'type' | 'isDefault'>;
  sameAsShipping: boolean;
  paymentMethod: PaymentMethod;
}

// Store Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  total: number;
  itemCount: number;
}

export interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

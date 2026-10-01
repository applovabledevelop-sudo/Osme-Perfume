export type Role = 'customer' | 'staff' | 'admin' | 'superadmin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: Role;
  createdAt: string;
  updatedAt?: string;
  disabled?: boolean;
}

export interface ProductVariant {
  id: string;
  size: string; // e.g. "30ml", "50ml", "100ml"
  sku: string;
  price: number;
  stock: number;
  compareAtPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  costPrice?: number;
  category: string;
  collectionId: string;
  collection: string;
  gender: 'unisex' | 'women' | 'men';
  fragranceFamily: string; // "Floral", "Oud", "Fresh", "Oriental", "Woody"
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  size: string; // default size
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  active: boolean;
  images: string[];
  variants: ProductVariant[];
  ingredients?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  itemCount?: number;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item key: productId + variantId
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  sku: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  area?: string;
  address: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  sku: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  amount: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  timesUsed?: number;
  expiryDate?: string;
  active: boolean;
  createdAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  approved: boolean;
  createdAt: string;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  announcementBar: string;
  discountAnnouncement: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroImage: string;
  heroBadge: string;
  feature1Title: string;
  feature1Subtitle: string;
  feature2Title: string;
  feature2Subtitle: string;
  feature3Title: string;
  feature3Subtitle: string;
  shopByScentTitle: string;
  bestSellersTitle: string;
  bestSellersSubtitle: string;
  aboutStory: string;
  aboutPhilosophy: string;
  aboutCraftsmanship: string;
  aboutIngredients: string;
  aboutSustainability: string;
  privacyPolicy: string;
  termsConditions: string;
  shippingPolicy: string;
  returnPolicy: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  pinterest: string;
  youtube: string;
  twitter: string;
  footerText: string;
  copyrightText: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  tags: string[];
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

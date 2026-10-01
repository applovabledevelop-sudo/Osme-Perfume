import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  Product,
  CollectionItem,
  Order,
  Coupon,
  Review,
  WebsiteSettings,
  BlogPost,
  ContactMessage,
  NewsletterSubscriber,
  UserProfile,
  OrderStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COLLECTIONS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_BLOG_POSTS
} from './seedData';

// --- PRODUCTS ---

export async function fetchProducts(): Promise<Product[]> {
  try {
    const q = collection(db, 'products');
    const snap = await getDocs(q);
    if (snap.empty) {
      return INITIAL_PRODUCTS;
    }
    const products: Product[] = [];
    snap.forEach((d) => products.push({ ...(d.data() as Product), id: d.id }));
    return products;
  } catch (error) {
    console.warn('Could not fetch products from Firestore, using initial dataset:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { ...(d.data() as Product), id: d.id };
    }
    // Fallback to initial
    const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    return fallback || null;
  } catch (error) {
    console.warn('Fetch product by slug error:', error);
    return INITIAL_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function saveProduct(product: Partial<Product> & { id: string }): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), {
      ...product,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- COLLECTIONS ---

export async function fetchCollections(): Promise<CollectionItem[]> {
  try {
    const snap = await getDocs(collection(db, 'collections'));
    if (snap.empty) {
      return INITIAL_COLLECTIONS;
    }
    const items: CollectionItem[] = [];
    snap.forEach((d) => items.push({ ...(d.data() as CollectionItem), id: d.id }));
    return items;
  } catch (error) {
    console.warn('Fetch collections error, using initial:', error);
    return INITIAL_COLLECTIONS;
  }
}

export async function saveCollection(col: CollectionItem): Promise<void> {
  const path = `collections/${col.id}`;
  try {
    await setDoc(doc(db, 'collections', col.id), col, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeCollection(colId: string): Promise<void> {
  const path = `collections/${colId}`;
  try {
    await deleteDoc(doc(db, 'collections', colId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- SETTINGS ---

export async function fetchWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (snap.exists()) {
      return { ...INITIAL_SETTINGS, ...(snap.data() as WebsiteSettings) };
    }
    return INITIAL_SETTINGS;
  } catch (error) {
    console.warn('Fetch settings error, using defaults:', error);
    return INITIAL_SETTINGS;
  }
}

export async function saveWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<void> {
  const path = 'settings/general';
  try {
    await setDoc(doc(db, 'settings', 'general'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- COUPONS ---

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const snap = await getDocs(collection(db, 'coupons'));
    if (snap.empty) return INITIAL_COUPONS;
    const list: Coupon[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Coupon), id: d.id }));
    return list;
  } catch (error) {
    console.warn('Fetch coupons error:', error);
    return INITIAL_COUPONS;
  }
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const cleanCode = coupon.code.trim().toUpperCase();
  const path = `coupons/${cleanCode}`;
  try {
    await setDoc(doc(db, 'coupons', cleanCode), {
      ...coupon,
      code: cleanCode,
      createdAt: coupon.createdAt || new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeCoupon(code: string): Promise<void> {
  const path = `coupons/${code}`;
  try {
    await deleteDoc(doc(db, 'coupons', code));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- ORDERS ---

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const list: Order[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Order), id: d.id }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    console.warn('Fetch all orders error:', error);
    return [];
  }
}

export async function fetchOrdersByUser(userId: string): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const list: Order[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Order), id: d.id }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    console.warn('Fetch user orders error:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// --- REVIEWS ---

export async function fetchReviews(productId?: string): Promise<Review[]> {
  try {
    let q = query(collection(db, 'reviews'));
    if (productId) {
      q = query(collection(db, 'reviews'), where('productId', '==', productId));
    }
    const snap = await getDocs(q);
    if (snap.empty) {
      return productId ? INITIAL_REVIEWS.filter(r => r.productId === productId) : INITIAL_REVIEWS;
    }
    const reviews: Review[] = [];
    snap.forEach((d) => reviews.push({ ...(d.data() as Review), id: d.id }));
    return reviews;
  } catch (error) {
    console.warn('Fetch reviews error, using initial:', error);
    return productId ? INITIAL_REVIEWS.filter(r => r.productId === productId) : INITIAL_REVIEWS;
  }
}

export async function submitReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `reviews/${id}`;
  try {
    const newRev: Review = {
      ...review,
      id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'reviews', id), newRev);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateReviewApproval(reviewId: string, approved: boolean): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await updateDoc(doc(db, 'reviews', reviewId), { approved });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function removeReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- BLOG / JOURNAL ---

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const snap = await getDocs(collection(db, 'blogPosts'));
    if (snap.empty) return INITIAL_BLOG_POSTS;
    const posts: BlogPost[] = [];
    snap.forEach((d) => posts.push({ ...(d.data() as BlogPost), id: d.id }));
    return posts;
  } catch (error) {
    console.warn('Fetch blog posts error:', error);
    return INITIAL_BLOG_POSTS;
  }
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  const path = `blogPosts/${post.id}`;
  try {
    await setDoc(doc(db, 'blogPosts', post.id), post, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeBlogPost(postId: string): Promise<void> {
  const path = `blogPosts/${postId}`;
  try {
    await deleteDoc(doc(db, 'blogPosts', postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- CONTACT MESSAGES ---

export async function submitContact(message: { name: string; email: string; phone?: string; message: string }): Promise<void> {
  const id = `msg_${Date.now()}`;
  const path = `contactMessages/${id}`;
  try {
    await setDoc(doc(db, 'contactMessages', id), {
      ...message,
      id,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const snap = await getDocs(collection(db, 'contactMessages'));
    const messages: ContactMessage[] = [];
    snap.forEach((d) => messages.push({ ...(d.data() as ContactMessage), id: d.id }));
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return messages;
  } catch (error) {
    console.warn('Fetch contact messages error:', error);
    return [];
  }
}

// --- NEWSLETTER ---

export async function subscribeNewsletter(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const id = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
  const path = `newsletterSubscribers/${id}`;
  try {
    await setDoc(doc(db, 'newsletterSubscribers', id), {
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      active: true,
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Newsletter submission error:', error);
    return false;
  }
}

export async function fetchNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const snap = await getDocs(collection(db, 'newsletterSubscribers'));
    const subs: NewsletterSubscriber[] = [];
    snap.forEach((d) => subs.push({ ...(d.data() as NewsletterSubscriber), id: d.id }));
    return subs;
  } catch (error) {
    console.warn('Fetch subscribers error:', error);
    return [];
  }
}

// --- USERS & ADMIN CUSTOMERS ---

export async function fetchAllCustomers(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users: UserProfile[] = [];
    snap.forEach((d) => users.push({ ...(d.data() as UserProfile), uid: d.id }));
    return users;
  } catch (error) {
    console.warn('Fetch customers error:', error);
    return [];
  }
}

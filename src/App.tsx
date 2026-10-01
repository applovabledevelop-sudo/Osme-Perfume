import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { QuickViewModal } from './components/QuickViewModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { JournalPage } from './pages/JournalPage';
import { JournalArticlePage } from './pages/JournalArticlePage';
import { PolicyPage } from './pages/PolicyPage';

import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminProducts } from './admin/pages/AdminProducts';
import { AdminOrders } from './admin/pages/AdminOrders';
import { AdminCustomers } from './admin/pages/AdminCustomers';
import { AdminCollections } from './admin/pages/AdminCollections';
import { AdminCoupons } from './admin/pages/AdminCoupons';
import { AdminReviews } from './admin/pages/AdminReviews';
import { AdminBlog } from './admin/pages/AdminBlog';
import { AdminMessages } from './admin/pages/AdminMessages';
import { AdminNewsletter } from './admin/pages/AdminNewsletter';
import { AdminSettings } from './admin/pages/AdminSettings';
import { AdminUsers } from './admin/pages/AdminUsers';
import { AdminLogin } from './admin/pages/AdminLogin';

import { Product, CollectionItem, BlogPost, Order, Coupon, Review, UserProfile } from './types';
import {
  fetchProducts,
  fetchCollections,
  fetchBlogPosts,
  fetchAllOrders,
  fetchCoupons,
  fetchReviews,
  fetchAllCustomers,
  saveProduct,
  removeProduct,
  saveCollection,
  removeCollection,
  updateOrderStatus,
  saveCoupon,
  removeCoupon,
  updateReviewApproval,
  removeReview,
  saveBlogPost,
  removeBlogPost
} from './services/db';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  // Global data
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Admin selected sub-tab
  const [adminTab, setAdminTab] = useState('dashboard');

  // Load database items
  const loadData = async () => {
    try {
      const [prods, cols, blogs, ords, coups, revs, custs] = await Promise.all([
        fetchProducts(),
        fetchCollections(),
        fetchBlogPosts(),
        fetchAllOrders(),
        fetchCoupons(),
        fetchReviews(),
        fetchAllCustomers(),
      ]);
      setProducts(prods);
      setCollections(cols);
      setBlogPosts(blogs);
      setOrders(ords);
      setCoupons(coups);
      setReviews(revs);
      setCustomers(custs);
    } catch (e) {
      console.warn('Initial data load warning:', e);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadData();

    const handlePopState = () => {
      setCurrentRoute(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Data Action Handlers
  const handleSaveProduct = async (prod: Partial<Product> & { id: string }) => {
    await saveProduct(prod);
    const updated = await fetchProducts();
    setProducts(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    await removeProduct(id);
    const updated = await fetchProducts();
    setProducts(updated);
  };

  const handleSaveCollection = async (col: CollectionItem) => {
    await saveCollection(col);
    const updated = await fetchCollections();
    setCollections(updated);
  };

  const handleDeleteCollection = async (id: string) => {
    await removeCollection(id);
    const updated = await fetchCollections();
    setCollections(updated);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    await updateOrderStatus(orderId, status);
    const updated = await fetchAllOrders();
    setOrders(updated);
  };

  const handleSaveCoupon = async (c: Coupon) => {
    await saveCoupon(c);
    const updated = await fetchCoupons();
    setCoupons(updated);
  };

  const handleDeleteCoupon = async (code: string) => {
    await removeCoupon(code);
    const updated = await fetchCoupons();
    setCoupons(updated);
  };

  const handleToggleReview = async (id: string, approved: boolean) => {
    await updateReviewApproval(id, approved);
    const updated = await fetchReviews();
    setReviews(updated);
  };

  const handleDeleteReview = async (id: string) => {
    await removeReview(id);
    const updated = await fetchReviews();
    setReviews(updated);
  };

  const handleSaveBlog = async (p: BlogPost) => {
    await saveBlogPost(p);
    const updated = await fetchBlogPosts();
    setBlogPosts(updated);
  };

  const handleDeleteBlog = async (id: string) => {
    await removeBlogPost(id);
    const updated = await fetchBlogPosts();
    setBlogPosts(updated);
  };

  // Route parsing
  const pathname = currentRoute.split('?')[0];
  const searchParams = new URLSearchParams(currentRoute.split('?')[1] || '');

  // Is Admin Route?
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminLoginRoute = pathname === '/admin/login';

  // Render Page Content
  const renderStorefrontContent = () => {
    if (pathname === '/') {
      return (
        <HomePage
          products={products}
          collections={collections}
          blogPosts={blogPosts}
          onSelectProduct={(p) => navigate(`/product/${p.slug}`)}
          onQuickView={(p) => setQuickViewProduct(p)}
          navigate={navigate}
        />
      );
    }

    if (pathname === '/shop') {
      return (
        <ShopPage
          products={products}
          collections={collections}
          onSelectProduct={(p) => navigate(`/product/${p.slug}`)}
          onQuickView={(p) => setQuickViewProduct(p)}
          initialFilter={searchParams.get('filter')}
          initialCollection={searchParams.get('collection')}
        />
      );
    }

    if (pathname.startsWith('/product/')) {
      const slug = pathname.replace('/product/', '');
      const matched = products.find((p) => p.slug === slug);
      if (matched) {
        return (
          <ProductDetailPage
            product={matched}
            navigate={navigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        );
      }
      return (
        <div className="py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl">Flacon Not Found</h2>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded"
          >
            Return to Boutique
          </button>
        </div>
      );
    }

    if (pathname === '/collections') {
      return <CollectionsPage collections={collections} navigate={navigate} />;
    }

    if (pathname === '/cart') {
      return <CartPage navigate={navigate} />;
    }

    if (pathname === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    if (pathname === '/account') {
      return (
        <AccountPage
          products={products}
          navigate={navigate}
          onOpenAuth={() => setAuthModalOpen(true)}
          initialTab={searchParams.get('tab')}
        />
      );
    }

    if (pathname === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (pathname === '/contact') {
      return <ContactPage />;
    }

    if (pathname === '/journal') {
      return <JournalPage blogPosts={blogPosts} navigate={navigate} />;
    }

    if (pathname.startsWith('/journal/')) {
      const slug = pathname.replace('/journal/', '');
      const post = blogPosts.find((b) => b.slug === slug);
      if (post) {
        return (
          <JournalArticlePage
            post={post}
            products={products}
            navigate={navigate}
            onSelectProduct={(p) => navigate(`/product/${p.slug}`)}
          />
        );
      }
      return (
        <div className="py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl">Article Not Found</h2>
          <button
            type="button"
            onClick={() => navigate('/journal')}
            className="px-6 py-2 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded"
          >
            Back to Journal
          </button>
        </div>
      );
    }

    if (pathname === '/privacy' || pathname === '/terms' || pathname === '/shipping' || pathname === '/returns') {
      const pTab = pathname.replace('/', '') as any;
      return <PolicyPage initialTab={pTab} />;
    }

    // Default Fallback
    return (
      <HomePage
        products={products}
        collections={collections}
        blogPosts={blogPosts}
        onSelectProduct={(p) => navigate(`/product/${p.slug}`)}
        onQuickView={(p) => setQuickViewProduct(p)}
        navigate={navigate}
      />
    );
  };

  // Render Admin Content
  const renderAdminContent = () => {
    switch (adminTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            orders={orders}
            products={products}
            customers={customers}
            onSelectTab={setAdminTab}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'products':
        return (
          <AdminProducts
            products={products}
            collections={collections}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'orders':
        return (
          <AdminOrders
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'customers':
        return <AdminCustomers customers={customers} orders={orders} />;
      case 'collections':
        return (
          <AdminCollections
            collections={collections}
            onSaveCollection={handleSaveCollection}
            onDeleteCollection={handleDeleteCollection}
          />
        );
      case 'coupons':
        return (
          <AdminCoupons
            coupons={coupons}
            onSaveCoupon={handleSaveCoupon}
            onDeleteCoupon={handleDeleteCoupon}
          />
        );
      case 'reviews':
        return (
          <AdminReviews
            reviews={reviews}
            onToggleApproval={handleToggleReview}
            onDeleteReview={handleDeleteReview}
          />
        );
      case 'blog':
        return (
          <AdminBlog
            blogPosts={blogPosts}
            onSaveBlogPost={handleSaveBlog}
            onDeleteBlogPost={handleDeleteBlog}
          />
        );
      case 'messages':
        return <AdminMessages />;
      case 'newsletter':
        return <AdminNewsletter />;
      case 'settings':
        return <AdminSettings />;
      case 'users':
        return <AdminUsers />;
      default:
        return (
          <AdminDashboard
            orders={orders}
            products={products}
            customers={customers}
            onSelectTab={setAdminTab}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
    }
  };

  if (isAdminLoginRoute) {
    return <AdminLogin navigate={navigate} />;
  }

  if (isAdminRoute) {
    return (
      <AdminLayout currentTab={adminTab} onSelectTab={setAdminTab} navigate={navigate}>
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Header */}
      <Header
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentRoute={currentRoute}
        navigate={navigate}
      />

      {/* Main Page Content */}
      <main className="flex-1">{renderStorefrontContent()}</main>

      {/* Footer */}
      <Footer navigate={navigate} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer navigate={navigate} />

      {/* Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onSelectProduct={(p) => navigate(`/product/${p.slug}`)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        navigate={navigate}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewProductDetail={(p) => navigate(`/product/${p.slug}`)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Package,
  Heart,
  User as UserIcon,
  MapPin,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Order, Product } from '../types';
import { fetchOrdersByUser } from '../services/db';

interface AccountPageProps {
  products: Product[];
  navigate: (route: string) => void;
  onOpenAuth: () => void;
  initialTab?: string | null;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  products,
  navigate,
  onOpenAuth,
  initialTab,
}) => {
  const { user, profile, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses'>(
    (initialTab as any) || 'orders'
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  useEffect(() => {
    const loadUserOrders = async () => {
      if (user?.uid) {
        setLoadingOrders(true);
        try {
          const ords = await fetchOrdersByUser(user.uid);
          setOrders(ords);
        } catch (e) {
          console.warn('Orders load error:', e);
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    loadUserOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="w-full bg-[#FAF7F2] py-20 border-b border-[#E8E2D7]">
        <div className="max-w-md mx-auto px-4 text-center space-y-5 bg-white p-8 rounded-2xl border border-[#E8E2D7] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center mx-auto text-[#C5A059]">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-[#141312]">
            Client Account Portal
          </h1>
          <p className="text-xs text-[#7A756D] leading-relaxed">
            Please sign in to inspect your order dossiers, tracking numbers, and bespoke fragrance preferences.
          </p>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-3 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-wider font-semibold rounded-lg transition-colors shadow"
          >
            SIGN IN OR REGISTER
          </button>
        </div>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full text-xs font-semibold">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold">In Atelier Preparation</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 bg-purple-50 text-purple-800 rounded-full text-xs font-semibold">Shipped via Courier</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">Delivered</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold capitalize">{status}</span>;
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] py-10 sm:py-16 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Bar */}
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#C5A059] flex items-center justify-center text-[#141312] font-serif text-2xl font-bold">
              {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'L'}
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
                Privilege Member
              </span>
              <h1 className="font-serif text-2xl font-semibold text-[#141312]">
                {profile?.displayName || 'Client'}
              </h1>
              <p className="text-xs text-[#7A756D]">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-5 py-2 border border-[#E8E2D7] text-[#7A756D] hover:text-red-600 hover:border-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Grid layout: Sidebar Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-xl border border-[#E8E2D7] p-3 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#141312] text-[#E2C98D]'
                    : 'text-[#252320] hover:bg-[#FAF7F2]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Orders & Tracking ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-colors ${
                  activeTab === 'wishlist'
                    ? 'bg-[#141312] text-[#E2C98D]'
                    : 'text-[#252320] hover:bg-[#FAF7F2]'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist ({wishlist.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#141312] text-[#E2C98D]'
                    : 'text-[#252320] hover:bg-[#FAF7F2]'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Profile Credentials</span>
              </button>
            </div>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-9">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D7]">
                  <h2 className="font-serif text-xl font-semibold text-[#141312]">
                    Order History & Dispatches
                  </h2>
                  <span className="text-xs text-[#7A756D]">{orders.length} Records</span>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-[#7A756D]">
                    Retrieving orders from atelier database...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Package className="w-10 h-10 text-[#D8CFBE] mx-auto" />
                    <h3 className="font-serif text-lg text-[#141312]">No order records yet</h3>
                    <p className="text-xs text-[#7A756D]">
                      When you acquire fragrances from Luxora, your orders and tracking details will appear here.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors"
                    >
                      Browse Boutique
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-4 hover:border-[#C5A059]/40 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D7]">
                          <div>
                            <span className="font-serif font-bold text-base text-[#141312] block">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-[#7A756D]">
                              Placed on {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            {getStatusBadge(ord.status)}
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="text-xs font-semibold text-[#C5A059] hover:underline"
                            >
                              View Details
                            </button>
                          </div>
                        </div>

                        {/* Order Items preview */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <img
                              src={ord.items[0]?.image || '/images/hero_perfume.jpg'}
                              alt=""
                              className="w-12 h-12 object-cover rounded bg-white border border-[#E8E2D7]"
                            />
                            <div>
                              <div className="font-semibold text-[#141312]">
                                {ord.items[0]?.name}
                                {ord.items.length > 1 && ` and ${ord.items.length - 1} other item(s)`}
                              </div>
                              <div className="text-[11px] text-[#7A756D]">
                                Tracking: <span className="font-mono text-[#141312]">{ord.trackingNumber || 'Pending Courier Scan'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-serif text-base font-bold text-[#141312]">
                              ${ord.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D7]">
                  <h2 className="font-serif text-xl font-semibold text-[#141312]">
                    My Curated Fragrance Wishlist
                  </h2>
                  <span className="text-xs text-[#7A756D]">{wishlistProducts.length} Fragrances</span>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Heart className="w-10 h-10 text-[#D8CFBE] mx-auto" />
                    <h3 className="font-serif text-lg text-[#141312]">Your wishlist is empty</h3>
                    <p className="text-xs text-[#7A756D]">
                      Save fragrances to your private vault as you explore the boutique.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors"
                    >
                      Explore Fragrances
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] flex space-x-3 items-center"
                      >
                        <img
                          src={p.images?.[0] || '/images/hero_perfume.jpg'}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg bg-white border border-[#E8E2D7]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-semibold text-sm text-[#141312] truncate">
                            {p.name}
                          </h4>
                          <div className="text-xs text-[#C5A059] font-bold">
                            ${p.price.toFixed(2)}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => addToCart(p)}
                              className="px-3 py-1 bg-[#141312] text-[#E2C98D] text-[11px] font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors flex items-center space-x-1"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add to Bag</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(p.id)}
                              className="text-[11px] text-[#A09A90] hover:text-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#E8E2D7]">
                  <h2 className="font-serif text-xl font-semibold text-[#141312]">
                    Profile Credentials
                  </h2>
                  <p className="text-xs text-[#7A756D] mt-0.5">
                    Your personal identification and concierge preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7]">
                    <span className="text-[#A09A90] text-[10px] uppercase font-bold block">
                      Full Name
                    </span>
                    <span className="font-semibold text-sm text-[#141312]">
                      {profile?.displayName || 'Valued Client'}
                    </span>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7]">
                    <span className="text-[#A09A90] text-[10px] uppercase font-bold block">
                      Email Address
                    </span>
                    <span className="font-semibold text-sm text-[#141312]">{user.email}</span>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7]">
                    <span className="text-[#A09A90] text-[10px] uppercase font-bold block">
                      Client ID
                    </span>
                    <span className="font-mono text-xs text-[#141312]">{user.uid}</span>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7]">
                    <span className="text-[#A09A90] text-[10px] uppercase font-bold block">
                      Privilege Tier
                    </span>
                    <span className="font-semibold text-xs text-[#C5A059] uppercase">
                      {profile?.role || 'Valued Patron'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#141312]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto border border-[#E8E2D7] shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-[#E8E2D7]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A09A90] font-bold">
                  Order Dossier
                </span>
                <h3 className="font-serif text-xl font-bold text-[#141312]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-xs text-[#7A756D] hover:text-[#141312] p-1 font-semibold"
              >
                Close ✕
              </button>
            </div>

            {/* Tracking & Status */}
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7A756D]">Status:</span>
                <strong className="text-[#141312] capitalize">{selectedOrder.status}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A756D]">Courier Tracking:</span>
                <strong className="font-mono text-[#C5A059]">{selectedOrder.trackingNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A756D]">Delivery Method:</span>
                <span className="text-[#141312]">{selectedOrder.shippingMethod}</span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-[#E8E2D7] text-xs">
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img src={it.image} alt="" className="w-10 h-10 object-cover rounded bg-[#FAF7F2]" />
                    <div>
                      <div className="font-semibold text-[#141312]">{it.name}</div>
                      <div className="text-[11px] text-[#7A756D]">
                        {it.size} • Qty: {it.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-[#141312]">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E8E2D7] text-xs text-[#7A756D] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${selectedOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#141312] pt-1">
                <span>Total</span>
                <span className="font-serif text-base text-[#C5A059]">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

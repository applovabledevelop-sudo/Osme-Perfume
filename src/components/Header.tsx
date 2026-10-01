import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAuth, currentRoute, navigate }) => {
  const { itemCount, openCartDrawer } = useCart();
  const { wishlist } = useWishlist();
  const { user, profile, isAdmin, logout } = useAuth();
  const { settings } = useSettings();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', route: '/' },
    { label: 'SHOP', route: '/shop' },
    { label: 'COLLECTIONS', route: '/collections' },
    { label: 'BEST SELLERS', route: '/shop?filter=best-sellers' },
    { label: 'ABOUT US', route: '/about' },
    { label: 'JOURNAL', route: '/journal' },
    { label: 'CONTACT', route: '/contact' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full z-40 relative">
      {/* Announcement Bar */}
      {settings.announcementBar && (
        <div className="bg-[#141312] text-[#E2C98D] text-[11px] tracking-[0.2em] font-medium py-2 px-4 text-center border-b border-[#252320] uppercase transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <span>{settings.announcementBar}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D7] py-3'
            : 'bg-[#FAF7F2] border-b border-[#E8E2D7]/60 py-4 lg:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#141312] hover:text-[#C5A059] transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <button
                type="button"
                onClick={() => handleNavClick('/')}
                className="inline-block text-left group focus:outline-none"
              >
                <div className="font-serif tracking-[0.25em] text-2xl lg:text-3xl font-semibold text-[#141312] group-hover:text-[#C5A059] transition-colors">
                  {settings.brandName?.toUpperCase() || 'LUXORA'}
                </div>
                <div className="text-[9px] tracking-[0.4em] text-[#7A756D] -mt-1 font-medium text-center uppercase">
                  {settings.tagline || 'PERFUMES'}
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive =
                  currentRoute === link.route ||
                  (link.route.includes('?') && currentRoute.includes(link.route.split('?')[1]));
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavClick(link.route)}
                    className={`text-[12px] tracking-[0.2em] font-medium transition-colors relative py-1 hover:text-[#C5A059] ${
                      isActive ? 'text-[#C5A059]' : 'text-[#252320]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A059]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-[#141312] hover:text-[#C5A059] transition-colors"
                title="Search Fragrances"
                aria-label="Search Fragrances"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => handleNavClick('/account?tab=wishlist')}
                className="p-2 text-[#141312] hover:text-[#C5A059] transition-colors relative"
                title="My Wishlist"
                aria-label="My Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A059] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      onOpenAuth();
                    } else {
                      setUserMenuOpen(!userMenuOpen);
                    }
                  }}
                  className="p-2 text-[#141312] hover:text-[#C5A059] transition-colors flex items-center space-x-1"
                  title={user ? profile?.displayName || 'My Account' : 'Sign In'}
                  aria-label="Account Options"
                >
                  <UserIcon className="w-5 h-5 stroke-[1.75]" />
                  {user && <ChevronDown className="w-3.5 h-3.5 text-[#7A756D]" />}
                </button>

                {/* Dropdown Menu when signed in */}
                {user && userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-xl border border-[#E8E2D7] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#F4EFE6]">
                      <div className="text-xs font-semibold text-[#141312] truncate">
                        {profile?.displayName || 'Client'}
                      </div>
                      <div className="text-[11px] text-[#7A756D] truncate">{user.email}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleNavClick('/account');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#252320] hover:bg-[#FAF7F2] hover:text-[#C5A059] transition-colors"
                    >
                      My Dashboard & Orders
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleNavClick('/account?tab=wishlist');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#252320] hover:bg-[#FAF7F2] hover:text-[#C5A059] transition-colors"
                    >
                      My Wishlist ({wishlist.length})
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-[#C5A059] hover:bg-[#FAF7F2] flex items-center justify-between border-t border-[#F4EFE6]"
                      >
                        <span>Admin Dashboard</span>
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="border-t border-[#F4EFE6] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Bag / Cart */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="p-2 text-[#141312] hover:text-[#C5A059] transition-colors relative flex items-center"
                title="Shopping Bag"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#141312] text-[#E2C98D] text-[9px] font-bold rounded-full flex items-center justify-center ring-1 ring-white">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8E2D7] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavClick(link.route)}
                  className="text-left py-2.5 px-3 text-xs tracking-[0.2em] font-medium text-[#141312] hover:bg-[#F4EFE6] rounded transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {isAdmin && (
              <div className="pt-2 border-t border-[#E8E2D7]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full py-2.5 px-3 text-xs tracking-[0.2em] font-bold text-[#C5A059] bg-[#141312] rounded flex items-center justify-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>ADMIN DASHBOARD</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

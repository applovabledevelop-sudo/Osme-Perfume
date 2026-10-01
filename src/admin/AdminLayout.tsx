import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Star,
  Tag,
  BookOpen,
  Mail,
  Send,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  navigate: (route: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  navigate,
  children,
}) => {
  const { user, profile, role, isAdmin, isSuperAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not authorized
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#141312] text-[#F4EFE6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1F1D1B] rounded-2xl border border-[#3A3631] p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#141312] border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059]">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#C5A059] uppercase font-bold">
              Access Restricted
            </span>
            <h1 className="font-serif text-2xl font-semibold mt-1">
              Atelier Management Portal
            </h1>
            <p className="text-xs text-[#A09A90] mt-2 leading-relaxed">
              Administrative credentials with verified role permissions are required to access this console.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="w-full py-3 bg-[#C5A059] text-[#141312] hover:bg-[#D4AF37] text-xs tracking-widest font-bold rounded-lg transition-colors shadow"
            >
              SIGN IN TO ATELIER CONSOLE
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 border border-[#3A3631] text-[#A09A90] hover:text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Flacons', icon: Package },
    { id: 'orders', label: 'Orders & Dispatches', icon: ShoppingCart },
    { id: 'customers', label: 'Customer Accounts', icon: Users },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'coupons', label: 'Promotional Vouchers', icon: Tag },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'blog', label: 'Journal & Editorial', icon: BookOpen },
    { id: 'messages', label: 'Client Inquiries', icon: Mail },
    { id: 'newsletter', label: 'Newsletter Subscribers', icon: Send },
    { id: 'settings', label: 'Website Customization', icon: Settings },
    { id: 'users', label: 'Admin Roles & Access', icon: Shield, superOnly: true },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex text-[#141312]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#141312] text-[#F4EFE6] border-r border-[#252320] shrink-0 sticky top-0 h-screen">
        {/* Brand header */}
        <div className="p-6 border-b border-[#252320]">
          <div className="font-serif tracking-[0.2em] text-xl font-bold text-[#E2C98D]">
            {settings.brandName?.toUpperCase() || 'LUXORA'}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[9px] tracking-[0.3em] text-[#C5A059] uppercase font-bold">
              ATELIER CONSOLE
            </span>
            <span className="px-1.5 py-0.2 bg-[#252320] text-[#E2C98D] text-[9px] rounded font-mono uppercase">
              {role}
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            if (item.superOnly && !isSuperAdmin) return null;
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-3 transition-colors ${
                  isActive
                    ? 'bg-[#C5A059] text-[#141312] shadow'
                    : 'text-[#A09A90] hover:bg-[#1F1D1B] hover:text-[#F4EFE6]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#252320] space-y-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-2 px-3 rounded-lg text-xs text-[#E2C98D] hover:bg-[#1F1D1B] flex items-center space-x-2 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Storefront</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full py-2 px-3 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-[#141312] text-[#F4EFE6] px-4 py-3 border-b border-[#252320] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1 text-[#E2C98D]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-serif tracking-widest text-lg font-bold text-[#E2C98D]">
              LUXORA ATELIER
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-[#C5A059] flex items-center space-x-1"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-[#141312] text-[#F4EFE6] p-4 flex flex-col h-full z-10">
              <div className="flex justify-between items-center pb-4 border-b border-[#252320]">
                <div className="font-serif text-lg text-[#E2C98D] font-bold">LUXORA ADMIN</div>
                <button type="button" onClick={() => setMobileSidebarOpen(false)} className="text-[#A09A90]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-1">
                {menuItems.map((item) => {
                  if (item.superOnly && !isSuperAdmin) return null;
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-3 transition-colors ${
                        isActive
                          ? 'bg-[#C5A059] text-[#141312]'
                          : 'text-[#A09A90] hover:bg-[#1F1D1B]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#252320]">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2 text-xs text-rose-400 flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Body content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

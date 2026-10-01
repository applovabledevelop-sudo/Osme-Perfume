import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  navigate: (route: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const { loginWithGoogle, loginWithEmail, user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated as admin
  if (user && isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('Invalid administrative credentials or insufficient authorization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141312] text-[#F4EFE6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1F1D1B] rounded-2xl border border-[#3A3631] p-8 shadow-2xl space-y-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs text-[#A09A90] hover:text-[#E2C98D] flex items-center space-x-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#141312] border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059] shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[10px] tracking-[0.3em] text-[#C5A059] uppercase font-bold block">
            Security Gateway
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#F4EFE6]">
            Atelier Administrative Portal
          </h1>
          <p className="text-xs text-[#A09A90] leading-relaxed">
            Restricted to certified Luxora curators, inventory managers, and super administrators.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Admin Login */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 px-4 bg-white text-[#141312] font-semibold text-xs rounded-lg hover:bg-[#F4EFE6] transition-colors flex items-center justify-center space-x-2 shadow disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign In with Primary Admin Google Account</span>
        </button>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#3A3631]" />
          </div>
          <span className="relative bg-[#1F1D1B] px-3 text-[10px] uppercase tracking-wider text-[#A09A90]">
            Or email authentication
          </span>
        </div>

        {/* Email login */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#D8CFBE] font-semibold mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A09A90] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@luxoraperfumes.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#141312] border border-[#3A3631] text-[#F4EFE6] rounded-lg focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D8CFBE] font-semibold mb-1">Passphrase</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A09A90] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#141312] border border-[#3A3631] text-[#F4EFE6] rounded-lg focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C5A059] text-[#141312] hover:bg-[#D4AF37] font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors shadow disabled:opacity-50"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'ENTER ATELIER CONSOLE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

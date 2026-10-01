import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, Twitter, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { subscribeNewsletter } from '../services/db';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    const ok = await subscribeNewsletter(email);
    setSubmitting(false);
    if (ok) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleNav = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141312] text-[#F4EFE6] border-t border-[#252320] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#252320]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-[0.25em] font-semibold text-[#F4EFE6] block">
                {settings.brandName?.toUpperCase() || 'LUXORA PERFUMES'}
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#C5A059] uppercase block mt-0.5">
                {settings.tagline || 'ELEGANCE IN EVERY NOTE'}
              </span>
            </div>
            <p className="text-xs text-[#A09A90] leading-relaxed max-w-sm">
              {settings.footerText ||
                'Artisanal haute parfumerie conceived for connoisseurs who appreciate the alchemy of rare botanicals and crystalline elegance.'}
            </p>
            <div className="text-xs text-[#C5A059] space-y-1 pt-2">
              <div>{settings.address}</div>
              <div>{settings.contactEmail} | {settings.contactPhone}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#E2C98D] uppercase">
              Boutique
            </h4>
            <ul className="space-y-2 text-xs text-[#A09A90]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/shop')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  All Fragrances
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/collections')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  Collections by Scent
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/shop?filter=best-sellers')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/shop?filter=new-arrivals')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Maison & Editorial */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#E2C98D] uppercase">
              Maison
            </h4>
            <ul className="space-y-2 text-xs text-[#A09A90]">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/about')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  Our Heritage & Craft
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/journal')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  The Perfumer’s Journal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/contact')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  Atelier & Concierge
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/privacy')}
                  className="hover:text-[#F4EFE6] transition-colors"
                >
                  Client Policies
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#E2C98D] uppercase">
              Privilege Club
            </h4>
            <p className="text-xs text-[#A09A90] leading-relaxed">
              Receive private invitations to limited batch harvests and complimentary olfactory discovery sets.
            </p>

            {subscribed ? (
              <div className="bg-[#1F1D1B] border border-[#C5A059]/40 p-3 rounded text-xs text-[#E2C98D] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                <span>You are now subscribed to the Luxora Journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-[#1F1D1B] border border-[#3A3631] text-xs text-[#F4EFE6] px-3 py-2.5 rounded focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-[#656057]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#C5A059] hover:bg-[#D4AF37] text-[#141312] text-xs font-semibold rounded flex items-center transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-[#656057]">
                  Enjoy 10% off your first acquisition with code <strong className="text-[#C5A059]">WELCOME10</strong>.
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Social & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7A756D]">
          <div>{settings.copyrightText || '© 2026 Luxora Perfumes Inc. All rights reserved.'}</div>

          {/* Social Links */}
          <div className="flex items-center space-x-5 text-[#A09A90]">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A059] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A059] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A059] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A059] transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Security & Payment Badges */}
          <div className="flex items-center space-x-3 text-[10px] tracking-wider uppercase text-[#A09A90]">
            <span className="border border-[#252320] px-2 py-0.5 rounded">PCI-DSS Encrypted</span>
            <span className="border border-[#252320] px-2 py-0.5 rounded">Handcrafted in NY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

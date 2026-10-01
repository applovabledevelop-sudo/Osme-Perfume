import React, { useState } from 'react';
import { Shield, FileText, Truck, RotateCcw } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface PolicyPageProps {
  initialTab?: 'privacy' | 'terms' | 'shipping' | 'returns';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'privacy' }) => {
  const { settings } = useSettings();
  const [tab, setTab] = useState<'privacy' | 'terms' | 'shipping' | 'returns'>(initialTab);

  return (
    <div className="w-full bg-[#FAF7F2] py-12 sm:py-20 border-b border-[#E8E2D7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
            Legal & Maison Charters
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141312] mt-2">
            Client Policies & Guarantees
          </h1>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#E8E2D7] overflow-x-auto space-x-6 text-xs font-semibold mb-8 justify-center">
          <button
            type="button"
            onClick={() => setTab('privacy')}
            className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              tab === 'privacy'
                ? 'border-[#C5A059] text-[#141312]'
                : 'border-transparent text-[#7A756D] hover:text-[#141312]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('terms')}
            className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              tab === 'terms'
                ? 'border-[#C5A059] text-[#141312]'
                : 'border-transparent text-[#7A756D] hover:text-[#141312]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms & Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('shipping')}
            className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              tab === 'shipping'
                ? 'border-[#C5A059] text-[#141312]'
                : 'border-transparent text-[#7A756D] hover:text-[#141312]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('returns')}
            className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              tab === 'returns'
                ? 'border-[#C5A059] text-[#141312]'
                : 'border-transparent text-[#7A756D] hover:text-[#141312]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return Policy</span>
          </button>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-8 sm:p-12 shadow-sm prose text-xs sm:text-sm text-[#252320] leading-relaxed whitespace-pre-line">
          {tab === 'privacy' && (
            <div>
              <h2 className="font-serif text-2xl text-[#141312] mb-4">Privacy Charter</h2>
              <p>{settings.privacyPolicy}</p>
            </div>
          )}

          {tab === 'terms' && (
            <div>
              <h2 className="font-serif text-2xl text-[#141312] mb-4">Terms & Conditions</h2>
              <p>{settings.termsConditions}</p>
            </div>
          )}

          {tab === 'shipping' && (
            <div>
              <h2 className="font-serif text-2xl text-[#141312] mb-4">White-Glove Shipping Policy</h2>
              <p>{settings.shippingPolicy}</p>
            </div>
          )}

          {tab === 'returns' && (
            <div>
              <h2 className="font-serif text-2xl text-[#141312] mb-4">30-Day Flacon Return Policy</h2>
              <p>{settings.returnPolicy}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

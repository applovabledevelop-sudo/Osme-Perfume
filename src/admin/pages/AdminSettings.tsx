import React, { useState } from 'react';
import { Save, Check, RefreshCw, Sparkles, Globe, Layout, Palette, Shield, Share2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { WebsiteSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, reloadSettings } = useSettings();
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'general' | 'homepage' | 'header_footer' | 'social' | 'policies'>('general');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof WebsiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update website settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
            Live Configuration Engine
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
            Website Customization & Branding
          </h1>
          <p className="text-xs text-[#7A756D] mt-1">
            Modifications saved here persist immediately to Firestore and update the public storefront in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow self-start disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Publishing Changes...' : 'Save All Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Website settings successfully saved to Firestore and synchronized across storefront!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#E8E2D7] overflow-x-auto space-x-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'general' ? 'border-[#C5A059] text-[#141312]' : 'border-transparent text-[#7A756D]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>General & Concierge</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('homepage')}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'homepage' ? 'border-[#C5A059] text-[#141312]' : 'border-transparent text-[#7A756D]'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Hero & Homepage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('header_footer')}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'header_footer' ? 'border-[#C5A059] text-[#141312]' : 'border-transparent text-[#7A756D]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Header, Footer & Announcement</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'social' ? 'border-[#C5A059] text-[#141312]' : 'border-transparent text-[#7A756D]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social Media Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'policies' ? 'border-[#C5A059] text-[#141312]' : 'border-transparent text-[#7A756D]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Brand Policies & Charters</span>
        </button>
      </div>

      {/* Tab Panes */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-8 shadow-sm space-y-6 text-xs">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#141312]">
              General Atelier Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={(e) => handleChange('brandName', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Currency Code</label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F4EFE6] space-y-4">
              <h4 className="font-serif text-base font-semibold text-[#141312]">
                Contact & Atelier Concierge
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Concierge Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Atelier Flagship Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'homepage' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#141312]">
              Hero Section Customization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Hero Small Subtitle</label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Hero Floating Badge</label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => handleChange('heroBadge', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Hero Main Title (Multiline supported)</label>
              <textarea
                rows={2}
                value={formData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Hero Supporting Text</label>
              <textarea
                rows={3}
                value={formData.heroDescription}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Hero Button Label</label>
                <input
                  type="text"
                  value={formData.heroButtonText}
                  onChange={(e) => handleChange('heroButtonText', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F4EFE6] space-y-3">
              <h4 className="font-serif text-base font-semibold text-[#141312]">
                Three Feature Highlights
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E2D7] space-y-2">
                  <input
                    type="text"
                    value={formData.feature1Title}
                    onChange={(e) => handleChange('feature1Title', e.target.value)}
                    placeholder="Feature 1 Title"
                    className="w-full p-1.5 bg-white border border-[#E8E2D7] rounded font-semibold text-xs"
                  />
                  <input
                    type="text"
                    value={formData.feature1Subtitle}
                    onChange={(e) => handleChange('feature1Subtitle', e.target.value)}
                    placeholder="Feature 1 Subtitle"
                    className="w-full p-1.5 bg-white border border-[#E8E2D7] rounded text-xs"
                  />
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E2D7] space-y-2">
                  <input
                    type="text"
                    value={formData.feature2Title}
                    onChange={(e) => handleChange('feature2Title', e.target.value)}
                    placeholder="Feature 2 Title"
                    className="w-full p-1.5 bg-white border border-[#E8E2D7] rounded font-semibold text-xs"
                  />
                  <input
                    type="text"
                    value={formData.feature2Subtitle}
                    onChange={(e) => handleChange('feature2Subtitle', e.target.value)}
                    placeholder="Feature 2 Subtitle"
                    className="w-full p-1.5 bg-white border border-[#E8E2D7] rounded text-xs"
                  />
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E2D7] space-y-2">
                  <input
                    type="text"
                    value={formData.feature3Title}
                    onChange={(e) => handleChange('feature3Title', e.target.value)}
                    placeholder="Feature 3 Title"
                    className="w-full p-1.5 bg-white border border-[#E8E2D7] rounded font-semibold text-xs"
                  />
                  <input
                    type="text"
                    value={formData.feature3Subtitle}
                    onChange={(e) => handleChange('feature3Subtitle', e.target.value)}
                    placeholder="Feature 3 Subtitle"
                    className="w-full p-1.5 bg-white border border-[#E8E2D7] rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'header_footer' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#141312]">
              Header & Footer Text
            </h3>

            <div>
              <label className="block font-semibold mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={formData.announcementBar}
                onChange={(e) => handleChange('announcementBar', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Discount Announcement Text</label>
              <input
                type="text"
                value={formData.discountAnnouncement}
                onChange={(e) => handleChange('discountAnnouncement', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Footer Brand Statement</label>
              <textarea
                rows={2}
                value={formData.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Copyright Line</label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#141312]">
              Social Media Connections
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">TikTok URL</label>
                <input
                  type="url"
                  value={formData.tiktok}
                  onChange={(e) => handleChange('tiktok', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Pinterest URL</label>
                <input
                  type="url"
                  value={formData.pinterest}
                  onChange={(e) => handleChange('pinterest', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={formData.youtube}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">X (Twitter) URL</label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#141312]">
              Brand Charters & Policies
            </h3>

            <div>
              <label className="block font-semibold mb-1">Privacy Policy</label>
              <textarea
                rows={3}
                value={formData.privacyPolicy}
                onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Terms & Conditions</label>
              <textarea
                rows={3}
                value={formData.termsConditions}
                onChange={(e) => handleChange('termsConditions', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Shipping Policy</label>
              <textarea
                rows={3}
                value={formData.shippingPolicy}
                onChange={(e) => handleChange('shippingPolicy', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Return Policy</label>
              <textarea
                rows={3}
                value={formData.returnPolicy}
                onChange={(e) => handleChange('returnPolicy', e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#E8E2D7] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Publishing Changes...' : 'Save Settings to Firestore'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

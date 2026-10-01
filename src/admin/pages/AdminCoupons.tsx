import React, { useState } from 'react';
import { Plus, Trash2, Tag, Check, X } from 'lucide-react';
import { Coupon } from '../../types';

interface AdminCouponsProps {
  coupons: Coupon[];
  onSaveCoupon: (coupon: Coupon) => Promise<void>;
  onDeleteCoupon: (code: string) => Promise<void>;
}

export const AdminCoupons: React.FC<AdminCouponsProps> = ({
  coupons,
  onSaveCoupon,
  onDeleteCoupon,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [amount, setAmount] = useState(10);
  const [minOrder, setMinOrder] = useState(50);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(50);
  const [usageLimit, setUsageLimit] = useState(500);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setCode('');
    setType('percentage');
    setAmount(10);
    setMinOrder(50);
    setMaxDiscount(50);
    setUsageLimit(500);
    setExpiryDate('2026-12-31');
    setActive(true);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setSaving(true);
    try {
      await onSaveCoupon({
        code: code.trim().toUpperCase(),
        type,
        amount: Number(amount),
        minOrder: Number(minOrder),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        usageLimit: Number(usageLimit),
        timesUsed: 0,
        expiryDate,
        active,
        createdAt: new Date().toISOString(),
      });
      setModalOpen(false);
    } catch (e) {
      console.error('Error saving coupon:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c: Coupon) => {
    await onSaveCoupon({
      ...c,
      active: !c.active,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
            Promotional Engine
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
            Coupon & Voucher Management
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Voucher</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Order</th>
                <th className="py-3 px-4">Max. Discount</th>
                <th className="py-3 px-4">Times Redeemed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D7]">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#141312]">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#C5A059]">
                    {c.type === 'percentage' ? `${c.amount}% OFF` : `$${c.amount} FIXED`}
                  </td>
                  <td className="py-3.5 px-4 text-[#7A756D]">${c.minOrder || 0}</td>
                  <td className="py-3.5 px-4 text-[#7A756D]">
                    {c.maxDiscount ? `$${c.maxDiscount}` : 'None'}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{c.timesUsed || 0} / {c.usageLimit || '∞'}</td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        c.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete coupon ${c.code}?`)) {
                          onDeleteCoupon(c.code);
                        }
                      }}
                      className="p-1.5 text-[#7A756D] hover:text-red-600 rounded transition-colors"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141312]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-[#E8E2D7] shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D7]">
              <h3 className="font-serif text-xl font-bold text-[#141312]">Create Discount Voucher</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-xs text-[#7A756D] hover:text-[#141312] p-1 font-semibold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. LUXURY25"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Min. Order ($)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Max Discount ($)</label>
                  <input
                    type="number"
                    value={maxDiscount || ''}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>Active & Valid for immediate redemption</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-lg text-[#7A756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] font-semibold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Issue Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

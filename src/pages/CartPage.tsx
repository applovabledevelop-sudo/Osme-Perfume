import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

interface CartPageProps {
  navigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    couponError,
  } = useCart();

  const { settings } = useSettings();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const freeThreshold = settings.freeShippingThreshold || 75;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, Math.round((freeThreshold - subtotal) * 100) / 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setApplying(true);
    await applyCoupon(couponInput);
    setApplying(false);
    setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="w-full bg-[#FAF7F2] py-20 border-b border-[#E8E2D7]">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-white border border-[#E8E2D7] flex items-center justify-center mx-auto text-[#A09A90] shadow-sm">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#141312]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs text-[#7A756D] leading-relaxed">
            You haven't selected any fragrances yet. Explore our handcrafted haute parfumerie collection to find your signature scent.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-8 py-3.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-widest font-semibold rounded transition-colors shadow"
          >
            DISCOVER FRAGRANCES
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F2] py-10 sm:py-16 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
              Bespoke Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141312] mt-1">
              Your Shopping Bag
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="mt-2 sm:mt-0 text-xs text-[#A09A90] hover:text-red-600 transition-colors self-start"
          >
            Empty Entire Bag
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E2D7] mb-8 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-2">
            <span>
              {remainingForFreeShipping > 0 ? (
                <>
                  Add <strong className="text-[#141312]">${remainingForFreeShipping.toFixed(2)}</strong> more to your bag to enjoy{' '}
                  <strong className="text-[#C5A059]">Complimentary Insured Delivery</strong>.
                </>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> You have qualified for Complimentary Insured Delivery!
                </span>
              )}
            </span>
            <span className="text-xs font-semibold text-[#7A756D]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#E8E2D7]">
            <div
              className="bg-[#C5A059] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Table / Items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl border border-[#E8E2D7] overflow-hidden shadow-sm divide-y divide-[#E8E2D7]">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-[#FAF7F2] border border-[#E8E2D7] shrink-0"
                    />
                    <div>
                      <h3 className="font-serif text-base font-semibold text-[#141312]">
                        {item.name}
                      </h3>
                      <div className="text-xs text-[#7A756D] mt-0.5">
                        Volume: <strong className="text-[#141312]">{item.size}</strong> • SKU: {item.sku}
                      </div>
                      <div className="text-xs font-serif text-[#C5A059] font-semibold mt-1">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F4EFE6]">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E8E2D7] rounded-lg bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-[#7A756D] hover:text-[#141312]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#141312]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1.5 text-[#7A756D] hover:text-[#141312] disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-serif text-lg font-semibold text-[#141312]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-[#A09A90] hover:text-red-600 transition-colors mt-0.5 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="text-xs font-semibold text-[#C5A059] hover:underline"
            >
              ← Continue Shopping Fragrances
            </button>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D7] shadow-sm space-y-5 sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-[#141312] pb-3 border-b border-[#E8E2D7]">
                Order Summary
              </h2>

              {/* Promo code */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-semibold text-[#141312]">
                  Promotional Voucher
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-2.5 top-3 text-[#A09A90]" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded focus:outline-none focus:border-[#C5A059] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded border border-emerald-200">
                  <span>
                    Code <strong>{appliedCoupon.code}</strong> applied (-${discount.toFixed(2)})
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-950 font-bold text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                  {couponError}
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-[#7A756D] pt-2">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#141312]">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (4%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#141312] pt-3 border-t border-[#E8E2D7]">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-[#C5A059]">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-widest font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-md"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-[#A09A90] space-y-1">
                <div>Complimentary luxury presentation box included.</div>
                <div>PCI-DSS Level 1 256-Bit SSL Encryption.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

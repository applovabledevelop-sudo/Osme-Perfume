import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

interface CartDrawerProps {
  navigate: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    couponError,
  } = useCart();

  const { settings } = useSettings();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

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

  const handleGoToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleGoToCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#141312]/60 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#141312] shadow-2xl flex flex-col border-l border-[#E8E2D7]">
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D7] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <span className="font-serif text-lg tracking-wider font-semibold">SHOPPING BAG</span>
              <span className="text-xs text-[#7A756D] font-medium">({itemCount})</span>
            </div>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="p-1 text-[#7A756D] hover:text-[#141312] transition-colors rounded"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#F4EFE6] px-5 py-3 border-b border-[#E8E2D7]">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span>
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add <strong className="text-[#141312]">${remainingForFreeShipping.toFixed(2)}</strong> more for{' '}
                    <strong className="text-[#C5A059]">Free Delivery</strong>
                  </>
                ) : (
                  <span className="text-[#C5A059] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> You've unlocked Complimentary Shipping!
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#7A756D]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E8E2D7] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C5A059] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center mx-auto text-[#A09A90]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl text-[#141312]">Your shopping bag is empty</h3>
                <p className="text-xs text-[#7A756D] max-w-xs mx-auto">
                  Explore our haute parfumerie collection to discover your new signature scent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] text-xs tracking-widest font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors"
                >
                  EXPLORE FRAGRANCES
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3 bg-white p-3 rounded-lg border border-[#E8E2D7] hover:border-[#C5A059]/40 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded bg-[#FAF7F2] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-semibold text-[#141312] leading-tight">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#A09A90] hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#7A756D] mt-0.5">
                        Volume: <span className="font-medium text-[#141312]">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4EFE6]">
                      <div className="flex items-center border border-[#E8E2D7] rounded bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#7A756D] hover:text-[#141312] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#141312]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 text-[#7A756D] hover:text-[#141312] disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#141312]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8E2D7] bg-white space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-2.5 top-3 text-[#A09A90]" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (WELCOME10)"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded focus:outline-none focus:border-[#C5A059] uppercase placeholder:normal-case"
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-3.5 py-2 bg-[#141312] text-[#E2C98D] text-xs font-medium rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-200">
                  <span>
                    Coupon <strong>{appliedCoupon.code}</strong> applied (-${discount.toFixed(2)})
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-950 font-semibold text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  {couponError}
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-[#7A756D]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#141312]">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#7A756D]">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-[#141312] pt-2 border-t border-[#E8E2D7]">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base text-[#C5A059]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="w-full py-3 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-widest font-semibold rounded flex items-center justify-center space-x-2 transition-colors shadow-md"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGoToCart}
                  className="w-full py-2.5 bg-transparent border border-[#141312] text-[#141312] hover:bg-[#FAF7F2] text-xs tracking-widest font-semibold rounded transition-colors text-center"
                >
                  VIEW FULL BAG
                </button>
              </div>

              <div className="text-center text-[10px] text-[#A09A90] pt-1">
                Tax calculated at checkout. Complimentary samples included with every order.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

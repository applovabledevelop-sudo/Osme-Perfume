import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Lock,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Order, ShippingAddress } from '../types';

interface CheckoutPageProps {
  navigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { items, subtotal, discount, couponCode, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { settings } = useSettings();

  // Multi-step: 1 = Details & Address, 2 = Shipping & Payment, 3 = Confirmation
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Form states
  const [firstName, setFirstName] = useState(
    profile?.displayName?.split(' ')[0] || ''
  );
  const [lastName, setLastName] = useState(
    profile?.displayName?.split(' ').slice(1).join(' ') || ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '+1 (555) 349-2810');
  const [country, setCountry] = useState('United States');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [postalCode, setPostalCode] = useState('10001');

  // Shipping & Payment Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  // Simulated Card input
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Dynamic shipping calculation
  const freeThreshold = settings.freeShippingThreshold || 75;
  const shippingFee = shippingMethod === 'express' ? 18.0 : subtotal >= freeThreshold ? 0 : 8.0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxFee = Math.round(taxableAmount * 0.04 * 100) / 100;
  const calculatedGrandTotal = Math.max(
    0,
    Math.round((subtotal - discount + shippingFee + taxFee) * 100) / 100
  );

  const validateStep1 = () => {
    setErrorMessage(null);
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please provide both your First and Last name.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid contact email address.');
      return false;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide a valid contact phone number.');
      return false;
    }
    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      setErrorMessage('Please complete all street and city address details.');
      return false;
    }
    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const shippingAddressData: ShippingAddress = {
        firstName,
        lastName,
        email,
        phone,
        country,
        state,
        city,
        address,
        postalCode,
      };

      // Call our secure server-side checkout endpoint
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: shippingAddressData,
          customerEmail: email,
          customerName: `${firstName} ${lastName}`.trim(),
          customerPhone: phone,
          shippingMethod: shippingMethod === 'express' ? 'Express White-Glove' : 'Standard Insured',
          paymentMethod: paymentMethod === 'online' ? 'Online Luxury Card Gateway' : 'Cash on Delivery',
          couponCode: couponCode || null,
          userId: user?.uid || null,
          notes: 'Customer requested discreet signature packaging',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Checkout could not be processed.');
      }

      setConfirmedOrder(data.order);
      setStep(3);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger celebration confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A059', '#141312', '#E2C98D', '#FAF7F2'],
        });
      } catch {}
    } catch (err: any) {
      console.error('Order error:', err);
      setErrorMessage(err.message || 'Payment or order creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3 && confirmedOrder) {
    return (
      <div className="w-full bg-[#FAF7F2] py-12 sm:py-20 border-b border-[#E8E2D7]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] p-8 sm:p-12 shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase block mb-1">
                Acquisition Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#141312]">
                Thank You For Your Order
              </h1>
              <p className="text-xs sm:text-sm text-[#7A756D] mt-2 max-w-md mx-auto leading-relaxed">
                Your order has been recorded in the atelier vaults. A digital dossier and confirmation has been dispatched to <strong className="text-[#141312]">{confirmedOrder.customerEmail}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] p-6 text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D7] gap-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#A09A90] tracking-wider">
                    Order Reference
                  </div>
                  <div className="font-serif text-lg font-bold text-[#141312]">
                    {confirmedOrder.orderNumber}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-[#A09A90] tracking-wider">
                    Tracking Number
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#C5A059]">
                    {confirmedOrder.trackingNumber}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-[#A09A90] tracking-wider">
                    Fulfillment Status
                  </div>
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full capitalize">
                    {confirmedOrder.status}
                  </span>
                </div>
              </div>

              {/* Items list */}
              <div className="divide-y divide-[#E8E2D7] py-2">
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-12 object-cover rounded bg-white border border-[#E8E2D7]"
                      />
                      <div>
                        <div className="font-serif font-semibold text-[#141312]">{it.name}</div>
                        <div className="text-[11px] text-[#7A756D]">
                          Volume: {it.size} • Qty: {it.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-[#141312]">
                      ${(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-[#E8E2D7] space-y-1.5 text-xs text-[#7A756D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#141312]">${confirmedOrder.subtotal.toFixed(2)}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-${confirmedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({confirmedOrder.shippingMethod})</span>
                  <span>{confirmedOrder.shipping === 0 ? 'Free' : `$${confirmedOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${confirmedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#141312] pt-2 border-t border-[#E8E2D7]">
                  <span>Total Paid</span>
                  <span className="font-serif text-xl text-[#C5A059]">
                    ${confirmedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="pt-3 border-t border-[#E8E2D7] text-xs text-[#7A756D]">
                <strong className="text-[#141312] block mb-0.5">Shipping Destination:</strong>
                {confirmedOrder.shippingAddress.firstName} {confirmedOrder.shippingAddress.lastName}
                <br />
                {confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city},{' '}
                {confirmedOrder.shippingAddress.state} {confirmedOrder.shippingAddress.postalCode},{' '}
                {confirmedOrder.shippingAddress.country}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="px-8 py-3 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-wider font-semibold rounded-lg transition-colors shadow"
              >
                VIEW ORDER IN ACCOUNT
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-8 py-3 border border-[#141312] text-[#141312] hover:bg-white text-xs tracking-wider font-semibold rounded-lg transition-colors"
              >
                CONTINUE EXPLORING
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F2] py-10 sm:py-16 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#E8E2D7] z-0" />
            <div
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 1 ? 'bg-[#141312] text-[#E2C98D]' : 'bg-white text-[#7A756D] border border-[#E8E2D7]'
              }`}
            >
              1
            </div>
            <div
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 2 ? 'bg-[#141312] text-[#E2C98D]' : 'bg-white text-[#7A756D] border border-[#E8E2D7]'
              }`}
            >
              2
            </div>
            <div
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 3 ? 'bg-[#141312] text-[#E2C98D]' : 'bg-white text-[#7A756D] border border-[#E8E2D7]'
              }`}
            >
              3
            </div>
          </div>
          <div className="flex justify-between text-[11px] font-medium text-[#7A756D] mt-2">
            <span>Customer & Address</span>
            <span>Delivery & Payment</span>
            <span>Confirmation</span>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Checkout Form Column */}
          <div className="lg:col-span-7">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D7] shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#141312]">
                    1. Client Information
                  </h2>
                  <p className="text-xs text-[#7A756D] mt-0.5">
                    Order dossier and tracking updates will be dispatched to these credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E2D7]">
                  <h3 className="font-serif text-lg font-semibold text-[#141312]">
                    2. Shipping Address
                  </h3>
                  <p className="text-xs text-[#7A756D] mt-0.5">
                    Physical delivery address for the presentation box.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      Country / Region *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      Street Address & Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 740 Fifth Avenue, Apt 18B"
                      className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#141312] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#141312] mb-1">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#141312] mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#E8E2D7]">
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="text-xs text-[#7A756D] hover:text-[#141312] flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to bag</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-wider font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow"
                  >
                    <span>CONTINUE TO DELIVERY</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePlaceOrder} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D7] shadow-sm space-y-6">
                {/* Shipping Method */}
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#141312]">
                    3. Delivery Speed
                  </h2>
                  <div className="space-y-3 mt-3">
                    <label
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                        shippingMethod === 'standard'
                          ? 'border-[#141312] bg-[#FAF7F2] ring-1 ring-[#141312]'
                          : 'border-[#E8E2D7] hover:border-[#C5A059]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="accent-[#141312]"
                        />
                        <div>
                          <div className="font-semibold text-xs text-[#141312]">
                            Standard Insured Courier (2–4 Business Days)
                          </div>
                          <div className="text-[11px] text-[#7A756D]">
                            Dispatched in signature rigid presentation box
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#C5A059]">
                        {subtotal >= freeThreshold ? 'FREE' : '$8.00'}
                      </span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                        shippingMethod === 'express'
                          ? 'border-[#141312] bg-[#FAF7F2] ring-1 ring-[#141312]'
                          : 'border-[#E8E2D7] hover:border-[#C5A059]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="accent-[#141312]"
                        />
                        <div>
                          <div className="font-semibold text-xs text-[#141312]">
                            Express White-Glove (Next Business Day)
                          </div>
                          <div className="text-[11px] text-[#7A756D]">
                            Guaranteed priority air courier with signature required
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#141312]">$18.00</span>
                    </label>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 border-t border-[#E8E2D7]">
                  <h2 className="font-serif text-xl font-semibold text-[#141312]">
                    4. Payment Architecture
                  </h2>
                  <p className="text-xs text-[#7A756D] mt-0.5">
                    All payment data is end-to-end tokenized. Never stored in plaintext.
                  </p>

                  <div className="space-y-3 mt-4">
                    <label
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'online'
                          ? 'border-[#141312] bg-[#FAF7F2] ring-1 ring-[#141312]'
                          : 'border-[#E8E2D7] hover:border-[#C5A059]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="accent-[#141312]"
                        />
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-[#C5A059]" />
                          <span className="font-semibold text-xs text-[#141312]">
                            Online Luxury Gateway (Cards, Apple Pay, Google Pay)
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#A09A90] uppercase tracking-wider">
                        Instant
                      </span>
                    </label>

                    {/* Online Gateway Simulated Card Input */}
                    {paymentMethod === 'online' && (
                      <div className="p-4 bg-white rounded-lg border border-[#E8E2D7] space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#141312] mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded focus:outline-none focus:border-[#C5A059] font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#141312] mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded focus:outline-none focus:border-[#C5A059] font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#141312] mb-1">
                              CVC Security Code
                            </label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded focus:outline-none focus:border-[#C5A059] font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <label
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#141312] bg-[#FAF7F2] ring-1 ring-[#141312]'
                          : 'border-[#E8E2D7] hover:border-[#C5A059]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-[#141312]"
                        />
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-[#A37F38]" />
                          <span className="font-semibold text-xs text-[#141312]">
                            Cash on Delivery (White Glove Courier Verification)
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#A09A90] uppercase tracking-wider">
                        Upon Arrival
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#E8E2D7]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#7A756D] hover:text-[#141312] flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to customer details</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-[#C5A059] text-[#141312] hover:bg-[#D4AF37] text-xs tracking-widest font-bold rounded-lg flex items-center space-x-2 transition-colors shadow-md disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'VERIFYING...' : `AUTHORIZE $${calculatedGrandTotal.toFixed(2)}`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D7] shadow-sm space-y-5 sticky top-24">
              <h3 className="font-serif text-lg font-semibold text-[#141312] pb-3 border-b border-[#E8E2D7]">
                Order Items ({items.length})
              </h3>

              <div className="divide-y divide-[#F4EFE6] max-h-72 overflow-y-auto pr-1 space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-12 object-cover rounded bg-[#FAF7F2] border border-[#E8E2D7]"
                      />
                      <div>
                        <div className="font-serif font-semibold text-[#141312]">{it.name}</div>
                        <div className="text-[11px] text-[#7A756D]">
                          Volume: {it.size} • Qty: {it.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-[#141312]">
                      ${(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-[#E8E2D7] space-y-2 text-xs text-[#7A756D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#141312]">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Voucher ({couponCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Courier Delivery</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Luxury Fragrance Tax (4%)</span>
                  <span>${taxFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#141312] pt-3 border-t border-[#E8E2D7]">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-[#C5A059]">
                    ${calculatedGrandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D7] text-[11px] text-[#7A756D] space-y-1">
                <div className="font-semibold text-[#141312] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>The Luxora Atelier Guarantee</span>
                </div>
                <p>
                  Includes complimentary 2ml sample vial so you may test the scent on skin before breaking the wax flacon seal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { submitContact } from '../services/db';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    try {
      await submitContact({ name, email, phone, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (e) {
      console.error('Contact submit error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] py-12 sm:py-20 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
            Atelier Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#141312] mt-2">
            Connect With Our Scent Curators
          </h1>
          <p className="text-xs sm:text-sm text-[#7A756D] mt-3 leading-relaxed">
            Whether inquiring about custom bridal bespoke accords, private consultation, or order dispatches, our fragrance specialists are at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-2xl border border-[#E8E2D7] p-8 sm:p-12 shadow-sm">
          {/* Atelier Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#141312]">
                New York Flagship Atelier
              </h2>
              <p className="text-xs text-[#7A756D] mt-2 leading-relaxed">
                By appointment only for bespoke sensory consultations and flacon engraving.
              </p>
            </div>

            <div className="space-y-5 text-xs text-[#7A756D]">
              <div className="flex items-start space-x-3.5">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141312] block">Atelier Location</strong>
                  <span>{settings.address || '740 Fifth Avenue, 18th Floor, New York, NY 10019'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141312] block">Private Concierge Line</strong>
                  <span>{settings.contactPhone || '+1 (800) 845-8967'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141312] block">Direct Correspondence</strong>
                  <span>{settings.contactEmail || 'concierge@luxoraperfumes.com'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141312] block">Operating Hours (EST)</strong>
                  <span>Monday – Friday: 9:00 AM – 7:00 PM<br />Saturday: 10:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            {success ? (
              <div className="bg-[#FAF7F2] p-8 rounded-xl border border-[#E8E2D7] text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#C5A059] mx-auto" />
                <h3 className="font-serif text-2xl font-semibold text-[#141312]">
                  Correspondence Received
                </h3>
                <p className="text-xs text-[#7A756D] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Luxora. A dedicated fragrance curator will review your note and respond within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lady Genevieve"
                      className="w-full text-xs p-3 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141312] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs p-3 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141312] mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs p-3 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141312] mb-1">
                    Your Message or Bespoke Request *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the scent profile, bridal layering, or specific batch inquiry..."
                    className="w-full text-xs p-3 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-widest font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors shadow disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'TRANSMITTING...' : 'DISPATCH MESSAGE'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

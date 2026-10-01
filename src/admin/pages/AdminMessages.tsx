import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { ContactMessage } from '../../types';
import { fetchContactMessages } from '../../services/db';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const msgs = await fetchContactMessages();
        setMessages(msgs);
      } catch (e) {
        console.warn('Error fetching messages:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
          Concierge Inquiries
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
          Client Correspondence
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A756D]">
            Loading client inquiries...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Mail className="w-10 h-10 text-[#D8CFBE] mx-auto" />
            <h3 className="font-serif text-lg text-[#141312]">No client messages recorded</h3>
            <p className="text-xs text-[#7A756D]">
              Inquiries submitted through the Contact Concierge page will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E2D7]">
            {messages.map((m) => (
              <div key={m.id} className="p-5 space-y-2 hover:bg-[#FAF7F2] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-semibold text-sm text-[#141312] mr-2">{m.name}</span>
                    <span className="text-[#C5A059]">{m.email}</span>
                    {m.phone && <span className="text-[#7A756D] ml-2">({m.phone})</span>}
                  </div>
                  <span className="text-[11px] text-[#A09A90]">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-[#252320] leading-relaxed whitespace-pre-line bg-[#FAF7F2] p-3.5 rounded-lg border border-[#E8E2D7]">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Download, Mail, Send, Calendar, Check } from 'lucide-react';
import { NewsletterSubscriber } from '../../types';
import { fetchNewsletterSubscribers } from '../../services/db';

export const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const subs = await fetchNewsletterSubscribers();
        setSubscribers(subs);
      } catch (e) {
        console.warn('Subscribers load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,SubscribedAt,Status', ...subscribers.map((s) => `${s.email},${s.subscribedAt},${s.active ? 'Active' : 'Inactive'}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `luxora_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
            Audience & Retention
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
            Privilege Club Newsletter Subscribers
          </h1>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="px-5 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow disabled:opacity-50 self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export Subscribers to CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A756D]">
            Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Send className="w-10 h-10 text-[#D8CFBE] mx-auto" />
            <h3 className="font-serif text-lg text-[#141312]">No subscribers enrolled yet</h3>
            <p className="text-xs text-[#7A756D]">
              Subscribers who sign up via the footer or newsletter forms will be cataloged here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                  <th className="py-3 px-4">Subscriber Email</th>
                  <th className="py-3 px-4">Subscription Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D7]">
                {subscribers.map((s, i) => (
                  <tr key={i} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#141312]">{s.email}</td>
                    <td className="py-3 px-4 text-[#7A756D]">
                      {new Date(s.subscribedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

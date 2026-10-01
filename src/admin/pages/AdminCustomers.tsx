import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar, UserCheck, UserX } from 'lucide-react';
import { UserProfile, Order } from '../../types';

interface AdminCustomersProps {
  customers: UserProfile[];
  orders: Order[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ customers, orders }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate customer spending
  const customerStats = customers.map((c) => {
    const userOrders = orders.filter((o) => o.userId === c.uid || o.customerEmail.toLowerCase() === c.email.toLowerCase());
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      ...c,
      orderCount: userOrders.length,
      totalSpent,
    };
  });

  const filtered = customerStats.filter((c) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return c.displayName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
          Patron Register
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
          Customer Accounts & Spend
        </h1>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E8E2D7] shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A09A90] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patron name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        <span className="text-xs text-[#7A756D]">{filtered.length} Patrons</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Role Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D7]">
              {filtered.map((c) => (
                <tr key={c.uid} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#141312]">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C5A059] flex items-center justify-center font-serif font-bold text-xs text-[#141312]">
                        {c.displayName ? c.displayName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <span>{c.displayName || 'Patron'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#7A756D]">
                    <div>{c.email}</div>
                    {c.phone && <div className="text-[10px] text-[#A09A90]">{c.phone}</div>}
                  </td>

                  <td className="py-3.5 px-4 text-[#7A756D]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#141312]">
                    {c.orderCount} order(s)
                  </td>

                  <td className="py-3.5 px-4 font-serif font-bold text-[#C5A059]">
                    ${c.totalSpent.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF7F2] border border-[#E8E2D7] uppercase text-[#141312]">
                      {c.role || 'Customer'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

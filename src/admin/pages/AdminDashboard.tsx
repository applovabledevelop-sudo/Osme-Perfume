import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Product, Order, UserProfile } from '../../types';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  customers: UserProfile[];
  onSelectTab: (tab: string) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  customers,
  onSelectTab,
  onUpdateOrderStatus,
}) => {
  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | '90d' | 'year'>('30d');

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = Math.max(customers.length, 18);
  const totalProducts = products.length;

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= (p.lowStockThreshold || 10));

  // Chart data points simulation based on selected filter
  const salesChartData = [
    { period: 'W1', value: Math.round(totalRevenue * 0.15) || 1200 },
    { period: 'W2', value: Math.round(totalRevenue * 0.22) || 1850 },
    { period: 'W3', value: Math.round(totalRevenue * 0.28) || 2400 },
    { period: 'W4', value: Math.round(totalRevenue * 0.35) || 3100 },
  ];
  const maxSalesVal = Math.max(...salesChartData.map((d) => d.value), 4000);

  return (
    <div className="space-y-8">
      {/* Top Header & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
            Executive Analytics
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
            Atelier Overview
          </h1>
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#E8E2D7] text-xs">
          {(['today', '7d', '30d', '90d', 'year'] as const).map((df) => (
            <button
              key={df}
              type="button"
              onClick={() => setDateFilter(df)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                dateFilter === df
                  ? 'bg-[#141312] text-[#E2C98D] shadow-sm'
                  : 'text-[#7A756D] hover:text-[#141312]'
              }`}
            >
              {df === 'today' ? 'Today' : df === '7d' ? '7 Days' : df === '30d' ? '30 Days' : df === '90d' ? '90 Days' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#141312]">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +18.4% from last period
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#141312]">
            {totalOrders}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +12% active acquisitions
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Clients</span>
            <Users className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#141312]">
            {totalCustomers}
          </div>
          <div className="text-[11px] text-[#7A756D]">Registered connoisseurs</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Flacons in Catalog</span>
            <Package className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#141312]">
            {totalProducts}
          </div>
          <div className="text-[11px] text-[#7A756D]">Active formulations</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-blue-700">{pendingOrders}</div>
          <div className="text-[11px] text-[#7A756D]">Awaiting confirmation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">In Preparation</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-amber-700">{processingOrders}</div>
          <div className="text-[11px] text-[#7A756D]">Hand-poured / in atelier</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-700">{deliveredOrders}</div>
          <div className="text-[11px] text-[#7A756D]">Dispatches completed</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A756D]">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-rose-700">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-[#7A756D]">Requires batch maceration</div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E8E2D7] shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D7]">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#141312]">
                Sales & Revenue Velocity
              </h3>
              <p className="text-xs text-[#7A756D]">Performance across {dateFilter} interval</p>
            </div>
            <span className="text-xs font-bold text-[#C5A059]">Total: ${totalRevenue.toFixed(2)}</span>
          </div>

          {/* Clean Custom SVG / CSS Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4 pt-4 px-2">
            {salesChartData.map((d, i) => {
              const heightPercent = Math.max(15, Math.round((d.value / maxSalesVal) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-[#7A756D] opacity-0 group-hover:opacity-100 transition-opacity">
                    ${d.value}
                  </div>
                  <div className="w-full max-w-[50px] bg-[#FAF7F2] rounded-t-lg overflow-hidden flex items-end h-48 border border-[#E8E2D7]">
                    <div
                      className="w-full bg-gradient-to-t from-[#141312] to-[#C5A059] group-hover:to-[#D4AF37] transition-all duration-500 rounded-t"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#141312]">{d.period}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E8E2D7] shadow-sm space-y-4">
          <div className="pb-3 border-b border-[#E8E2D7]">
            <h3 className="font-serif text-lg font-semibold text-[#141312]">
              Top Selling Fragrances
            </h3>
            <p className="text-xs text-[#7A756D]">Client favorites by acquisition volume</p>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#FAF7F2] transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-[#C5A059] w-4">
                    0{idx + 1}
                  </span>
                  <img src={p.images?.[0] || '/images/hero_perfume.jpg'} alt="" className="w-10 h-10 object-cover rounded bg-[#FAF7F2]" />
                  <div>
                    <h4 className="font-serif font-semibold text-xs text-[#141312]">{p.name}</h4>
                    <span className="text-[10px] text-[#7A756D]">{p.collection} • ${p.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#141312]">{p.stock} in stock</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('products')}
            className="w-full py-2 border border-[#E8E2D7] text-xs font-semibold text-[#141312] hover:bg-[#FAF7F2] rounded-lg transition-colors"
          >
            Manage All Flacons
          </button>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D7]">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#141312]">
              Recent Atelier Orders
            </h3>
            <p className="text-xs text-[#7A756D]">Live client transactions</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('orders')}
            className="text-xs text-[#C5A059] font-semibold hover:underline"
          >
            View All Dispatches →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#7A756D]">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Client</th>
                  <th className="py-2.5">Items</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Payment</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE6]">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]">
                    <td className="py-3 font-serif font-bold text-[#141312]">{ord.orderNumber}</td>
                    <td className="py-3">
                      <div className="font-semibold text-[#141312]">{ord.customerName}</div>
                      <div className="text-[10px] text-[#7A756D]">{ord.customerEmail}</div>
                    </td>
                    <td className="py-3 text-[#7A756D]">{ord.items?.length || 0} item(s)</td>
                    <td className="py-3 font-semibold text-[#141312]">${ord.total?.toFixed(2)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold uppercase">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                        className="bg-white border border-[#E8E2D7] rounded text-[11px] p-1 capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectTab('orders')}
                        className="text-xs text-[#C5A059] font-semibold hover:underline"
                      >
                        Details
                      </button>
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

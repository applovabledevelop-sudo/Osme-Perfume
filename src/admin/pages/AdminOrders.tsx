import React, { useState } from 'react';
import { Search, Eye, Filter, Check, Clock, Truck, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
          Fulfillment Atelier
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
          Orders & Dispatches
        </h1>
      </div>

      {/* Filter and search */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D7] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A09A90] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, email, or client name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-[#7A756D]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#FAF7F2] border border-[#E8E2D7] p-2 rounded-lg capitalize"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#7A756D]">
                    No order records match current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-serif font-bold text-[#141312]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#141312]">{ord.customerName}</div>
                      <div className="text-[10px] text-[#7A756D]">{ord.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-[#7A756D]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-[#7A756D]">{ord.items?.length || 0} flacon(s)</td>
                    <td className="py-3 px-4 font-bold text-[#141312]">${ord.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-semibold uppercase">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#FAF7F2] border border-[#E8E2D7] rounded text-xs p-1 font-semibold capitalize"
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
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setInspectingOrder(ord)}
                        className="p-1.5 text-[#C5A059] hover:text-[#141312] hover:bg-white rounded transition-colors"
                        title="View Full Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-[#141312]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border border-[#E8E2D7] shadow-2xl">
            <div className="flex justify-between items-start pb-4 border-b border-[#E8E2D7]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                  Order Dossier Inspector
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#141312]">
                  {inspectingOrder.orderNumber}
                </h3>
                <div className="text-xs text-[#7A756D]">
                  Placed {new Date(inspectingOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingOrder(null)}
                className="text-xs text-[#7A756D] hover:text-[#141312] p-1 font-semibold"
              >
                Close ✕
              </button>
            </div>

            {/* Quick status updater in modal */}
            <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7]">
              <span className="text-xs font-semibold text-[#141312]">Change Order Status:</span>
              <select
                value={inspectingOrder.status}
                onChange={async (e) => {
                  const newStatus = e.target.value as OrderStatus;
                  await onUpdateOrderStatus(inspectingOrder.id, newStatus);
                  setInspectingOrder({ ...inspectingOrder, status: newStatus });
                }}
                className="bg-white border border-[#E8E2D7] rounded text-xs p-1.5 font-semibold capitalize"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-1">
                <strong className="text-[10px] uppercase font-bold text-[#A09A90] block">
                  Client Info
                </strong>
                <div className="font-semibold text-[#141312]">{inspectingOrder.customerName}</div>
                <div>{inspectingOrder.customerEmail}</div>
                <div>{inspectingOrder.customerPhone}</div>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-1">
                <strong className="text-[10px] uppercase font-bold text-[#A09A90] block">
                  Destination Address
                </strong>
                <div>{inspectingOrder.shippingAddress?.address}</div>
                <div>
                  {inspectingOrder.shippingAddress?.city}, {inspectingOrder.shippingAddress?.state}{' '}
                  {inspectingOrder.shippingAddress?.postalCode}
                </div>
                <div>{inspectingOrder.shippingAddress?.country}</div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#141312] uppercase tracking-wider block">
                Order Items ({inspectingOrder.items.length})
              </span>
              <div className="divide-y divide-[#E8E2D7] border border-[#E8E2D7] rounded-xl overflow-hidden bg-white text-xs">
                {inspectingOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={it.image} alt="" className="w-10 h-10 object-cover rounded bg-[#FAF7F2]" />
                      <div>
                        <div className="font-semibold text-[#141312]">{it.name}</div>
                        <div className="text-[11px] text-[#7A756D]">
                          Volume: {it.size} • SKU: {it.sku}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#141312]">
                        ${(it.price * it.quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[#7A756D]">{it.quantity} × ${it.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-1.5 text-xs text-[#7A756D]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${inspectingOrder.subtotal.toFixed(2)}</span>
              </div>
              {inspectingOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>-${inspectingOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({inspectingOrder.shippingMethod})</span>
                <span>${inspectingOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${inspectingOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#141312] pt-2 border-t border-[#E8E2D7]">
                <span>Total</span>
                <span className="font-serif text-lg text-[#C5A059]">
                  ${inspectingOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

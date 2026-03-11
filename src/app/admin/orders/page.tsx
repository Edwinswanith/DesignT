"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine: string;
  city: string;
  pincode: string;
  state: string;
  tshirtColor: string;
  tshirtSize: string;
  quantity: number;
  designUrl: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  printing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(orders.map((o) => (o._id === orderId ? data.order : o)));
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-8">Orders</h1>
        <div className="text-center py-12 text-[var(--text-secondary)]">No orders found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-8 border-b border-[var(--border-default)]/30 space-y-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl font-serif font-black text-[var(--text-primary)] tracking-tight">
            Orders
          </h1>
          <span className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-widest">
            {orders.length}
          </span>
        </div>
        <p className="text-lg text-[var(--text-secondary)] font-light">
          Manage and track all customer orders
        </p>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-[var(--border-default)]/50 bg-[var(--surface-raised)]/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-default)]/50 bg-[var(--surface-inset)]/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]/30">
              {orders.map((order, idx) => (
                <tr
                  key={order._id}
                  className="hover:bg-[var(--surface-inset)]/40 transition-colors duration-200 group"
                  style={{
                    animationDelay: `${idx * 25}ms`,
                  }}
                >
                  <td className="px-6 py-5">
                    <div className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      #{order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-medium text-[var(--text-primary)]">{order.customerName}</div>
                    {order.customerEmail && (
                      <div className="text-xs text-[var(--text-tertiary)] mt-1">{order.customerEmail}</div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-[var(--text-secondary)]">
                      <div className="font-medium">+91 {order.customerPhone}</div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-1">
                        {order.city}, {order.pincode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm">
                      <div className="font-medium text-[var(--text-primary)]">
                        {order.tshirtColor} / {order.tshirtSize}
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-1">Qty: {order.quantity}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-lg font-bold text-[var(--text-primary)]">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1 capitalize">
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="printing">Printing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-[var(--text-secondary)]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

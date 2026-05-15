// src/pages/admin/Orders.jsx — Responsive

import { useState, useEffect } from "react";
import API from "../../utils/api";

const STATUS_OPTIONS = ["processing","confirmed","shipped","delivered","cancelled"];
const STATUS_STYLES = {
  processing: "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};
const PAYMENT_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  paid:    "bg-green-100 text-green-700",
  failed:  "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = filterStatus ? `?status=${filterStatus}` : "";
    API.get(`/orders${params}`)
      .then(({ data }) => setOrders(data.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-800">Orders</h1>
      </div>

      {/* Status filter — horizontal scroll on mobile */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setFilterStatus("")}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap shrink-0 ${
            filterStatus === "" ? "bg-brand-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}>
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition whitespace-nowrap shrink-0 ${
              filterStatus === s ? "bg-brand-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Orders List */}
        <div className={selectedOrder ? "lg:col-span-2" : "lg:col-span-3"}>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse h-16 bg-gray-100" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Order ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Payment</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id}
                        className={`hover:bg-gray-50 transition cursor-pointer ${selectedOrder?._id === order._id ? "bg-brand-50" : ""}`}
                        onClick={() => setSelectedOrder(order)}>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 whitespace-nowrap">{order.user?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-400 hidden sm:block">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                          {order.totalPrice.toLocaleString()} FCFA
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${STATUS_STYLES[order.orderStatus]} whitespace-nowrap`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${PAYMENT_STYLES[order.paymentStatus]}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select value={order.orderStatus}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white">
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Order Detail Sidebar */}
        {selectedOrder && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-gray-800">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-50">✕</button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Order ID</p>
                <p className="font-mono font-medium">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{selectedOrder.user?.name}</p>
                <p className="text-gray-400 text-xs">{selectedOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-2">Items</p>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700 line-clamp-1 max-w-[160px]">{item.title}</span>
                    <span className="text-gray-500 shrink-0 ml-2">×{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gray-500">Shipping</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.street}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}</p>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-brand-600">{selectedOrder.totalPrice.toLocaleString()} FCFA</span>
              </div>
              <div>
                <p className="text-gray-500 mb-2">Update Status</p>
                <select value={selectedOrder.orderStatus}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  className="input text-sm">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

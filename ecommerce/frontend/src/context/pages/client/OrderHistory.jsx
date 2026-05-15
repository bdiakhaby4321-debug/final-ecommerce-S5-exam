// src/pages/client/OrderHistory.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

const STATUS_STYLES = {
  processing:  "bg-yellow-100 text-yellow-700",
  confirmed:   "bg-blue-100 text-blue-700",
  shipped:     "bg-purple-100 text-purple-700",
  delivered:   "bg-green-100 text-green-700",
  cancelled:   "bg-red-100 text-red-700",
};

const PAYMENT_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  paid:    "bg-green-100 text-green-700",
  failed:  "bg-red-100 text-red-700",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/my-orders")
      .then(({ data }) => setOrders(data.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/6" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-display font-bold text-gray-700">No orders yet</h2>
        <p className="text-gray-400 mt-2">Your order history will appear here</p>
        <Link to="/products" className="btn-primary inline-block mt-6">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`badge ${STATUS_STYLES[order.orderStatus]}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <span className={`badge ${PAYMENT_STYLES[order.paymentStatus]}`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                  <span className="badge bg-gray-100 text-gray-600 capitalize">
                    {order.paymentMethod.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-brand-600">
                  {order.totalPrice.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                <Link
                  to={`/orders/${order._id}`}
                  className="text-sm text-brand-600 hover:underline font-medium mt-1 inline-block"
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* Items preview */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {order.items.slice(0, 4).map((item, i) => (
                <div key={i} className="shrink-0 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📦</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 w-12 truncate">{item.title}</p>
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500 font-medium">
                  +{order.items.length - 4}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

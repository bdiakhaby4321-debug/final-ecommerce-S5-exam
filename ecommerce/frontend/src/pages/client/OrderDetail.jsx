// src/pages/client/OrderDetail.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../utils/api";

const STATUS_STEPS = ["processing", "confirmed", "shipped", "delivered"];

const STATUS_STYLES = {
  processing: "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="card p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/orders" className="btn-primary inline-block mt-4">My Orders</Link>
      </div>
    );
  }

  const currentStep = order.orderStatus === "cancelled"
    ? -1
    : STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders" className="text-gray-400 hover:text-gray-600 transition">
          ← Orders
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-display font-bold text-gray-800">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <span className={`badge ${STATUS_STYLES[order.orderStatus]} ml-auto`}>
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>
      </div>

      {/* Order Progress Tracker */}
      {order.orderStatus !== "cancelled" && (
        <div className="card p-6 mb-4">
          <h2 className="font-semibold text-gray-700 mb-5">Order Progress</h2>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i <= currentStep
                        ? "bg-brand-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i <= currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 text-center capitalize ${
                    i <= currentStep ? "text-brand-600 font-medium" : "text-gray-400"
                  }`}>
                    {step}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${
                    i < currentStep ? "bg-brand-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Items */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-800 shrink-0">
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span className="text-brand-600">{order.totalPrice.toLocaleString()} FCFA</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-gray-700 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              {order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-gray-700 mb-3">Payment</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium capitalize">{order.paymentMethod.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`badge ${
                  order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                  order.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ordered</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              {order.deliveredAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivered</span>
                  <span>{new Date(order.deliveredAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/client/Checkout.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";

const PAYMENT_METHODS = [
  {
    id: "wave",
    label: "Wave",
    color: "bg-blue-600",
    desc: "Pay instantly with Wave mobile money",
    icon: "💙",
  },
  {
    id: "orange_money",
    label: "Orange Money",
    color: "bg-orange-500",
    desc: "Pay with Orange Money mobile wallet",
    icon: "🟠",
  },
  {
    id: "cash_on_delivery",
    label: "Cash on Delivery",
    color: "bg-gray-600",
    desc: "Pay when your order arrives",
    icon: "💵",
  },
];

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    country: user?.address?.country || "Senegal",
    postalCode: user?.address?.postalCode || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("wave");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock payment simulation state
  const [paymentStep, setPaymentStep] = useState("form"); // "form" | "payment" | "success"

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setError("");

    // Show mock payment screen for Wave / Orange Money
    if (paymentMethod !== "cash_on_delivery") {
      setPaymentStep("payment");
      return;
    }

    await placeOrder();
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const { data } = await API.post("/orders", {
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
      });

      clearCart();
      navigate(`/orders/${data.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      setPaymentStep("form");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Mock Payment Screen
  // Concept: In a real app, this would redirect to Wave/Orange Money
  // payment gateway. Here we simulate the payment flow educationally.
  // ============================================================
  if (paymentStep === "payment") {
    const method = PAYMENT_METHODS.find((m) => m.id === paymentMethod);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">{method.icon}</div>
          <h2 className="text-2xl font-display font-bold text-gray-800">
            {method.label} Payment
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Amount to pay: <strong className="text-gray-800">{cartTotal.toLocaleString()} FCFA</strong>
          </p>

          <div className={`${method.color} text-white rounded-xl p-5 mt-6 text-left`}>
            {paymentMethod === "wave" && (
              <>
                <p className="font-semibold">Wave Payment Instructions:</p>
                <ol className="list-decimal list-inside text-sm mt-2 space-y-1 opacity-90">
                  <li>Open your Wave app</li>
                  <li>Tap "Send Money"</li>
                  <li>Enter number: <strong>77 000 00 00</strong></li>
                  <li>Amount: <strong>{cartTotal.toLocaleString()} FCFA</strong></li>
                  <li>Reference: <strong>SENSHOP-ORDER</strong></li>
                </ol>
              </>
            )}
            {paymentMethod === "orange_money" && (
              <>
                <p className="font-semibold">Orange Money Instructions:</p>
                <ol className="list-decimal list-inside text-sm mt-2 space-y-1 opacity-90">
                  <li>Dial <strong>#144#</strong> on your phone</li>
                  <li>Select "Transfer"</li>
                  <li>Enter number: <strong>77 000 00 01</strong></li>
                  <li>Amount: <strong>{cartTotal.toLocaleString()} FCFA</strong></li>
                  <li>Enter your PIN to confirm</li>
                </ol>
              </>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={placeOrder}
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? "Confirming..." : "✓ I Have Paid — Confirm Order"}
            </button>
            <button
              onClick={() => setPaymentStep("form")}
              className="btn-outline w-full py-3"
            >
              ← Go Back
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            * This is a simulated payment for educational purposes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-gray-800 text-lg mb-4">
                📦 Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    name="street"
                    className="input"
                    placeholder="123 Rue des Almadies"
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    name="city"
                    className="input"
                    placeholder="Dakar"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    name="country"
                    className="input"
                    placeholder="Senegal"
                    value={address.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    name="postalCode"
                    className="input"
                    placeholder="10000"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-gray-800 text-lg mb-4">
                💳 Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-brand-500"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="card p-6 h-fit">
            <h2 className="font-display font-bold text-gray-800 text-lg mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-gray-600">
                  <span className="line-clamp-1 max-w-[160px]">
                    {item.title} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{cartTotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span className="text-brand-600">{cartTotal.toLocaleString()} FCFA</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="btn-primary w-full mt-5 py-3"
            >
              {loading
                ? "Placing order..."
                : paymentMethod === "cash_on_delivery"
                ? "Place Order"
                : `Pay with ${PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

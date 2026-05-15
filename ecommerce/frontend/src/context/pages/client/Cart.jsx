// src/pages/client/Cart.jsx

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-display font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 mt-2">Add some products to get started</p>
        <Link to="/products" className="btn-primary inline-block mt-6">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              <img
                src={item.image?.url || "https://via.placeholder.com/80"}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg bg-gray-50"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 hover:text-brand-600 line-clamp-1">
                  {item.title}
                </Link>
                <p className="text-brand-600 font-bold mt-1">{item.price?.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 font-bold">−</button>
                  <span className="px-3 py-1.5 border-x border-gray-200 text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 font-bold">+</button>
                </div>
                <button onClick={() => removeFromCart(item._id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-500 hover:underline mt-2">
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-display font-bold text-gray-800 text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-gray-600">
                <span className="line-clamp-1 max-w-[160px]">{item.title} × {item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span className="text-brand-600">{cartTotal.toLocaleString()} FCFA</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary w-full mt-5 py-3">
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

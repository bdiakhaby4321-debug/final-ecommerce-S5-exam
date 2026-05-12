// src/components/Footer.jsx

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-display font-bold text-xl mb-3">SenShop</h3>
          <p className="text-sm leading-relaxed">
            Your trusted e-commerce platform in Senegal. Shop safely with Wave & Orange Money.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Payment Methods</h4>
          <div className="flex gap-3 mt-2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold">Wave</span>
            <span className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">Orange Money</span>
          </div>
          <p className="text-xs mt-4">© 2024 SenShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

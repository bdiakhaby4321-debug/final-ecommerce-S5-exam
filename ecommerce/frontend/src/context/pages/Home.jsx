// src/pages/Home.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/products?limit=8&sort=-createdAt")
      .then(({ data }) => setFeatured(data.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: "Electronics", icon: "💻", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { name: "Clothing", icon: "👕", color: "bg-purple-50 text-purple-700 border-purple-100" },
    { name: "Food", icon: "🍎", color: "bg-green-50 text-green-700 border-green-100" },
    { name: "Books", icon: "📚", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
    { name: "Sports", icon: "⚽", color: "bg-red-50 text-red-700 border-red-100" },
    { name: "Home", icon: "🏠", color: "bg-orange-50 text-orange-700 border-orange-100" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-4 px-4 py-1 text-sm">
            🇸🇳 Senegal's #1 E-Commerce Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight max-w-3xl">
            Shop Everything,<br />
            <span className="text-brand-400">Pay with Wave</span> or Orange Money
          </h1>
          <p className="text-gray-300 mt-4 text-lg max-w-xl">
            Discover thousands of products with fast delivery across Senegal.
          </p>
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            <Link to="/products" className="btn-primary text-base px-8 py-3">
              Shop Now →
            </Link>
            <Link to="/register" className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3 rounded-lg transition">
              Join for Free
            </Link>
          </div>

          {/* Payment badges */}
          <div className="flex gap-3 mt-10">
            <span className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm">
              <span className="text-blue-400 font-bold">Wave</span> Accepted
            </span>
            <span className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm">
              <span className="text-orange-400 font-bold">Orange Money</span> Accepted
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">Browse Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className={`card border ${cat.color} text-center py-5 px-2 hover:shadow-md transition-all hover:-translate-y-1`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-xs font-semibold">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-800">Latest Products</h2>
          <Link to="/products" className="text-brand-600 hover:underline text-sm font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🚚", title: "Fast Delivery", desc: "Across all of Senegal" },
            { icon: "🔒", title: "Secure Payments", desc: "Wave & Orange Money" },
            { icon: "↩️", title: "Easy Returns", desc: "7-day return policy" },
            { icon: "💬", title: "24/7 Support", desc: "WhatsApp chat" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

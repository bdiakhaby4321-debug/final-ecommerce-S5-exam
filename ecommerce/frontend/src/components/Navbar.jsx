// src/components/Navbar.jsx — Fully Responsive

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
    setMenuOpen(false);
  };

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-display font-bold text-brand-600">SenShop</span>
            <span className="text-xs bg-brand-500 text-white px-1.5 py-0.5 rounded font-medium">SN</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-600 hover:text-brand-600 font-medium transition">
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-brand-600 font-medium transition">
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-50 transition">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {user && <NotificationBell />}

            {/* User menu — desktop only */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-brand-600 font-medium hover:bg-brand-50">
                        👑 Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg">
          <Link to="/products" onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
            🛍️ Products
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-brand-600 hover:bg-brand-50 rounded-lg font-medium">
                  👑 Admin Panel
                </Link>
              )}
              <Link to="/profile" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                👤 My Profile
              </Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                📦 My Orders
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                <span>🛒 Cart</span>
                {cartCount > 0 && (
                  <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <hr className="border-gray-100 my-2" />
              <div className="px-3 py-2 flex items-center gap-3 bg-gray-50 rounded-lg">
                <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="block w-full text-left px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium">
                🚪 Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center py-2.5">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center py-2.5">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

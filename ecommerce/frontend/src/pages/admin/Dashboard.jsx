// src/pages/admin/Dashboard.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import API from "../../utils/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const StatCard = ({ title, value, icon, color, link }) => (
  <Link to={link} className={`card p-6 flex items-center gap-4 hover:shadow-md transition-shadow`}>
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-display font-bold text-gray-800">{value}</p>
    </div>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/users/stats"),
      API.get("/orders/admin/stats"),
    ])
      .then(([usersRes, ordersRes]) => {
        setStats(usersRes.data.data);
        setOrderStats(ordersRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = orderStats?.monthlyRevenue?.map((item) => ({
    month: MONTHS[item._id - 1],
    revenue: item.revenue,
    orders: item.count,
  })) || [];

  const STATUS_COLORS = {
    processing: "bg-yellow-100 text-yellow-700",
    confirmed:  "bg-blue-100 text-blue-700",
    shipped:    "bg-purple-100 text-purple-700",
    delivered:  "bg-green-100 text-green-700",
    cancelled:  "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 h-24 bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="btn-primary text-sm">+ Add Product</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          icon="👥"
          color="bg-blue-50"
          link="/admin/users"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          icon="📦"
          color="bg-orange-50"
          link="/admin/products"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || "0"}
          icon="🛒"
          color="bg-purple-50"
          link="/admin/orders"
        />
        <StatCard
          title="Total Revenue"
          value={`${(stats?.totalRevenue || 0).toLocaleString()} FCFA`}
          icon="💰"
          color="bg-green-50"
          link="/admin/orders"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display font-bold text-gray-800 mb-4">Monthly Revenue</h2>
          {chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No revenue data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
            )}
            {stats?.recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
                  {order.user?.name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {order.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.totalPrice.toLocaleString()} FCFA
                  </p>
                </div>
                <span className={`badge text-xs ${STATUS_COLORS[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { to: "/admin/products", label: "Manage Products", icon: "📦" },
          { to: "/admin/orders",   label: "Manage Orders",   icon: "🛒" },
          { to: "/admin/users",    label: "Manage Users",    icon: "👥" },
          { to: "/products",       label: "View Store",      icon: "🏪" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="card p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-sm font-medium text-gray-700">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// src/pages/client/Profile.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
      postalCode: user?.address?.postalCode || "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const { data } = await API.put("/auth/update-profile", form);
      updateUser(data.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">
            ✓ Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" className="input" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className="input bg-gray-50 cursor-not-allowed" value={user?.email} disabled />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phoneNumber" className="input" placeholder="+221 70 000 00 00" value={form.phoneNumber} onChange={handleChange} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-4 pt-4 border-t border-gray-100">
              Shipping Address
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input name="address.street" className="input" placeholder="123 Rue..." value={form.address.street} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="address.city" className="input" placeholder="Dakar" value={form.address.city} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input name="address.country" className="input" placeholder="Senegal" value={form.address.country} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input name="address.postalCode" className="input" placeholder="10000" value={form.address.postalCode} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

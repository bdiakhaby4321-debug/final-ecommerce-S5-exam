// src/pages/admin/Users.jsx — Responsive

import { useState, useEffect } from "react";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    API.get("/users")
      .then(({ data }) => setUsers(data.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await API.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role) => {
    if (role === "superadmin") return "bg-yellow-100 text-yellow-700";
    if (role === "admin") return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700";
  };

  const getRoleLabel = (role) => {
    if (role === "superadmin") return "👑 Super Admin";
    if (role === "admin") return "🔧 Admin";
    return "🛒 Client";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 mt-1">{users.length} total users</p>
        </div>
        <input
          type="text"
          className="input w-full sm:w-64"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse h-16 bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                          u.role === "superadmin" ? "bg-yellow-500" : u.role === "admin" ? "bg-purple-500" : "bg-brand-500"
                        }`}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[120px] sm:max-w-none">
                            {u.name}
                            {u._id === currentUser._id && (
                              <span className="ml-1 text-xs text-brand-500 font-normal">(you)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[120px] sm:max-w-none">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone — hidden on mobile */}
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {u.phoneNumber || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span className={`badge ${getRoleBadge(u.role)} whitespace-nowrap`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>

                    {/* Joined — hidden on mobile */}
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {u._id === currentUser._id || u.role === "superadmin" ? (
                        <span className="text-xs text-gray-300">
                          {u.role === "superadmin" ? "👑 Protected" : "—"}
                        </span>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {currentUser.role === "superadmin" ? (
                            <select value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              disabled={updatingId === u._id}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white">
                              <option value="client">🛒 Client</option>
                              <option value="admin">🔧 Admin</option>
                            </select>
                          ) : (
                            u.role === "admin" ? (
                              <span className="text-xs text-gray-400 italic">No permission</span>
                            ) : null
                          )}

                          {(currentUser.role === "superadmin" || u.role === "client") && (
                            <button onClick={() => handleDelete(u._id)}
                              disabled={updatingId === u._id}
                              className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap">
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

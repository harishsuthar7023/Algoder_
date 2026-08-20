import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/Dashboardlayout";
import { Card, Badge } from "../../components/Dashboard/ui";
import UserDetailModal from "../../components/Dashboard/UserDetailModal";
import { Search, Trash2, ShieldCheck, ShieldOff, UserPlus, X, ArrowUpDown } from "lucide-react";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [busyId, setBusyId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", is_superuser: false });
  const [selectedUser, setSelectedUser] = useState(null);   // 👈 naya
  const [currentUsername] = useState(localStorage.getItem("username") || "");

  const token = localStorage.getItem("access_token");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, sort_by: sortBy, sort_order: sortOrder },
      });
      setUsers(res.data.results || res.data);;
    } catch (err) {
      if (err.response?.status === 401) navigate("/login/home/0/dashboard");
      if (err.response?.status === 403) navigate("/");
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, token, navigate]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 350);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const toggleSortOrder = () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleToggleSuperuser = async (id, e) => {
    e.stopPropagation();
    setBusyId(id);
    try {
      const res = await API.patch(`/admin/users/${id}/toggle-superuser/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_superuser: res.data.is_superuser } : u)));
    } catch (err) {
      alert(err.response?.data?.error || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id, username, e) => {
    e.stopPropagation();
    if (!window.confirm(`User "${username}" ko permanently delete karna hai?`)) return;
    setBusyId(id);
    try {
      await API.delete(`/admin/users/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/users/create/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setForm({ username: "", email: "", password: "", is_superuser: false });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "User create nahi hua");
    }
  };

  return (
    <DashboardLayout
      title="Manage Users"
      subtitle="Users search, sort, promote/demote aur delete karo"
      actions={
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/20 text-blue-300 text-sm font-medium px-3 py-2 rounded-lg"
        >
          <UserPlus className="w-4 h-4" /> New User
        </button>
      }
    >
      {showForm && (
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Create user</h3>
            <button onClick={() => setShowForm(false)} className="text-neutral-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-3">
            <input required placeholder="Username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-neutral-500" />
            <input type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-neutral-500" />
            <input required type="password" placeholder="Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-neutral-500" />
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input type="checkbox" checked={form.is_superuser}
                onChange={(e) => setForm({ ...form, is_superuser: e.target.checked })} />
              Superuser banayein
            </label>
            <button type="submit" className="sm:col-span-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/20 text-blue-200 text-sm font-medium py-2.5 rounded-lg">
              Create
            </button>
          </form>
        </Card>
      )}

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Username ya email se search karo..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400/40"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-400/40"
        >
          <option value="date">Sort: Date joined</option>
          <option value="name">Sort: Name</option>
        </select>
        <button
          onClick={toggleSortOrder}
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
          className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-neutral-200 hover:bg-white/[0.06]"
        >
          <ArrowUpDown className="w-4 h-4" /> {sortOrder === "asc" ? "Asc" : "Desc"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Card
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.05] transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{u.username}</span>
                  {u.is_superuser && <Badge tone="blue">Superuser</Badge>}
                  {u.username === currentUsername && <Badge tone="neutral">You</Badge>}
                  <span className="text-[11px] text-neutral-500">{u.order_count} orders</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{u.email || "no email"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleToggleSuperuser(u.id, e)}
                  disabled={busyId === u.id || u.username === currentUsername}
                  title={u.is_superuser ? "Remove superuser" : "Make superuser"}
                  className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10 disabled:opacity-30"
                >
                  {u.is_superuser ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => handleDelete(u.id, u.username, e)}
                  disabled={busyId === u.id || u.username === currentUsername}
                  title="Delete user"
                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </DashboardLayout>
  );
};

export default ManageUsers;
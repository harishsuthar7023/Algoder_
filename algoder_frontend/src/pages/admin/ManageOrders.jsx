import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/Dashboardlayout";
import { Card, Badge } from "../../components/Dashboard/ui";
import OrderDetailModal from "../../components/Dashboard/OrderDetailModal";
import { Search, Trash2, RefreshCw, ArrowUpDown } from "lucide-react";

const statusTone = { success: "emerald", pending: "amber", failed: "rose" };

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");        // 👈 naya
  const [sortOrder, setSortOrder] = useState("desc");   // 👈 naya
  const [deletingId, setDeletingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);   // 👈 naya — full detail modal

  const token = localStorage.getItem("access_token");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/orders/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, status: statusFilter, sort_by: sortBy, sort_order: sortOrder },
      });
      setOrders(res.data.results || res.data);;
    } catch (err) {
      if (err.response?.status === 401) navigate("/login/home/0/dashboard");
      if (err.response?.status === 403) navigate("/");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder, token, navigate]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 350);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  const handleDelete = async (orderId, e) => {
    e.stopPropagation();   // 👈 taaki row click (modal open) trigger na ho
    if (!window.confirm(`Order ${orderId} delete karna hai? Yeh permanent hai.`)) return;
    setDeletingId(orderId);
    try {
      await API.delete(`/admin/orders/${orderId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSortOrder = () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  return (
    <DashboardLayout
      title="Manage Orders"
      subtitle="Search, sort aur orders manage karo"
      actions={
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-sm font-medium px-3 py-2 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      }
    >
      {/* Search + filter + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order ID, name, email, phone ya product se search karo..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-400/40"
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-400/40"
        >
          <option value="date">Sort: Date</option>
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
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center text-neutral-400 text-sm">Koi order nahi mila.</Card>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <Card
              key={o.order_id}
              onClick={() => setSelectedOrder(o)}
              className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.05] transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{o.order_id}</span>
                  <Badge tone={statusTone[o.status] || "neutral"}>{o.status}</Badge>
                  <span className="text-xs text-neutral-500 uppercase">{o.types}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 truncate">
                  {o.name} · {o.email} · {o.phone} · {o.product_name}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-emerald-300">₹{o.amount}</span>
                <button
                  onClick={(e) => handleDelete(o.order_id, e)}
                  disabled={deletingId === o.order_id}
                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 disabled:opacity-50"
                  title="Delete order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </DashboardLayout>
  );
};

export default ManageOrders;
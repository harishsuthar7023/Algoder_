import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { StatCard, Card, ResponsiveTable, Badge } from "../../components/Dashboard/ui";
import { AlertTriangle, RefreshCw } from "lucide-react";

const fileName = (path) => (path ? path.split("/").pop() : "No file");

const orderColumns = [
  { key: "order_id", label: "Order ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "file", label: "File", render: (o) => fileName(o.file) },
  { key: "amount", label: "Amount", render: (o) => `₹${o.amount}` },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    viewer_count: 0,
    user_count: 0,
    success_order_count: 0,
    success_orders: [],
    pending_orders: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login/home/0/dashboard");
          return;
        }

        const profileRes = await API.get("/user-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.data.is_superuser) {
          navigate("/");
          return;
        }

        const statsRes = await API.get("/dashboard-stats/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) {
          setStats(statsRes.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Dashboard error:", err.response?.data || err.message);
        if (cancelled) return;

        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login/home/0/dashboard");
        } else if (err.response?.status === 403) {
          navigate("/");
        } else {
          setError(
            err.response?.data?.error || "Something went wrong loading the dashboard."
          );
          setLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const totalSuccessAmount = stats.success_orders.reduce(
    (total, order) => total + parseFloat(order.amount || 0),
    0
  );

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-white font-semibold mb-1">Couldn't load dashboard</p>
          <p className="text-rose-400 text-sm mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview of your store and courses">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatCard label="Viewers" value={stats.viewer_count} accent="text-blue-400" />
        <StatCard label="Users" value={stats.user_count} accent="text-amber-400" />
        <StatCard label="Success Orders" value={stats.success_order_count} accent="text-emerald-400" />
        <StatCard label="Total Revenue" value={`₹${totalSuccessAmount.toFixed(2)}`} accent="text-emerald-300" />
      </div>

      {/* Success Orders */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">Successful Orders</h2>
          <Badge tone="emerald">{stats.success_orders.length}</Badge>
        </div>
        <ResponsiveTable
          columns={orderColumns}
          rows={stats.success_orders}
          keyField="order_id"
          emptyLabel="No successful orders yet."
        />
      </section>

      {/* Pending Orders */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">Pending Orders</h2>
          <Badge tone="amber">{stats.pending_orders.length}</Badge>
        </div>
        <ResponsiveTable
          columns={orderColumns}
          rows={stats.pending_orders}
          keyField="order_id"
          emptyLabel="No pending orders."
        />
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
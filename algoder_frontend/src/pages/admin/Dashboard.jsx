import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/Dashboardlayout";
import { StatCard, Card, Badge } from "../../components/Dashboard/ui";
import OrderDetailModal from "../../components/Dashboard/OrderDetailModal";
import {
  AlertTriangle, RefreshCw, PackagePlus, GraduationCap, ShoppingCart,
  Users, FileEdit, Eye, ArrowRight,
} from "lucide-react";

const quickActions = [
  { label: "Add Product", path: "/productadmin", icon: PackagePlus, tone: "text-blue-400" },
  { label: "Manage Courses", path: "/courseadmin", icon: GraduationCap, tone: "text-purple-400" },
  { label: "Manage Orders", path: "/adminorders", icon: ShoppingCart, tone: "text-emerald-400" },
  { label: "Manage Users", path: "/adminusers", icon: Users, tone: "text-amber-400" },
  { label: "Site Content", path: "/sitecontent", icon: FileEdit, tone: "text-cyan-400" },
];

const statusTone = { success: "emerald", pending: "amber", failed: "rose" };

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    viewer_count: 0, user_count: 0, success_order_count: 0, pending_order_count: 0,
    success_orders: [], pending_orders: [], recent_users: [],
  });
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return navigate("/login/home/0/dashboard");

        const profileRes = await API.get("/user-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.data.is_superuser) return navigate("/");

        const statsRes = await API.get("/dashboard-stats/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) {
          setStats(statsRes.data);
          setLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login/home/0/dashboard");
        } else if (err.response?.status === 403) {
          navigate("/");
        } else {
          setError(err.response?.data?.error || "Something went wrong loading the dashboard.");
          setLoading(false);
        }
      }
    };
    fetchStats();
    return () => { cancelled = true; };
  }, [navigate]);

  const totalSuccessAmount = stats.success_orders.reduce(
    (t, o) => t + parseFloat(o.amount || 0), 0
  );

  const recentOrders = [...stats.success_orders, ...stats.pending_orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
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
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-sm font-medium px-4 py-2 rounded-lg"
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* <StatCard label="Viewers" value={stats.viewer_count} accent="text-blue-400" /> */}
        <StatCard label="Users" value={stats.user_count} accent="text-amber-400" />
        <StatCard label="Success Orders" value={stats.success_order_count} accent="text-emerald-400" />
        <StatCard label="Total Revenue" value={`₹${totalSuccessAmount.toFixed(2)}`} accent="text-emerald-300" />
      </div>

      {/* Quick actions */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wide">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map(({ label, path, icon: Icon, tone }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
            >
              <Icon className={`w-5 h-5 ${tone}`} />
              <span className="text-sm font-medium text-neutral-200">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent orders */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <button
              onClick={() => navigate("/adminorders")}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <Card className="p-8 text-center text-neutral-400 text-sm">Abhi tak koi order nahi hai.</Card>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <button
                  key={o.order_id}
                  onClick={() => setSelectedOrder(o)}
                  className="w-full text-left"
                >
                  <Card className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.05] transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white truncate">{o.name}</span>
                        <Badge tone={statusTone[o.status] || "neutral"}>{o.status}</Badge>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 truncate">
                        {o.product_name} · {o.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-emerald-300">₹{o.amount}</span>
                      <Eye className="w-4 h-4 text-neutral-500" />
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Recent signups */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">New Signups</h2>
            <button
              onClick={() => navigate("/adminusers")}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {stats.recent_users?.length ? (
            <div className="space-y-2">
              {stats.recent_users.map((u) => (
                <Card key={u.id} className="p-3.5">
                  <p className="text-sm font-medium text-white">{u.username}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{u.email || "no email"}</p>
                  <p className="text-[11px] text-neutral-600 mt-1">
                    {u.date_joined && new Date(u.date_joined).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-neutral-400 text-sm">Koi naya signup nahi.</Card>
          )}
        </section>
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
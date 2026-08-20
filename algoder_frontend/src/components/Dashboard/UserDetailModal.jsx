import { useEffect, useState } from "react";
import API from "../../utils/api";
import { X, User, Mail, Calendar, ShieldCheck, Clock, ShoppingBag, MapPin, Phone } from "lucide-react";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
    <Icon className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-200 break-words">{value || "—"}</p>
    </div>
  </div>
);

const UserDetailModal = ({ user, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("access_token");
    setLoadingOrders(true);
    API.get(`/admin/users/${user.id}/orders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-neutral-900 border border-white/10 rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-neutral-900/95 backdrop-blur border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm">{user.username}</p>
            {user.is_superuser && (
              <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full border text-blue-300 bg-blue-500/10 border-blue-400/20">
                Superuser
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-neutral-400 hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-2">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mt-3 mb-1">Account Info</p>
          <Row icon={User} label="Username" value={user.username} />
          <Row icon={Mail} label="Email" value={user.email} />
          <Row icon={Calendar} label="Joined on" value={user.date_joined && new Date(user.date_joined).toLocaleString()} />
          <Row icon={Clock} label="Last login" value={user.last_login ? new Date(user.last_login).toLocaleString() : "Never"} />
          <Row icon={ShieldCheck} label="Status" value={user.is_active ? "Active" : "Disabled"} />

          <p className="text-xs text-neutral-500 uppercase tracking-wide mt-5 mb-2 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" /> Orders ({orders.length})
          </p>

          {loadingOrders ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-xs text-neutral-500 italic pb-4">Is user ne koi order nahi kiya.</p>
          ) : (
            <div className="space-y-2 pb-4">
              {orders.map((o) => (
                <div key={o.order_id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white">{o.product_name}</span>
                    <span className="text-xs font-medium text-emerald-300">₹{o.amount}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">{o.order_id} · {o.status}</p>
                  <div className="mt-2 space-y-1 text-[11px] text-neutral-400">
                    <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {o.phone}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {o.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
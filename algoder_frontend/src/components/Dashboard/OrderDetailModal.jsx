import { X, User, MapPin, Phone, Mail, Building2, Calendar, ShieldCheck } from "lucide-react";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
    <Icon className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-200 break-words">{value || "—"}</p>
    </div>
  </div>
);

const statusTone = {
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-400/20",
  pending: "text-amber-400 bg-amber-500/10 border-amber-400/20",
  failed: "text-rose-400 bg-rose-500/10 border-rose-400/20",
};

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-neutral-900 border border-white/10 rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-neutral-900/95 backdrop-blur border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm">{order.order_id}</p>
            <span className={`inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusTone[order.status] || ""}`}>
              {order.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-neutral-400 hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-2">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mt-3 mb-1">Order Info</p>
          <Row icon={Building2} label="Product" value={`${order.product_name} (${order.types})`} />
          <Row icon={Calendar} label="Ordered on" value={order.created_at && new Date(order.created_at).toLocaleString()} />
          <Row icon={ShieldCheck} label="Amount" value={`₹${order.amount}`} />

          <p className="text-xs text-neutral-500 uppercase tracking-wide mt-5 mb-1">Contact Details (checkout time)</p>
          <Row icon={User} label="Name" value={order.name} />
          <Row icon={Mail} label="Email" value={order.email} />
          <Row icon={Phone} label="Phone" value={order.phone} />
          <Row icon={MapPin} label="Address" value={order.address} />
          {order.company_name && <Row icon={Building2} label="Company" value={order.company_name} />}

          {order.buyer ? (
            <>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mt-5 mb-1">Linked Account</p>
              <Row icon={User} label="Username" value={order.buyer.username} />
              <Row icon={Mail} label="Account email" value={order.buyer.account_email} />
              <Row icon={Calendar} label="Account created" value={order.buyer.date_joined && new Date(order.buyer.date_joined).toLocaleDateString()} />
              <Row icon={ShieldCheck} label="Account status" value={order.buyer.is_active ? "Active" : "Disabled"} />
            </>
          ) : (
            <p className="text-xs text-neutral-500 mt-5 italic">Koi linked account nahi mila (guest order).</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
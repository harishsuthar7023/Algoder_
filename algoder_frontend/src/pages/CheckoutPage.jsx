import React, { useEffect, useRef, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, Truck, Loader2 } from "lucide-react";
import API from "../utils/api";
import Navbar from "../components/NavBar";
import Footer from "../components/HomeSections/Footer";

export default function CheckoutPage() {
  const cashfreeRef = useRef(null);
  const { id, types } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    address: "",
    company_name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          types === "course"
            ? await API.get(`/course/${id}/`)
            : await API.get(`/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchData();
  }, [id, types]);

  useEffect(() => {
    const loadCashfreeSDK = async () => {
      try {
        cashfreeRef.current = await load({ mode: "production" });
        // cashfreeRef.current = await load({ mode: "sandbox" });
      } catch (error) {
        console.error("Cashfree SDK load failed:", error);
      }
    };
    loadCashfreeSDK();
  }, []);

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        await API.get("protected/");
      } catch (err) {
        console.error("Auth failed, redirecting to login:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate(`/login/checkout/${id}/${types}`);
      }
    };
    fetchProtected();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!product) return;
    setProcessing(true);

    const payload = {
      ...formData,
      amount: product.price,
      product_name: types === "course" ? product.title : product.name,
      video_link2: product.video_url_2,
      type: product.types,
    };

    try {
      const token = localStorage.getItem("access_token");
      const res = await API.post("/create-order/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.payment_session_id) {
        await cashfreeRef.current.checkout({
          paymentSessionId: res.data.payment_session_id,
          returnUrl: `http://algoder.onrender.com/#/ordercheck`,
          // returnUrl: `http://localhost:5173/#/ordercheck`,
        });
      } else {
        alert("Payment session ID not received.");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment initiation failed.");
    } finally {
      setProcessing(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.07] transition-colors";

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="relative bg-neutral-900 min-h-screen pt-24 px-4 pb-24 overflow-hidden">
          <div className="pointer-events-none absolute top-24 left-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />
          <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 h-96 rounded-2xl bg-white/[0.04] border border-white/10" />
            <div className="h-96 rounded-2xl bg-white/[0.04] border border-white/10" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const savings = (product.original_price - product.price).toFixed(0);

  return (
    <>
      <Navbar />
      <div className="relative bg-neutral-900 text-neutral-200 min-h-screen pt-24 sm:pt-28 px-4 sm:px-6 pb-24 overflow-hidden">
        <div className="pointer-events-none absolute top-24 left-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
              Secure checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Complete your order
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Form */}
            <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white mb-6">Your information</h2>

              <form onSubmit={handlePayment} className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Full name *"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address *"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number *"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address *"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="text"
                  name="company_name"
                  placeholder="Company name (optional)"
                  onChange={handleChange}
                  className={inputClass}
                />

                <div className="flex items-start gap-2.5 p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-emerald-400 text-sm">
                    Your information is protected with 256-bit SSL encryption
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 disabled:opacity-60 text-neutral-900 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:-translate-y-0.5"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to payment"
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT: Order summary */}
            <div className="space-y-5">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-5">Order summary</h3>

                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/10">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="font-semibold text-white text-sm leading-snug">
                    {types === "course" ? product.title : product.name}
                  </p>
                </div>

                <div className="text-sm space-y-2.5">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>₹{product.original_price}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Tax (GST)</span>
                    <span>₹0</span>
                  </div>
                  {product.original_price > product.price && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Discount</span>
                      <span className="text-emerald-400 font-medium">− ₹{savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-3 mt-3 text-base font-bold text-white">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                      ₹{product.price}
                    </span>
                  </div>
                </div>

                {product.original_price > product.price && (
                  <div className="mt-5 bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 font-semibold text-center text-sm py-2.5 rounded-lg">
                    You're saving ₹{savings}!
                  </div>
                )}
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                    We accept
                  </p>
                  <div className="flex gap-2">
                    {["VISA", "MC", "UPI", "NET"].map((method) => (
                      <span
                        key={method}
                        className="bg-white/5 border border-white/10 text-neutral-300 px-2.5 py-1 rounded-md text-xs font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 p-3 rounded-lg text-sm text-neutral-300">
                  <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                  <strong className="font-medium">Instant delivery</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
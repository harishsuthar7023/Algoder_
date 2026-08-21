import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import API from "../utils/api";
import Navbar from "../components/NavBar";
import Footer from "../components/HomeSections/Footer";
import GlowOrb from "../components/Effects/Gloworb";
const OrderCheck = () => {
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.data || res.data.length === 0) {
          setStatus("error");
          return;
        }

        let verifiedAny = false;

        await Promise.all(
          res.data.map((order) =>
            API.post("/verify-order/", {
              order_id: order.order_id,
              amount: order.amount,
              product_name: order.product_name,
              total_order: res.data,
            })
              .then(() => {
                verifiedAny = true;
              })
              .catch((err) => {
                console.error("Verification error:", err);
              })
          )
        );

        if (verifiedAny) {
          setStatus("success");
          setTimeout(() => navigate("/myorders/sdk5df6af6aff6sa/6af5f46afaffkhff/654a5526f655655"), 1500);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-neutral-900 flex items-center justify-center px-5 overflow-hidden">
        <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
        <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />

        <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 text-center">
          {status === "verifying" && (
            <>
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verifying your payment</h2>
              <p className="text-neutral-400 text-sm">
                Please wait a moment, this won't take long.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Payment verified</h2>
              <p className="text-neutral-400 text-sm">Redirecting you to your orders...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Couldn't verify payment</h2>
              <p className="text-neutral-400 text-sm mb-6">
                If money was deducted, it will reflect in your orders shortly. You can also check manually.
              </p>
              <button
                onClick={() => navigate("/myorders")}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold py-2.5 rounded-lg transition-all"
              >
                Go to my orders
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderCheck;
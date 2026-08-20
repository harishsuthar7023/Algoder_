import React, { useEffect, useState } from "react";
import { Download, XCircle, PackageOpen, RefreshCw, PlayCircle, X } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/HomeSections/Footer";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-400/20",
  pending: "text-amber-400 bg-amber-500/10 border-amber-400/20",
  failed: "text-red-400 bg-red-500/10 border-red-400/20",
};

// YouTube ke kisi bhi format ko embeddable URL me convert karta hai
const convertToEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkLogin, setCheckLogin] = useState("");
  const [activeVideoUrl, setActiveVideoUrl] = useState(null); // 👈 modal control
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        await API.get("protected/");
      } catch (err) {
        console.error("Auth failed, redirecting to login:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setCheckLogin("You need to be logged in to continue.");
        setLoading(false);
      }
    };
    fetchProtected();
  }, [navigate]);

  useEffect(() => {
    if (checkLogin) return;
    API.get("/orders/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [checkLogin]);

  const handleLogin = () => {
    navigate(`/login/orders/5847857/orders`);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const getYoutubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes("youtube.com")) {
        const videoId = urlObj.searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      if (urlObj.hostname === "youtu.be") {
        const videoId = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      return url;
    } catch {
      return url;
    }
  };

  



  if (checkLogin) {
    return (
      <>
        <Navbar />
        <div className="relative flex items-center justify-center min-h-screen bg-neutral-900 px-5 overflow-hidden">
          <div className="pointer-events-none absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

          <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span>
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Sign in required</h2>
            <p className="text-neutral-400 text-sm mb-6">
              {checkLogin || "You need to be logged in to continue."}
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold py-2.5 rounded-lg transition-all"
            >
              Log in
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-neutral-900 text-white px-4 py-10 pt-28 overflow-hidden">
        <div className="pointer-events-none absolute top-24 right-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="mb-8 pb-5 border-b border-white/10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-3 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
              Order history
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">My orders</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-6 animate-pulse">
                  <div className="flex flex-wrap gap-8">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-2.5 w-16 bg-white/5 rounded" />
                        <div className="h-4 w-24 bg-white/5 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">Couldn't load your orders</h3>
              <p className="text-neutral-400 text-sm max-w-xs">
                Something went wrong. Please refresh the page or try again shortly.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center mb-4">
                <PackageOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">No orders yet</h3>
              <p className="text-neutral-400 text-sm max-w-xs mb-6">
                Once you purchase a tool or course, it'll show up here.
              </p>
              <a
                href="/products"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
              >
                Browse products
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const statusClass =
                  statusStyles[order.status] || "text-neutral-400 bg-white/5 border-white/10";

                return (
                  <div
                    key={order.id || order.order_id || index}
                    className="group relative bg-white/[0.03] border border-white/10 rounded-2xl px-5 sm:px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div className="flex flex-wrap gap-x-8 gap-y-4 justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs uppercase tracking-wide mb-1">Order ID</span>
                        <span className="text-white font-semibold text-sm">#{order.order_id}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs uppercase tracking-wide mb-1">Tool</span>
                        <span className="text-white font-medium text-sm">{order.product_name}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs uppercase tracking-wide mb-1">Date</span>
                        <span className="text-neutral-300 text-sm">{formatDate(order.created_at)}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs uppercase tracking-wide mb-1">Status</span>
                        <span className={`inline-block w-fit text-xs font-semibold px-2.5 py-1 rounded-full border ${statusClass}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs uppercase tracking-wide mb-1">Amount</span>
                        <span className="text-blue-300 font-bold text-sm">₹{order.amount}</span>
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        {order.status === "success" && order.types === "product" ? (
                          <>
                            {order.file ? (
                              <a
                                href={order.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold text-sm px-4 py-2 rounded-lg transition-all"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </a>
                            ) : (
                              <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-400/20 px-4 py-2 rounded-lg text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                Not available
                              </div>
                            )}

                            {/* 👇 Naya Watch Video button - sirf product orders me, sirf agar video_url ho */}
                            {order.video_url && (
                              <button
                                onClick={() => setActiveVideoUrl(order.video_url)}
                                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-blue-400/30 text-neutral-200 font-medium text-sm px-4 py-2 rounded-lg transition-all"
                              >
                                <PlayCircle className="w-4 h-4" />
                                Watch video
                              </button>
                            )}
                          </>
                        ) : order.status === "success" && order.types === "course" ? (
                          <a
                            href={`#/mycourse/${order.course_id}`}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold text-sm px-4 py-2 rounded-lg transition-all"
                          >
                            Get course
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-400/20 px-4 py-2 rounded-lg text-sm font-medium">
                            <XCircle className="w-4 h-4" />
                            Not available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 👇 Video Modal */}
      {activeVideoUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-video bg-black">
              <iframe
                src={getYoutubeEmbedUrl(activeVideoUrl)}
                title="YouTube video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyOrders;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/HomeSections/Footer";
import ProductCard from "../components/ProductCard";
import API from "../utils/api";
import { PackageSearch, RefreshCw, MessageCircle } from "lucide-react";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    setError(false);
    API.get("/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // console.log(products);

  return (
    <>
      <Navbar />
      <div className="relative bg-neutral-900 min-h-screen px-4 sm:px-8 lg:px-16 xl:px-24 pb-16 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute top-24 right-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

        {/* Header */}
        <div className="relative max-w-7xl mx-auto pt-28 pb-10 md:pb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            Full catalog
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            All products
          </h1>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl">
            Every tool, indicator, and course we offer — built for traders who want an edge.
          </p>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-white/5" />
                  <div className="p-3.5 space-y-2">
                    <div className="h-2.5 w-1/3 bg-white/5 rounded" />
                    <div className="h-3.5 w-3/4 bg-white/5 rounded" />
                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">Couldn't load products</h3>
              <p className="text-neutral-400 text-sm max-w-xs mb-6">
                Something went wrong on our end. Try again, or reach out if it keeps happening.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Retry
                </button>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Contact us
                </Link>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center mb-4">
                <PackageSearch className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">No products yet</h3>
              <p className="text-neutral-400 text-sm max-w-xs">
                New tools and courses are on the way — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductPage;
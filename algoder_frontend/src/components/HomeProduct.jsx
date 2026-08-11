import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import API from "../utils/api";
import { PackageSearch } from "lucide-react";

function HomeProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/products/")
      .then((res) => setProducts(res.data.filter((p) => p.homepage)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative bg-neutral-900 py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 bg-blue-500/[0.06] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/[0.05] rounded-full blur-[120px]" />

      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 mb-10 md:mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
          Our collection
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          Products
        </h1>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl">
          Browse our latest product collection, curated for traders at every level.
        </p>
      </div>

      {/* Grid Container */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-3.5 w-3/4 bg-white/5 rounded" />
                  <div className="h-3 w-1/2 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center mb-4">
              <PackageSearch className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">No products yet</h3>
            <p className="text-neutral-400 text-sm max-w-xs">
              Check back soon — new products will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeProduct;
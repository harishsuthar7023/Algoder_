// components/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, ImageOff, Trash2 } from "lucide-react";
import API from "../utils/api";

const ProductCard = ({ product, index = 0, variant = "default", onDelete }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const thumbnail = product.images?.[0]?.image_url;

  const hasDiscount =
    product.original_price && Number(product.original_price) > Number(product.price);

  const discountPercent = product.discount
    ? Math.round(Number(product.discount))
    : hasDiscount
    ? Math.round(
        ((Number(product.original_price) - Number(product.price)) /
          Number(product.original_price)) *
          100
      )
    : null;

  const handleViewProduct = () => {
    const loading = document.getElementById(`loader-${product.id}`);
    if (loading) loading.classList.remove("hidden");
    setTimeout(() => {
      if (loading) loading.classList.add("hidden");
      navigate(`/product/${product.id}`);
    }, 500);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setDeleting(true);
      await API.delete(`/products/${product.id}/delete/`);
      onDelete?.(product.id);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product.");
      setDeleting(false);
    }
  };

  return (
    <div
      className="group relative w-full text-left rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.06] hover:-translate-y-1.5 cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleViewProduct}
    >
      {/* Admin delete button */}
      {variant === "admin" && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-neutral-900/80 hover:bg-red-500/90 disabled:opacity-60 text-neutral-300 hover:text-white text-[11px] font-medium py-1 px-2 rounded-lg backdrop-blur-sm border border-white/10 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          {deleting ? "..." : "Delete"}
        </button>
      )}

      {/* Discount badge — small, corner, unobtrusive */}
      {discountPercent > 0 && variant !== "admin" && (
        <span className="absolute top-2.5 left-2.5 z-20 bg-neutral-900/80 backdrop-blur-sm border border-white/10 text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded-md">
          −{discountPercent}%
        </span>
      )}

      {/* Image — dominant element */}
      <div className="aspect-video bg-neutral-800 overflow-hidden relative">
        {thumbnail && !imgError ? (
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <div className="text-center">
              <ImageOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-xs">No image</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Compact info block */}
      <div className="p-3.5 space-y-1.5 text-white relative">
        {product.types && (
          <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
            {product.types}
          </p>
        )}

        <h3 className="text-sm font-semibold leading-snug text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-neutral-500 text-xs leading-relaxed line-clamp-1">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-white">
              {Number(product.price) === 0 ? "Free" : `₹${product.price}`}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-neutral-600 line-through">
                ₹{product.original_price}
              </span>
            )}
          </div>

          <span className="flex items-center gap-0.5 text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
            View
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div
          id={`loader-${product.id}`}
          className="hidden absolute inset-0 -m-3.5 bg-neutral-900/95 flex items-center justify-center rounded-2xl z-20"
        >
          <div className="flex items-center gap-2 text-blue-400">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400/30 border-t-blue-400" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
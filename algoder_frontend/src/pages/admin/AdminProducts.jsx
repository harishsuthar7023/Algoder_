import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { Button } from "../../components/Dashboard/ui";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (deletedId) => {
    setProducts(products.filter((product) => product.id !== deletedId));
  };

  return (
    <DashboardLayout
      title="Products"
      subtitle={`${products.length} product${products.length === 1 ? "" : "s"} in your catalog`}
      actions={
        <Button variant="primary" onClick={() => navigate("/productadmin")}>
          + Add Product
        </Button>
      }
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
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
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-white/10 bg-white/[0.03]">
          <p className="text-neutral-400 text-sm mb-1">
            No products yet — add your first one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              variant="admin"
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminProducts;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Product from "../components/Product";
import API from "../utils/api";


function ProductBannerList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products/")
      .then((res) =>
        setProducts(res.data.filter((p) => p.homepage))
      )
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-neutral-800 py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Products
        </h1>
        <p className="mt-2 text-neutral-400 text-sm sm:text-base">
          Browse our latest product collection.
        </p>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductBannerList;

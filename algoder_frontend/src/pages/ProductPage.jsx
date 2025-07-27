import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';

import Footer from '../components/Footer';
import MainProduct from '../components/MainProduct';
import API from '../utils/api';

function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔄 Stylish Loader UI when products are not yet loaded
  if (products.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[100vh] bg-neutral-800 px-5">
          <div className="w-full max-w-md bg-[#303030] text-white p-8 rounded-2xl shadow-2xl border border-neutral-700 text-center">
            <h2 className="text-2xl font-semibold text-blue-400 mb-3">Loading Products</h2>
            <p className="text-gray-300 mb-6">Please wait while we fetch the latest items...</p>
            <div className="w-10 h-10 mx-auto border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-neutral-800 min-h-screen px-4 sm:px-6 pb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center pt-24 text-white">Products</h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {products.map(product => (
            <MainProduct key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import MainProduct from '../components/MainProduct';


function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

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

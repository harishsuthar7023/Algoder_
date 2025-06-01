import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashNav from "../components/DashNav";
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDelete }) => {
  const thumbnail = product.image1 || product.image2 || product.image3;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8000/api/products/${product.id}/delete/`);
        onDelete(product.id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product.');
      }
    }
  };

  return (
    <div className="relative block w-full text-left rounded-xl overflow-hidden bg-[#303030] shadow hover:shadow-xl transition-all transform hover:scale-[1.015]">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold py-1 px-2 rounded"
      >
        Delete
      </button>

      {/* Image and Info */}
      <Link to={`/product/${product.id}`}>
        <div className="aspect-video bg-[#303030]">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-2 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold truncate">{product.name}</h3>
            <span className="text-sm font-bold">
              {product.price === 0 ? "Free" : `₹${product.price}`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-blue-400 text-xs font-medium">View Details →</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.264 3.9a1 1 0 00.95.69h4.104c.969 0 1.371 1.24.588 1.81l-3.32 2.416a1 1 0 00-.364 1.118l1.264 3.9c.3.921-.755 1.688-1.54 1.118l-3.32-2.416a1 1 0 00-1.175 0l-3.32 2.416c-.784.57-1.838-.197-1.54-1.118l1.264-3.9a1 1 0 00-.364-1.118L2.098 9.327c-.783-.57-.38-1.81.588-1.81h4.104a1 1 0 00.95-.69l1.264-3.9z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};


function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleDelete = (deletedId) => {
    setProducts(products.filter(product => product.id !== deletedId));
  };

  return (
    <div className="bg-neutral-800 min-h-screen px-4 p-4 sm:px-6 pb-10">
      <DashNav />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const ZoomableImage = ({ src, alt }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomPosition({
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md h-[400px] sm:h-[460px] bg-[#303030] rounded-xl overflow-hidden cursor-zoom-in mx-auto shadow-md"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        draggable={false}
      />
      {showZoom && (
        <div
          className="absolute top-2 right-2 w-52 h-52 sm:w-60 sm:h-60 border border-neutral-500 rounded-lg shadow-2xl z-50"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "200%",
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/checkout/${product.id}`);
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        const images = [
          res.data.image1,
          res.data.image2,
          res.data.image3,
          res.data.image4,
          res.data.image5
        ].filter(Boolean);
        setSelectedImage(images[0] || "https://via.placeholder.com/600x800?text=Product+Image");
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) {
    return <div className="text-center py-20 text-gray-400">Loading product details...</div>;
  }

  const {
    name = "Product Name",
    price = 999,
    original_price = 1999,
    discount = 50,
    description = "Default product description.",
    detail_1 = "Cotton",
    detail_2 = "Full",
    detail_3 = "Round",
    detail_4 = "Pants",
    detail_5 = "Pants",

    full_description1 = "Full description of the product.",
    full_description2 = "Full description of the product.",
  } = product;

  const productImages = [
    product.image1, product.image2, product.image3, product.image4, product.image5
  ].filter(Boolean);

  const imgList = productImages.length > 0 ? productImages : [
    "https://via.placeholder.com/600x800?text=Product+Image"
  ];

  return (
    <>
      <Navbar />
      <div className="bg-neutral-800 min-h-screen text-gray-200 pt-24 px-4 sm:px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
          
          {/* Image Section */}
          <div className="flex-1 flex flex-col items-center">
            <ZoomableImage src={selectedImage} alt={name} />
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {imgList.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 object-contain rounded-lg border transition-all duration-300 cursor-pointer ${
                    selectedImage === img ? "border-white scale-105" : "border-neutral-500 hover:border-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{name}</h1>
            <div className="text-xl font-semibold text-green-400">₹{price}</div>
            <div className="text-sm text-gray-400 line-through">₹{original_price}</div>
            <div className="text-sm text-pink-400 font-semibold">{discount}% OFF</div>
            <p className="text-gray-300 text-base">{description}</p>

            <div className="pt-4">
              <button 
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                BUY NOW
              </button>
            </div>

            <div className="border-t border-gray-700 pt-6 mt-6 space-y-2">
              <h3 className="text-lg font-semibold text-white">Product Details</h3>
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                <li>{detail_1}</li>
                <li>{detail_2}</li>
                <li>{detail_3}</li>
                <li>{detail_4}</li>
                <li>{detail_5}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="max-w-4xl mx-auto mt-12 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">More About This Product</h2>
          <p className="text-base text-gray-300 leading-relaxed">{full_description1}</p>
          <br />
          <p className="text-base text-gray-300 leading-relaxed">{full_description2}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;

import React from 'react';

const ProductSummary = () => {
  const products = [
    {
      name: "Electric Kiss Polarized Sunglasses",
      price: 49,
      qty: 1,
      image: "https://via.placeholder.com/60x60"
    },
    {
      name: "Royal Blitz Square Sunglasses",
      price: 49,
      qty: 1,
      image: "https://via.placeholder.com/60x60"
    }
  ];

  const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="text-gray-700">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
      {products.map((p, i) => (
        <div key={i} className="flex items-center gap-4 mb-3">
          <img src={p.image} alt={p.name} className="w-14 h-14 rounded" />
          <div className="flex-1">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-500">Quantity: {p.qty}</p>
          </div>
          <p className="font-semibold">${p.price.toFixed(2)}</p>
        </div>
      ))}
      <div className="text-sm text-blue-600 mt-2 cursor-pointer">+ DISCOUNT</div>

      <div className="border-t mt-4 pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>—</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>—</span>
        </div>
        <div className="flex justify-between font-bold pt-2">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;

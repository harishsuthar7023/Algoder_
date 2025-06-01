import React from 'react';

const CheckoutForm = () => {
  return (
    <form className="space-y-4">
      <div className="flex gap-3">
        <input type="email" placeholder="Email address" required className="w-1/2 border p-2 rounded" />
        <input type="tel" placeholder="Phone number" required className="w-1/2 border p-2 rounded" />
      </div>

      <div className="flex gap-3">
        <input type="text" placeholder="First name" required className="w-1/2 border p-2 rounded" />
        <input type="text" placeholder="Last name" required className="w-1/2 border p-2 rounded" />
      </div>

      <input type="text" placeholder="Company name (optional)" className="w-full border p-2 rounded" />
      <input type="text" placeholder="Street address" required className="w-full border p-2 rounded" />
      <input type="text" placeholder="+ Apartment, building, floor" className="w-full border p-2 rounded" />

      <div className="flex gap-3">
        <input type="text" placeholder="Postal" className="w-1/3 border p-2 rounded" />
        <input type="text" placeholder="City" className="w-1/3 border p-2 rounded" />
        <input type="text" placeholder="Province" className="w-1/3 border p-2 rounded" />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-semibold"
      >
        Continue
      </button>
    </form>
  );
};

export default CheckoutForm;

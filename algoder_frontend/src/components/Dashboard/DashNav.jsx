import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react"; // Home icon import

const DashNav = () => {
  return (
    <div className="bg-neutral-700 shadow-md rounded-2xl p-4 mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
      <div className="space-x-2 flex items-center">
        {/* Home Icon Button */}
        <Link to="/">
          <button className="bg-neutral-600 hover:bg-neutral-500 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2">
            <Home className="w-5 h-5" />
          </button>
        </Link>

        <Link to="/dashboard">
          <button className="bg-neutral-600 hover:bg-neutral-500 text-white font-medium py-2 px-4 rounded-xl">
            Dashboard Home
          </button>
        </Link>
        <Link to="/adminproducts">
          <button className="bg-neutral-600 hover:bg-neutral-500 text-white font-medium py-2 px-4 rounded-xl">
            Products
          </button>
        </Link>
        <Link to="/productadmin">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl">
            Add Product
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DashNav;

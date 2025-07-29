import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useParams } from "react-router-dom";
import API from "../utils/api";

export default function CheckoutPage() {
  const cashfreeRef = useRef(null);
  const { id, types } = useParams();

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    address: "",
    company_name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (types === "course") {
          const res = await API.get(`/course/${id}/`);
          setProduct(res.data);
        } else {
          const res = await API.get(`/products/${id}/`);
          setProduct(res.data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchData();
  }, [id, types]);

  useEffect(() => {
    const loadCashfreeSDK = async () => {
      try {
        cashfreeRef.current = await load({ mode: "production" });
        // console.log("Cashfree SDK loaded successfully", cashfreeRef.current);
      } catch (error) {
        console.error("Cashfree SDK load failed:", error);
      }
    };
    loadCashfreeSDK();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!product) return;

    const prc = types === "course" ? product.title : product.name;

    try {
      const payload = {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        address: formData.address,
        company_name: formData.company_name,
        amount: product.price,
        product_name: prc,
      };

      const token = localStorage.getItem("access_token");

      const res = await API.post("/create-order/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.payment_session_id) {
        const checkoutOptions = {
          paymentSessionId: res.data.payment_session_id,
          returnUrl: `https://www.algoder.in/#/ordercheck`,
        };
        console.log("Checkout options:", checkoutOptions);

        if (cashfreeRef.current && cashfreeRef.current.checkout) {
          await cashfreeRef.current.checkout(checkoutOptions);
        } else {
          console.error("Cashfree SDK not ready");
        }
      } else {
        alert("Payment session ID not received.");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment initiation failed.");
    }
  };

  if (!product) {
    return <div className="text-center text-white py-10">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-[#303030] flex justify-center items-center p-6">
      <div className="bg-neutral-800 text-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-gray-700">
        {/* Form Section */}
        <div className="w-full md:w-2/3 p-8 space-y-6">
          <h2 className="text-3xl font-bold text-blue-600">Checkout</h2>
          <form onSubmit={handlePayment} className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 bg-[#404040] border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-[#404040] border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="w-full p-3 bg-[#404040] border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="w-full p-3 bg-[#404040] border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              name="company_name"
              placeholder="Company Name (Optional)"
              onChange={handleChange}
              className="w-full p-3 bg-[#404040] border border-gray-600 rounded text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-black font-bold p-3 rounded hover:bg-blue-700 transition duration-300"
            >
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* Summary Section */}
        <div className="w-full md:w-1/3 bg-[#222222] p-8">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <p className="font-medium text-gray-300">{product.name}</p>
            <p className="text-2xl font-bold text-white">₹{product.price}</p>
            <hr className="border-gray-600 my-3" />
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>₹{product.price}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-200 border-t border-gray-600 pt-2">
              <span>Total</span>
              <span>₹{product.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

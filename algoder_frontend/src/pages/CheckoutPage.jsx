import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useParams } from "react-router-dom";
import API from "../utils/api";

export default function CheckoutPage() {
  const cashfreeRef = useRef(null);
  const { id , types} = useParams();
  console.log(id, types);

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
        if (types === 'course') {
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
        cashfreeRef.current = await load({ mode: "sandbox" }); // use 'production' in live
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

    if (types === 'course') { 
      var prc = product.title;
    } else {
      var prc = product.name;
    }

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

      const token = localStorage.getItem("access_token"); // ya jahan bhi aap token store kar rahe ho

      const res = await API.post(
        "/create-order/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // 👈 JWT token bhej rahe ho
          },
        }
      );

      if (res.data.payment_session_id) {
        const checkoutOptions = {
          paymentSessionId: res.data.payment_session_id,
          // returnUrl: `https://algoder-nmqo.onrender.com/#/ordercheck`,
          returnUrl: `http://localhost:5173/#/ordercheck`,
        };

        await cashfreeRef.current.checkout(checkoutOptions);
      } else {
        alert("Payment session ID not received.");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment initiation failed.");
    }
  };

  if (!product) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* Form */}
        <div className="w-full md:w-2/3 p-6 space-y-4">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <form onSubmit={handlePayment} className="space-y-4">
            <input type="text" name="firstName" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border rounded" required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded" required />
            <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} className="w-full p-3 border rounded" required />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} className="w-full p-3 border rounded" required />
            <input type="text" name="company_name" placeholder="Company Name (Optional)" onChange={handleChange} className="w-full p-3 border rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* Product Summary */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
            <hr className="my-2" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{product.price}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>₹{product.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, XCircle } from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import API from '../utils/api';
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [checkLogin, setCheckLogin] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const res = await API.get('protected/');
        // setMessage(res.data.message);
      } catch (err) {
        console.error('Auth failed, redirecting to login:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setCheckLogin("You need to be logged in to continue.")
        // navigate('/login');
      }
    };
  fetchProtected();
  }, [navigate]);

  useEffect(() => {
    API.get("/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const hendelLogin = (() => {
    // setCheckLogin("You need to be logged in to continue.")
    navigate("/login")
  }
  )


  if (checkLogin) {
    return (
      <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[100vh] px-5 bg-neutral-800">
        <div className="w-full max-w-md bg-[#303030] text-white p-8 rounded-2xl shadow-2xl border border-neutral-700">
          <h2 className="text-2xl font-bold text-red-400 mb-3">LOGIN ALGODER</h2>
          <p className="text-gray-300 mb-6">
            {checkLogin || "You need to be logged in to continue."}
          </p>
          <button
            onClick={hendelLogin}
            className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Login
          </button>
        </div>
      </div>
      </>
    );
  }


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white px-4 py-10 pt-28">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 border-b border-neutral-600 pb-4">
            🧾 My Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-400 text-center mt-20 text-lg">No orders found.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div
                  key={order.id || order.order_id || index}
                  className="bg-neutral-700 border border-neutral-600 rounded-2xl px-6 py-5 shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-wrap gap-6 justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Order ID</span>
                      <span className="text-white font-medium text-lg">#{order.order_id}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Name</span>
                      <span className="text-white font-medium">{order.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Status</span>
                      <span className={`font-semibold ${order.status === 'success' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Amount</span>
                      <span className="text-white font-medium">₹{order.amount}</span>
                    </div>

                    {order.status === 'success' && order.file ? (
                      <a
                        href={`http://localhost:8000${order.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium px-4 py-2 rounded-lg shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </a>
                    ) : order.status === 'success' && order.types === 'course' ? (
                      <a
                        href={`/course/${order.product_id || order.id}`}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white font-medium px-4 py-2 rounded-lg shadow-md"
                      >
                        {/* <Download className="w-4 h-4" /> */}
                        Get Course
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500 px-4 py-2 rounded-lg shadow-sm">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Not Available</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;

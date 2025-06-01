import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashNav from "../components/DashNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    viewer_count: 0,
    user_count: 0,
    success_order_count: 0,
    success_orders: [],
    pending_orders: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Check if superuser
        const profileRes = await axios.get("http://localhost:8000/api/user-profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.data.is_superuser) {
          alert("❌ You are not authorized to access this page");
          navigate("/");
          return;
        }

        // Fetch stats
        const statsRes = await axios.get("http://localhost:8000/api/dashboard-stats/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        navigate("/login");
      }
    };

    fetchStats();
  }, [navigate]);

  const totalSuccessAmount = stats.success_orders.reduce(
    (total, order) => total + parseFloat(order.amount || 0),
    0
  );

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-neutral-800 p-4 font-sans text-white">
      <DashNav />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-neutral-700 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">Viewer</h2>
          <p className="text-3xl font-bold text-blue-400">{stats.viewer_count}</p>
        </div>

        <div className="bg-neutral-700 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">User</h2>
          <p className="text-3xl font-bold text-yellow-400">{stats.user_count}</p>
        </div>

        <div className="bg-neutral-700 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">Success Orders</h2>
          <p className="text-3xl font-bold text-green-400">{stats.success_order_count}</p>
        </div>

        <div className="bg-neutral-700 rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">Total Success Amount</h2>
          <p className="text-3xl font-bold text-green-300">₹{totalSuccessAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Success Orders */}
      <h2 className="text-2xl font-bold mb-4 text-green-400">✅ Successful Orders</h2>
      <div className="overflow-auto mb-10">
        <table className="min-w-full bg-neutral-700 text-white rounded-lg shadow">
          <thead>
            <tr className="bg-neutral-600">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Address</th>``
              <th className="py-2 px-4">File</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {stats.success_orders.map((order, index) => (
              <tr key={index} className="border-t border-neutral-600">
                <td className="py-2 px-4">{order.order_id}</td>
                <td className="py-2 px-4">{order.name}</td>
                <td className="py-2 px-4">{order.email}</td>
                <td className="py-2 px-4">{order.phone}</td>
                <td className="py-2 px-4">{order.address}</td>
                <td className="py-2 px-4">
                  {order.file ? (
                    order.file.split("/").pop()
                  ) : (
                    "No File"
                  )}
                </td>
                <td className="py-2 px-4">₹{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Orders */}
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">🕒 Pending Orders</h2>
      <div className="overflow-auto mb-10">
        <table className="min-w-full bg-neutral-700 text-white rounded-lg shadow">
          <thead>
            <tr className="bg-neutral-600">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">File</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {stats.pending_orders.map((order, index) => (
              <tr key={index} className="border-t border-neutral-600">
                <td className="py-2 px-4">{order.order_id}</td>
                <td className="py-2 px-4">{order.name}</td>
                <td className="py-2 px-4">{order.email}</td>
                <td className="py-2 px-4">{order.phone}</td>
                <td className="py-2 px-4">{order.address}</td>
                <td className="py-2 px-4">
                  {order.file ? (
                    order.file.split("/").pop()
                  ) : (
                    "No File"
                  )}
                </td>
                <td className="py-2 px-4">₹{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

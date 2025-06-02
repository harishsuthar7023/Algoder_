// MyOrders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
	const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://algoder.onrender.com/api/orders/",
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("access_token")}`,
						},
					}
				);
        // setOrders(res.data);

        // For each order, verify its status
        res.data.forEach(order => {
          axios.post("https://algoder.onrender.com/api/verify-order/", {
            order_id: order.order_id,
            amount: order.amount
          }).then(verifyRes => {
            console.log("Verified:", verifyRes.data);
						navigate('/myorders')
          }).catch(err => {
            console.error("Verification error:", err);
          });
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <></>
  );
};

export default MyOrders;

import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProducDetail';
import CheckoutPage from './pages/CheckoutPage';
import MyOrders from './pages/MyOrders';
import OrderCheck from './pages/OrderCheck';
import ProductAdmin from './pages/ProductAdmin';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts';
import About from './pages/About';
import Mycourse from './pages/Mycourse';
import CourseAdmin from './pages/CourseAdmin';
import Courses from './pages/Courses';
// import EditProductForm from './pages/EditProductForm';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Product Routes */}
      <Route path="/products" element={<ProductPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout/:id/:types" element={<CheckoutPage />} />
      <Route path="/about" element={<About />} />

      {/* User Orders */}
      <Route path="/myorders" element={<MyOrders />} />
      <Route path="/ordercheck" element={<OrderCheck />} />

      {/* Admin Routes */}
      <Route path="/productadmin" element={<ProductAdmin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/adminproducts" element={<AdminProducts />} />
      <Route path="/mycourse" element={<Mycourse />} />

      <Route path="/courseadmin" element={<CourseAdmin />} />
      <Route path="/courses" element={<Courses />} />


      {/* <Route path="/product/:id/edit" element={<EditProductForm />} /> */}
    </Routes>
  );
}

export default App;

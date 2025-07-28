import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// ✅ Lazy-loaded pages
const Home = lazy(() => import('./pages/HomePage'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/LoginPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ProductDetail = lazy(() => import('./pages/ProducDetail'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderCheck = lazy(() => import('./pages/OrderCheck'));
const ProductAdmin = lazy(() => import('./pages/ProductAdmin'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const About = lazy(() => import('./pages/About'));
const Mycourse = lazy(() => import('./pages/Mycourse'));
const CourseAdmin = lazy(() => import('./pages/CourseAdmin'));
const Courses = lazy(() => import('./pages/Courses'));
// const EditProductForm = lazy(() => import('./pages/EditProductForm')); // Uncomment if needed

function App() {
  return (
    <Suspense fallback={<div className="text-center text-white mt-20">Loading...</div>}>
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

        {/* Optional Route */}
        {/* <Route path="/product/:id/edit" element={<EditProductForm />} /> */}
      </Routes>
    </Suspense>
  );
}

export default App;

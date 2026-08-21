import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { SiteContentProvider } from "./hooks/SiteContentContext";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/HomePage"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/LoginPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const ProductDetail = lazy(() => import("./pages/ProducDetail"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderCheck = lazy(() => import("./pages/OrderCheck"));
const ProductAdmin = lazy(() => import("./pages/admin/AddAdminProduct"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const About = lazy(() => import("./pages/About"));
// const Mycourse = lazy(() => import("./pages/Mycourse"));
const CourseAdmin = lazy(() => import("./pages/admin/CourseAdmin"));
// const Courses = lazy(() => import("./pages/Courses"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const CoursesPage = lazy(() => import('./pages/Course/Courses'));           // Grid of course cards
const CourseSalesPage = lazy(() => import('./pages/Course/CourseDetail'));  // Click karne par sales page
const CoursePlayer = lazy(() => import('./pages/Mycourse')); 
// const EditProductForm = lazy(() => import('./pages/EditProductForm')); // Uncomment if needed
const CourseContentManager = lazy(() => import('./pages/admin/CourseContentManager'));
const SiteContentAdmin = lazy(() => import('./pages/admin/SiteContentAdmin'));

const ManageOrders = lazy(() => import("./pages/admin/ManageOrders"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
// const Users = lazy(() => import("./pages/admin/Users"));
import GlowOrb from "./components/Effects/Gloworb";
function AppLoader() {
  return (
    <div className="fixed inset-0 bg-neutral-900 flex items-center justify-center z-[100]">
      {/* Ambient glow orbs — same as rest of the app */}
      <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
      <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />

      <div className="relative flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_10px_rgba(96,165,250,0.9)] animate-pulse" />
          <span className="text-xl font-extrabold tracking-tight text-white">
            ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span>
          </span>
        </div>

        <div className="w-8 h-8 border-[3px] border-white/10 border-t-blue-400 rounded-full animate-spin" />
      </div>
    </div>
  );
}

function App() {
  return (
    <SiteContentProvider>
      <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register/:product/:id/:types" element={<Register />} />
          <Route path="/login/:product/:id/:types" element={<Login />} />

          {/* Product Routes */}
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout/:id/:types" element={<CheckoutPage />} />
          <Route path="/about" element={<About />} />

          {/* User Orders */}
          <Route path="/myorders/:product/:id/:types" element={<MyOrders />} />
          <Route path="/ordercheck" element={<OrderCheck />} />

          {/* Admin Routes */}
          <Route path="/productadmin" element={<ProductAdmin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminproducts" element={<AdminProducts />} />
          <Route path="/courseadmin" element={<CourseAdmin />} />
          <Route path="/courseadmin/:courseId/content" element={<CourseContentManager />} />


          <Route path="/contact" element={<Contact />} />

          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseSalesPage />} />
          <Route path="/mycourse/:id" element={<CoursePlayer />} />


          <Route path="/sitecontent" element={<SiteContentAdmin />} />

          <Route path="/adminorders" element={<ManageOrders />} />
          <Route path="/adminusers" element={<ManageUsers />} />
          {/* Optional Route */}
          {/* <Route path="/admin/users" element={<Users />} /> */}
          {/* <Route path="/product/:id/edit" element={<EditProductForm />} /> */}

          {/* Catch-all — must stay last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SiteContentProvider>
  );
}

export default App;
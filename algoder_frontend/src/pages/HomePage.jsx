import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Navbar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import ProductBanner from '../components/product';
// import Test from '../components/Test';
import axios from "axios";
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerTestimonials from '../components/CustomerTestimonials';
import TrustIndicators from '../components/TrustIndicators';
import CallToActionBanner from '../components/CallToActionBanner';
import Footer from '../components/Footer';
const Home = () => {
    useEffect(() => {
    axios.get("http://localhost:8000/api/track-visit/")
      .then((res) => console.log("Visitor Tracked"))
      .catch((err) => console.error("Visitor tracking failed", err));
  }, []);
  // const [message, setMessage] = useState('');
  // const navigate = useNavigate();
  

  // useEffect(() => {
  //   const fetchProtected = async () => {
  //     try {
  //       const res = await API.get('protected/');
  //       setMessage(res.data.message);
  //     } catch (err) {
  //       console.error('Auth failed, redirecting to login:', err);
  //       localStorage.removeItem('access_token');
  //       localStorage.removeItem('refresh_token');
  //       // navigate('/');
  //     }
  //   };

  //   fetchProtected();
  // }, [navigate]);



  // const handleLogout = () => {
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('refresh_token');
  //   navigate('/');
  // };

  return (
    <div className='bg-[#1f2937]'>
      <Navbar />
      <HeroSection />
      <ProductBanner />
      <WhyChooseUs />
      <CustomerTestimonials />
      <CallToActionBanner />
      <TrustIndicators />
      <Footer />
      {/* <div>
        <h1 className="text-2xl text-white text-center mt-8">{message}</h1>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div> */}
    </div>
  );
};

export default Home;

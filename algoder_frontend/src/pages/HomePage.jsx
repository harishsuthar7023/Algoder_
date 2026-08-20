import { useEffect } from "react";
import API from "../utils/api";
import { useSiteContent } from "../hooks/useSiteContent";
import Navbar from "../components/NavBar";
import HeroSection from "../components/HomeSections/HeroSection";
import ProductBanner from "../components/HomeProduct";
import WhyChooseUs from "../components/HomeSections/WhyChooseUs";
import CustomerTestimonials from "../components/HomeSections/CustomerTestimonials";
import TrustIndicators from "../components/HomeSections/TrustIndicators";
import CallToActionBanner from "../components/HomeSections/CallToActionBanner";
import Footer from "../components/HomeSections/Footer";
import SiteUnavailable from "../components/SiteUnavailable";

const Home = () => {
  // useEffect(() => {
  //   API.get("/track-visit/")
  //     .then(() => console.log("Visitor Tracked"))
  //     .catch((err) => console.error("Visitor tracking failed", err));
  // }, []);

  const { content, loading, error } = useSiteContent();

  // Agar site-content API fail ho gaya, ya poori tarah khaali aaya
  const isEmpty = !loading && !error && Object.keys(content).length === 0;

  if (!loading && (error || isEmpty)) {
    return <SiteUnavailable />;
  }

  return (
    <div className="bg-[#1f2937]">
      <Navbar />
      <HeroSection />
      <ProductBanner />
      <WhyChooseUs />
      <CustomerTestimonials />
      <CallToActionBanner />
      <TrustIndicators />
      <Footer />
    </div>
  );
};

export default Home;
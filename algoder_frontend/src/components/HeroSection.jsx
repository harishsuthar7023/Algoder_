import { useRef } from "react";
import { motion } from "framer-motion";
import tradingImage from "../assets/images/Hero.png";
import heroContent from "../content/heroContent";

export default function HeroSection() {
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    imageRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <section className="bg-neutral-800 pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        
        {/* Left content */}
        <motion.div
          className="w-full md:w-[60%] md:ml-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight mb-6">
            {heroContent.heading.split(heroContent.highlight).map((part, i) => (
              <span key={i}>
                {part}
                {i < heroContent.heading.split(heroContent.highlight).length - 1 && (
                  <span className="text-blue-600">{heroContent.highlight}</span>
                )}
              </span>
            ))}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            {heroContent.subheading}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {heroContent.buttons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.action}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  btn.type === "primary"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border border-blue-600 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right content with image tilt */}
        <motion.div
          className="hidden md:flex w-full md:w-[30%] justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            ref={imageRef}
            className="w-[80%] h-auto transition-transform duration-300 ease-out"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={tradingImage}
              alt="Trading Strategy Visual"
              className="w-full h-full object-contain rounded-2xl shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

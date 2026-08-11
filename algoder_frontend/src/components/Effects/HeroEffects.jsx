// components/Effects/HeroEffects.jsx
import { useEffect } from "react";

const HeroEffects = () => {
  useEffect(() => {
    const heroSection = document.getElementById("hero-section");
    if (!heroSection) return;

    // 3D tilt effect — scoped to the chart card only
    const imageContainer = document.getElementById("imageContainer");
    const image3d = imageContainer?.querySelector(".image-3d");

    const handleMouseMove = (e) => {
      const rect = imageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      image3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      image3d.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    };

    if (imageContainer && image3d) {
      imageContainer.addEventListener("mousemove", handleMouseMove);
      imageContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    // Live portfolio value ticker — properly cleaned up on unmount
    let portfolioInterval;
    const startPortfolioTicker = () => {
      const element = document.getElementById("portfolioValue");
      if (!element) return;
      let value = 50000;
      portfolioInterval = setInterval(() => {
        value += Math.random() * 200 - 100;
        element.textContent = "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
      }, 1200);
    };
    const startTimeout = setTimeout(startPortfolioTicker, 800);

    // Ripple effect — scoped to buttons/links inside the hero section only
    const rippleTargets = heroSection.querySelectorAll("[data-ripple]");
    const handleRippleClick = (e) => {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.classList.add("hero-ripple");
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    rippleTargets.forEach((el) => el.addEventListener("click", handleRippleClick));

    const style = document.createElement("style");
    style.textContent = `
      .hero-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        transform: scale(0);
        animation: hero-ripple-anim 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes hero-ripple-anim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (imageContainer && image3d) {
        imageContainer.removeEventListener("mousemove", handleMouseMove);
        imageContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
      rippleTargets.forEach((el) => el.removeEventListener("click", handleRippleClick));
      clearTimeout(startTimeout);
      clearInterval(portfolioInterval);
      style.remove();
    };
  }, []);

  return null;
};

export default HeroEffects;
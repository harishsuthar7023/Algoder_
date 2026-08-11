import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import testimonialContent from "../../content/testimonialContent";

const getRandomTestimonials = (all, count = 3) => {
  const shuffled = [...all].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CustomerTestimonials = () => {
  const [visibleTestimonials, setVisibleTestimonials] = useState(() =>
    getRandomTestimonials(testimonialContent.testimonials)
  );
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setVisibleTestimonials(getRandomTestimonials(testimonialContent.testimonials));
        setFade(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-neutral-900 text-white pt-16 pb-20 md:pt-20 md:pb-24 px-4 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 mb-10 md:mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
          Trusted by traders
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 text-white">
          {testimonialContent.heading}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          {testimonialContent.subheading}
        </p>
      </div>

      {/* Testimonial Cards */}
      <div
        className={`relative grid md:grid-cols-3 gap-5 max-w-7xl mx-auto px-2 sm:px-4 transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {visibleTestimonials.map((review, idx) => (
          <div
            key={idx}
            className="group relative bg-white/[0.03] border border-white/10 p-6 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-blue-400/30 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300"
          >
            {/* top glass shine */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <Quote className="absolute top-5 right-5 w-8 h-8 text-white/5" />

            <div className="flex items-center gap-3 mb-4">
              <img
                src={review.image}
                alt={review.name}
                className="w-11 h-11 rounded-full object-cover border border-white/10"
              />
              <div>
                <h4 className="text-white font-semibold text-sm">
                  {review.name}
                </h4>
                <p className="text-neutral-500 text-xs">{review.role}</p>
              </div>
            </div>

            <div className="flex text-blue-400 mb-3 gap-0.5">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed">
              {review.message}
            </p>

            {/* subtle bottom glow on hover */}
            <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-16 bg-blue-400/0 group-hover:bg-blue-400/10 blur-2xl rounded-full transition-all duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
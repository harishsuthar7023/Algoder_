import React from "react";
import { Star } from "lucide-react";
import testimonialContent from "../content/testimonialContent";

const CustomerTestimonials = () => {
  return (
    <div className="bg-neutral-800 text-white pt-6 pb-10 px-4">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {testimonialContent.heading}
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          {testimonialContent.subheading}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {testimonialContent.testimonials.map((review, idx) => (
          <div
            key={idx}
            className="bg-[#303030] p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.image}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-600"
              />
              <div>
                <h4 className="text-white font-semibold text-base">
                  {review.name}
                </h4>
                <p className="text-gray-400 text-sm">{review.role}</p>
              </div>
            </div>

            <div className="flex text-yellow-400 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              “{review.message}”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;

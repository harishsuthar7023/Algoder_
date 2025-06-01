import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ravi Sharma",
    role: "Full-Stack Developer",
    image: "/avatars/avatar1.jpg",
    rating: 5,
    message:
      "The product quality is amazing! Performance is smooth and support is excellent. Highly recommended for professionals.",
  },
  {
    name: "Priya Mehta",
    role: "UI/UX Designer",
    image: "/avatars/avatar2.jpg",
    rating: 4,
    message:
      "Beautiful design and great customization options. It really helped me deliver my client's project on time!",
  },
  {
    name: "Amit Joshi",
    role: "Entrepreneur",
    image: "/avatars/avatar3.jpg",
    rating: 5,
    message:
      "Highly reliable and well-optimized. The team support is quick and friendly. Definitely worth the price.",
  },
];

const CustomerTestimonials = () => {
  return (
    <div className="bg-neutral-800 text-white pt-6 pb-10 px-4">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          What Our Customers Say
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          We value feedback and strive to provide the best experience.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {testimonials.map((review, idx) => (
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

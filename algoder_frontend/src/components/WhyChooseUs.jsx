import React from "react";
import { ShieldCheck, ThumbsUp, Zap, Users } from "lucide-react";

const features = [
  {
    title: "Reliable & Secure",
    description:
      "We prioritize security and reliability in everything we deliver. Your data and experience are in safe hands.",
    icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
  },
  {
    title: "Client Satisfaction",
    description:
      "We build long-term relationships through trust, quality service, and a strong support system.",
    icon: <ThumbsUp className="w-8 h-8 text-blue-400" />,
  },
  {
    title: "High Performance",
    description:
      "Our platform is optimized for performance and scalability so your business never slows down.",
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
  },
  {
    title: "Dedicated Support",
    description:
      "We provide 24/7 dedicated customer support to make sure you’re always backed by a real human.",
    icon: <Users className="w-8 h-8 text-purple-400" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-neutral-800 text-white py-6 px-4">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-gray-300 max-w-2xl mb-12">
          We’re committed to delivering unmatched quality and exceptional results.
          Discover what sets us apart from the competition.
        </p>

      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-7xl lg:grid-cols-4 gap-6 mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#303030] p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
      </div>
    </section>
  );
}

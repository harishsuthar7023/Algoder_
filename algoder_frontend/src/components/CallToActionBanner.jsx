import React from "react";
import { ArrowRight } from "lucide-react";

const CallToActionBanner = () => {
  return (
    <div className="bg-neutral-800 text-white ">
      <div className="max-w-7xl mx-auto flex flex-col py-16 px-10 rounded-4xl md:flex-row items-center justify-between gap-6 bg-[#303030]">
        {/* Text Section */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Ready to get started?
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            Upgrade your experience now and unlock the full power of our platform.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <a
            href="/buy-now"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-3 rounded-full transition duration-300"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallToActionBanner;

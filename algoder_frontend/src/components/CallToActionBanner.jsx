import React from "react";
import { ArrowRight } from "lucide-react";
import callToActionContent from "../content/callToActionContent";

const CallToActionBanner = () => {
  const { title, description, buttonLabel, phoneNumber, preFilledMessage } = callToActionContent;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(preFilledMessage)}`;

  return (
    <div className="bg-neutral-800 px-5 text-white">
      <div className="max-w-7xl mx-auto flex flex-col py-16 px-10 rounded-4xl md:flex-row items-center  justify-between gap-6 bg-[#303030]">
        {/* Text Section */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {title}
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            {description}
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-3 rounded-full transition duration-300"
          >
            {buttonLabel}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallToActionBanner;

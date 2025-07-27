// src/components/TrustIndicators.jsx
import React from "react";
import trustFeatures, { trustHeader } from "../content/trustFeatures";

const TrustIndicators = () => {
  return (
    <div className="bg-neutral-800 py-12 px-4 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 px-8 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          {trustHeader.title}
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
          {trustHeader.desc.split("Cashfree").map((part, index, arr) =>
            index < arr.length - 1 ? (
              <React.Fragment key={index}>
                {part}
                <span className="text-green-400 font-semibold">Cashfree</span>
              </React.Fragment>
            ) : (
              part
            )
          )}
        </p>
      </div>

      {/* Trust Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trustFeatures.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#303030] rounded-2xl p-6 shadow hover:shadow-lg transition duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <Icon className="w-6 h-6 text-green-400" />
                <h4 className="text-lg font-semibold">{item.title}</h4>
              </div>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustIndicators;

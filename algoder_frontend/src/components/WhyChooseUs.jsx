import React from "react";
import * as Icons from "lucide-react";
import whyChooseUsContent from "../content/whyChooseUsContent";

export default function WhyChooseUs() {
  return (
    <section className="bg-neutral-800 text-white py-6 px-4">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">{whyChooseUsContent.heading}</h2>
        <p className="text-gray-300 max-w-2xl mb-12">
          {whyChooseUsContent.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 max-w-7xl lg:grid-cols-4 gap-6 mx-auto">
        {whyChooseUsContent.features.map((feature, index) => {
          const IconComponent = Icons[feature.icon] || Icons.HelpCircle;

          return (
            <div
              key={index}
              className="bg-[#303030] p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">
                <IconComponent className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

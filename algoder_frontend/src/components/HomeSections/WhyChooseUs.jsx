import React from "react";
import * as Icons from "lucide-react";
import whyChooseUsContent from "../../content/whyChooseUsContent";

export default function WhyChooseUs() {
  return (
    <section className="relative bg-neutral-900 text-white py-16 md:py-20 px-4 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 mb-10 md:mb-14">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
          Why traders pick us
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 text-white">
          {whyChooseUsContent.heading}
        </h2>
        <p className="text-neutral-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          {whyChooseUsContent.subheading}
        </p>
      </div>

      {/* Feature Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto px-2 sm:px-4">
        {whyChooseUsContent.features.map((feature, index) => {
          const IconComponent = Icons[feature.icon] || Icons.HelpCircle;

          return (
            <div
              key={index}
              className="group relative bg-white/[0.03] border border-white/10 p-6 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-400/30 hover:-translate-y-1"
            >
              {/* top glass shine */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 ring-1 ring-blue-400/20 mb-5 transition-colors duration-300 group-hover:ring-blue-400/40">
                <IconComponent className={`w-6 h-6 ${feature.color}`} />
              </div>

              <h3 className="text-lg font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* subtle bottom glow on hover */}
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-16 bg-blue-400/0 group-hover:bg-blue-400/10 blur-2xl rounded-full transition-all duration-500" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
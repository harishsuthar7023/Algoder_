// src/components/TrustIndicators.jsx
import React from "react";
import trustFeatures, { trustHeader } from "../../content/trustFeatures";
import GlowOrb from "../Effects/Gloworb";
const TrustIndicators = () => {
  return (
    <div className="relative bg-neutral-900 py-5 md:py-5 px-4 text-white overflow-hidden">
      {/* Ambient glow orbs */}
      <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
      <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />

      {/* Header */}
      <div className="relative max-w-7xl mx-auto mb-10 md:mb-12 px-2 sm:px-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
          Trusted &amp; secure
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight text-white">
          {trustHeader.title}
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          {trustHeader.desc.split("Cashfree").map((part, index, arr) =>
            index < arr.length - 1 ? (
              <React.Fragment key={index}>
                {part}
                <span className="text-blue-400 font-semibold">Cashfree</span>
              </React.Fragment>
            ) : (
              part
            )
          )}
        </p>
      </div>

      {/* Trust Items */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {trustFeatures.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.06]"
            >
              {/* top glass shine */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="flex items-start gap-3.5 mb-3">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 ring-1 ring-blue-400/20 flex items-center justify-center transition-colors duration-300 group-hover:ring-blue-400/40">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-white pt-2 leading-snug">
                  {item.title}
                </h4>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* subtle bottom glow on hover */}
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-16 bg-blue-400/0 group-hover:bg-blue-400/10 blur-2xl rounded-full transition-all duration-500" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustIndicators;
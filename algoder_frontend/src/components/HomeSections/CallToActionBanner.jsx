import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import callToActionContent from "../../content/callToActionContent";

const CallToActionBanner = () => {
  const { title, description, buttonLabel, phoneNumber, preFilledMessage } = callToActionContent;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(preFilledMessage)}`;

  return (
    <div className="bg-neutral-900 px-4 py-6">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-12 md:px-14">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">
              {title}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-xl">
              {description}
            </p>
          </div>

          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 text-sm font-semibold px-7 py-3.5 rounded-full transition-all duration-300 shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            {buttonLabel}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallToActionBanner;
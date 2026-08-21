import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Code2, Target, Zap } from "lucide-react";

import Navbar from "../components/NavBar";
import Footer from "../components/HomeSections/Footer";
// import aboutContent from "../content/aboutContent";
import { useSiteContent } from "../hooks/SiteContentContext";
import GlowOrb from "../components/Effects/Gloworb";
const About = () => {
  
  const navigate = useNavigate();
  
  const handleCTA = () => {
    navigate(aboutContent?.callToAction?.buttonLink);
  };
  
  const { content, loading } = useSiteContent();
  const aboutContent = content.about_header || {};
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
          Loading...
        </div>
      </>
    );
  }

  // agar loading complete ho gaya lekin data hi missing hai
  if (!aboutContent.aboutHeader) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
          Content not available.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-neutral-900 text-white min-h-screen overflow-x-hidden">

        {/* =====================================================
            HERO SECTION
        ===================================================== */}
        <section className="relative pt-40 pb-24 px-4 overflow-hidden">

          {/* Background Glow */}
          <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
          <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />

          <div className="relative max-w-4xl mx-auto text-center">

            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />

              About ALGODER
            </span>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {aboutContent.aboutHeader.title}
              </span>
            </h1>

            {/* Description */}
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-9">
              {aboutContent.aboutHeader.description}
            </p>

            {/* CTA */}
            <button
              onClick={handleCTA}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 px-7 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:-translate-y-0.5"
            >
              {aboutContent.callToAction.buttonText}

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </section>


        {/* =====================================================
            SOLUTIONS / TECHNICAL EXPERTISE
        ===================================================== */}
        <section className="relative py-16 md:py-20 px-4 overflow-hidden">

          {/* Glow */}
          <div className="pointer-events-none absolute top-1/3 left-0 w-96 h-96 bg-blue-500/[0.05] rounded-full blur-[120px]" />

          <div className="relative max-w-6xl mx-auto">

            {/* Section Heading */}
            <div className="text-center mb-12 md:mb-16">

              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />

                Our Expertise
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Built for modern algorithmic trading
              </h2>

              <p className="mt-4 max-w-2xl mx-auto text-neutral-400 text-sm sm:text-base">
                From strategy development to real-time execution, ALGODER
                focuses on building reliable and scalable trading systems.
              </p>

            </div>


            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-6">

              {aboutContent.toolFeatures.map((section, index) => (

                <div
                  key={index}
                  className="group relative bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-400/30 hover:-translate-y-1 overflow-hidden"
                >

                  {/* Top Line */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />


                  {/* Icon */}
                  <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center">

                    {index === 0 ? (
                      <Zap className="w-6 h-6 text-cyan-300" />
                    ) : (
                      <Code2 className="w-6 h-6 text-blue-300" />
                    )}

                  </div>


                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    {section.title}
                  </h3>


                  {/* Intro */}
                  {section.intro && (
                    <p className="text-neutral-400 text-sm leading-relaxed mb-5">
                      {section.intro}
                    </p>
                  )}


                  {/* Points */}
                  <div className="space-y-3">

                    {section.points.map((point, pointIndex) => (

                      <div
                        key={pointIndex}
                        className="flex items-start gap-3"
                      >

                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-cyan-300" />

                        <span className="text-neutral-300 text-sm leading-relaxed">
                          {point}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          </div>
        </section>


        {/* =====================================================
            MISSION SECTION
        ===================================================== */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">

          {/* Background Glow */}
          <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />

          <div className="relative max-w-6xl mx-auto">

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

              {/* Left Content */}
              <div>

                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">

                  <Target className="w-3.5 h-3.5 text-cyan-300" />

                  Our Mission

                </span>


                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 tracking-tight text-white">
                  {aboutContent.mission.title}
                </h2>


                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  {aboutContent.mission.description}
                </p>

              </div>


              {/* Right Visual */}
              <div className="relative">

                <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 overflow-hidden">

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />


                  <div className="grid grid-cols-2 gap-4">

                    {/* Card 1 */}
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/5 border border-white/10 flex flex-col items-center justify-center p-4 text-center">

                      <Zap className="w-7 h-7 text-cyan-300 mb-3" />

                      <span className="text-sm font-semibold text-white">
                        Fast Execution
                      </span>

                    </div>


                    {/* Card 2 */}
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/5 border border-white/10 flex flex-col items-center justify-center p-4 text-center">

                      <Code2 className="w-7 h-7 text-blue-300 mb-3" />

                      <span className="text-sm font-semibold text-white">
                        Smart Systems
                      </span>

                    </div>


                    {/* Card 3 */}
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/5 border border-white/10 flex flex-col items-center justify-center p-4 text-center">

                      <Target className="w-7 h-7 text-cyan-300 mb-3" />

                      <span className="text-sm font-semibold text-white">
                        Precision
                      </span>

                    </div>


                    {/* Card 4 */}
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/5 border border-white/10 flex flex-col items-center justify-center p-4 text-center">

                      <CheckCircle2 className="w-7 h-7 text-blue-300 mb-3" />

                      <span className="text-sm font-semibold text-white">
                        Reliability
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            WHY CHOOSE ALGODER
        ===================================================== */}
        <section className="py-16 md:py-24 px-4">

          <div className="max-w-5xl mx-auto">

            {/* Heading */}
            <div className="text-center mb-12 md:mb-16">

              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">

                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />

                Why ALGODER

              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                {aboutContent.reasonsToChoose.title}
              </h2>

            </div>


            {/* Reasons */}
            <div className="grid sm:grid-cols-2 gap-4">

              {aboutContent.reasonsToChoose.points.map(
                (point, index) => (

                  <div
                    key={index}
                    className="group flex items-start gap-4 bg-white/[0.03] border border-white/10 p-5 sm:p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-400/30 hover:-translate-y-1"
                  >

                    <div className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center">

                      <CheckCircle2 className="w-4 h-4 text-cyan-300" />

                    </div>

                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                      {point}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>
        </section>


        {/* =====================================================
            CTA SECTION
        ===================================================== */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden">

          {/* Glows */}
          <div className="pointer-events-none absolute top-0 left-1/3 w-96 h-96 bg-blue-500/[0.08] rounded-full blur-[120px]" />

          <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />


          <div className="relative max-w-4xl mx-auto text-center">

            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center">

              <Zap className="w-7 h-7 text-cyan-300" />

            </div>


            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-5 text-white">
              {aboutContent.callToAction.title}
            </h2>


            <p className="text-neutral-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              {aboutContent.callToAction.subtitle}
            </p>


            <button
              onClick={handleCTA}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:-translate-y-0.5"
            >
              {aboutContent.callToAction.buttonText}

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default About;
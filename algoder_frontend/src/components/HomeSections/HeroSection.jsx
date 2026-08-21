import { useSiteContent } from "../../hooks/SiteContentContext";
import HeroEffects from "../Effects/HeroEffects";
import GlowOrb from "../Effects/GlowOrb";
// import GlowOrb from "../components/Effects/Gloworb";

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.005c5.46 0 9.9-4.45 9.9-9.91C21.93 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.6.83 2.06.9 2.21.07.15.12.33.02.53-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.6 2.01 1.11 1 2.04 1.31 2.33 1.46.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.62.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
  </svg>
);

const HeroSection = () => {
  const { content, loading } = useSiteContent();
  const heroContent = content.hero || {};

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-neutral-900 text-white">
        Loading...
      </section>
    );
  }

  if (!heroContent.heading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-neutral-900 text-white">
        Content not available.
      </section>
    );
  }

  const { heading, highlight, subheading, buttons = [] } = heroContent;

  // "Empower Your Trading with ALGODER" -> pehla part normal, highlight part gradient
  const headingParts = highlight
    ? heading.split(highlight)
    : [heading];

  return (
    <>
      <HeroEffects />
      <section
        id="hero-section"
        className="relative bg-neutral-900 min-h-full pt-20 md:pt-28 pb-5 overflow-hidden"
      >
        {/* Ambient glow orbs */}
        <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
        <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />

        {/* Faint grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 relative z-10">
          {/* Left content */}
          <div className="w-full md:w-[60%] md:ml-10">
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-60 animate-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                </span>
                Advanced Trading Tool
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              {headingParts[0]}
              {highlight && (
                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {highlight}
                </span>
              )}
              {headingParts[1]}
            </h1>

            <p className="text-neutral-400 text-lg md:text-xl mb-9 leading-relaxed max-w-2xl">
              {subheading}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {buttons.map((btn, index) => {
                const isPrimary = btn.type === "primary";
                const isExternal = btn.action?.type === "external";
                const isWhatsApp = btn.action?.url?.includes("wa.me");

                return (
                  <a
                    key={index}
                    href={btn.action?.url}
                    target={btn.action?.target || (isExternal ? "_blank" : undefined)}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    data-ripple
                    className={
                      isPrimary
                        ? "relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_32px_rgba(34,211,238,0.55)] hover:-translate-y-0.5 active:translate-y-0"
                        : "relative overflow-hidden inline-flex items-center justify-center px-8 py-4 border border-white/15 bg-white/[0.03] backdrop-blur-xl text-neutral-200 hover:bg-white/5 hover:border-white/25 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
                    }
                  >
                    {isWhatsApp && <WhatsAppIcon />}
                    {btn.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right content — trading chart card (static, content se related nahi) */}
          <div className="w-full hidden md:flex md:w-[40%]">
            <div className="p-6 pt-5" id="imageContainer">
              <div className="image-3d relative transition-transform duration-200 ease-out">
                <div className="relative backdrop-saturate-150 rounded-2xl p-6    overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent " />

                  {/* <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-bold text-lg">NSE/BSE</h3>
                      <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                        +2.45%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-xl">₹67,234.50</div>
                      <div className="text-emerald-400 text-sm">+₹1,623.45</div>
                    </div>
                  </div> */}

                  <svg width="100%" height="400" viewBox="0 0 400 200" className="mb-4">
                    {/* <defs>
                      <linearGradient id="chartBg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#1e293b", stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: "#0f172a", stopOpacity: 0.1 }} />
                      </linearGradient>
                      <linearGradient id="volumeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#22d3ee", stopOpacity: 0.7 }} />
                        <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 0.15 }} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs> */}

                    {/* <rect width="400" height="200" fill="url(#chartBg)" rx="10" /> */}

                    {/* <g stroke="#ffffff" strokeWidth="0.5" opacity="0.06">
                      <line x1="40" y1="40" x2="360" y2="40" />
                      <line x1="40" y1="70" x2="360" y2="70" />
                      <line x1="40" y1="100" x2="360" y2="100" />
                      <line x1="40" y1="130" x2="360" y2="130" />
                      <line x1="40" y1="160" x2="360" y2="160" />
                      <line x1="80" y1="20" x2="80" y2="160" />
                      <line x1="120" y1="20" x2="120" y2="160" />
                      <line x1="160" y1="20" x2="160" y2="160" />
                      <line x1="200" y1="20" x2="200" y2="160" />
                      <line x1="240" y1="20" x2="240" y2="160" />
                      <line x1="280" y1="20" x2="280" y2="160" />
                      <line x1="320" y1="20" x2="320" y2="160" />
                    </g> */}

                    <g transform="translate(0, -150) scale(1, 2.5)">
                      <g id="candlesticks">
                        <line x1="20.0" y1="172.1" x2="20.0" y2="157.2" stroke="#f87171" strokeWidth="1" />
                        <rect x="17.0" y="161.5" width="6.1" height="3.5" fill="#f87171" rx="1" />
                        <line x1="31.1" y1="169.9" x2="31.1" y2="155.6" stroke="#34d399" strokeWidth="1" />
                        <rect x="28.0" y="161.2" width="6.1" height="3.8" fill="#34d399" rx="1" />
                        <line x1="42.1" y1="166.9" x2="42.1" y2="147.4" stroke="#34d399" strokeWidth="1" />
                        <rect x="39.1" y="153.9" width="6.1" height="7.3" fill="#34d399" rx="1" />
                        <line x1="53.2" y1="161.7" x2="53.2" y2="145.8" stroke="#34d399" strokeWidth="1" />
                        <rect x="50.1" y="150.6" width="6.1" height="3.3" fill="#34d399" rx="1" />
                        <line x1="64.2" y1="155.1" x2="64.2" y2="136.9" stroke="#34d399" strokeWidth="1" />
                        <rect x="61.2" y="144.1" width="6.1" height="6.5" fill="#34d399" rx="1" />
                        <line x1="75.3" y1="150.3" x2="75.3" y2="132.4" stroke="#34d399" strokeWidth="1" />
                        <rect x="72.3" y="138.8" width="6.1" height="5.3" fill="#34d399" rx="1" />
                        <line x1="86.4" y1="146.2" x2="86.4" y2="127.4" stroke="#34d399" strokeWidth="1" />
                        <rect x="83.3" y="135.6" width="6.1" height="3.2" fill="#34d399" rx="1" />
                        <line x1="97.4" y1="144.5" x2="97.4" y2="124.6" stroke="#34d399" strokeWidth="1" />
                        <rect x="94.4" y="129.3" width="6.1" height="6.3" fill="#34d399" rx="1" />
                        <line x1="108.5" y1="141.6" x2="108.5" y2="125.6" stroke="#f87171" strokeWidth="1" />
                        <rect x="105.4" y="129.3" width="6.1" height="6.7" fill="#f87171" rx="1" />
                        <line x1="119.5" y1="144.5" x2="119.5" y2="128.5" stroke="#f87171" strokeWidth="1" />
                        <rect x="116.5" y="136.1" width="6.1" height="4.5" fill="#f87171" rx="1" />
                        <line x1="130.6" y1="150.4" x2="130.6" y2="134.7" stroke="#f87171" strokeWidth="1" />
                        <rect x="127.6" y="140.6" width="6.1" height="6.6" fill="#f87171" rx="1" />
                        <line x1="141.7" y1="161.2" x2="141.7" y2="140.1" stroke="#f87171" strokeWidth="1" />
                        <rect x="138.6" y="147.1" width="6.1" height="6.4" fill="#f87171" rx="1" />
                        <line x1="152.7" y1="166.4" x2="152.7" y2="147.1" stroke="#f87171" strokeWidth="1" />
                        <rect x="149.7" y="153.6" width="6.1" height="4.6" fill="#f87171" rx="1" />
                        <line x1="163.8" y1="165.3" x2="163.8" y2="143.4" stroke="#34d399" strokeWidth="1" />
                        <rect x="160.7" y="148.3" width="6.1" height="9.9" fill="#34d399" rx="1" />
                        <line x1="174.8" y1="154.7" x2="174.8" y2="136.7" stroke="#34d399" strokeWidth="1" />
                        <rect x="171.8" y="143.2" width="6.1" height="5.0" fill="#34d399" rx="1" />
                        <line x1="185.9" y1="151.3" x2="185.9" y2="131.8" stroke="#34d399" strokeWidth="1" />
                        <rect x="182.9" y="137.5" width="6.1" height="5.7" fill="#34d399" rx="1" />
                        <line x1="197.0" y1="143.4" x2="197.0" y2="120.3" stroke="#34d399" strokeWidth="1" />
                        <rect x="193.9" y="129.0" width="6.1" height="8.5" fill="#34d399" rx="1" />
                        <line x1="208.0" y1="132.4" x2="208.0" y2="111.3" stroke="#34d399" strokeWidth="1" />
                        <rect x="205.0" y="118.3" width="6.1" height="10.7" fill="#34d399" rx="1" />
                        <line x1="219.1" y1="125.2" x2="219.1" y2="102.9" stroke="#34d399" strokeWidth="1" />
                        <rect x="216.0" y="110.1" width="6.1" height="8.2" fill="#34d399" rx="1" />
                        <line x1="230.2" y1="118.0" x2="230.2" y2="94.2" stroke="#34d399" strokeWidth="1" />
                        <rect x="227.1" y="103.2" width="6.1" height="6.9" fill="#34d399" rx="1" />
                        <line x1="241.2" y1="108.5" x2="241.2" y2="87.5" stroke="#34d399" strokeWidth="1" />
                        <rect x="238.2" y="92.2" width="6.1" height="10.9" fill="#34d399" rx="1" />
                        <line x1="252.3" y1="95.4" x2="252.3" y2="80.8" stroke="#34d399" strokeWidth="1" />
                        <rect x="249.2" y="87.8" width="6.1" height="4.5" fill="#34d399" rx="1" />
                        <line x1="263.3" y1="91.8" x2="263.3" y2="71.9" stroke="#34d399" strokeWidth="1" />
                        <rect x="260.3" y="77.6" width="6.1" height="10.1" fill="#34d399" rx="1" />
                        <line x1="274.4" y1="84.0" x2="274.4" y2="73.9" stroke="#f87171" strokeWidth="1" />
                        <rect x="271.4" y="77.6" width="6.1" height="3.0" fill="#f87171" rx="1" />
                        <line x1="285.5" y1="87.9" x2="285.5" y2="73.0" stroke="#f87171" strokeWidth="1" />
                        <rect x="282.4" y="80.6" width="6.1" height="3.6" fill="#f87171" rx="1" />
                        <line x1="296.5" y1="93.2" x2="296.5" y2="79.7" stroke="#f87171" strokeWidth="1" />
                        <rect x="293.5" y="84.2" width="6.1" height="3.7" fill="#f87171" rx="1" />
                        <line x1="307.6" y1="94.2" x2="307.6" y2="79.6" stroke="#f87171" strokeWidth="1" />
                        <rect x="304.5" y="87.8" width="6.1" height="3.0" fill="#f87171" rx="1" />
                        <line x1="318.6" y1="97.8" x2="318.6" y2="85.0" stroke="#f87171" strokeWidth="1" />
                        <rect x="315.6" y="90.7" width="6.1" height="3.0" fill="#f87171" rx="1" />
                        <line x1="329.7" y1="99.4" x2="329.7" y2="74.7" stroke="#34d399" strokeWidth="1" />
                        <rect x="326.7" y="83.0" width="6.1" height="8.4" fill="#34d399" rx="1" />
                        <line x1="340.8" y1="87.7" x2="340.8" y2="63.1" stroke="#34d399" strokeWidth="1" />
                        <rect x="337.7" y="71.3" width="6.1" height="11.8" fill="#34d399" rx="1" />
                        <line x1="351.8" y1="76.4" x2="351.8" y2="53.5" stroke="#34d399" strokeWidth="1" />
                        <rect x="348.8" y="59.0" width="6.1" height="12.3" fill="#34d399" rx="1" />
                        <line x1="362.9" y1="67.7" x2="362.9" y2="40.7" stroke="#34d399" strokeWidth="1" />
                        <rect x="359.8" y="49.0" width="6.1" height="10.0" fill="#34d399" rx="1" />
                        <line x1="373.9" y1="53.0" x2="373.9" y2="33.6" stroke="#34d399" strokeWidth="1" />
                        <rect x="370.9" y="37.5" width="6.1" height="11.5" fill="#34d399" rx="1" />
                        <line x1="385.0" y1="41.9" x2="385.0" y2="25.6" stroke="#34d399" strokeWidth="1" />
                        <rect x="382.0" y="30.0" width="6.1" height="7.5" fill="#34d399" rx="1" />
                      </g>

                      <path
                        d="M20.0,165.0 L31.1,161.2 L42.1,153.9 L53.2,150.6 L64.2,144.1 L75.3,138.8 L86.4,135.6 L97.4,129.3 L108.5,136.1 L119.5,140.6 L130.6,147.1 L141.7,153.6 L152.7,158.2 L163.8,148.3 L174.8,143.2 L185.9,137.5 L197.0,129.0 L208.0,118.3 L219.1,110.1 L230.2,103.2 L241.2,92.2 L252.3,87.8 L263.3,77.6 L274.4,80.6 L285.5,84.2 L296.5,87.8 L307.6,90.7 L318.6,91.5 L329.7,83.0 L340.8,71.3 L351.8,59.0 L362.9,49.0 L373.9,37.5 L385.0,30.0"
                        stroke="#22d3ee"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.9"
                        filter="url(#glow)"
                      >
                        <animate attributeName="stroke-dasharray" values="0,600;600,0" dur="4s" repeatCount="indefinite" />
                      </path>
                    </g>


                    {/* <g fill="#71717a" fontSize="10" fontFamily="monospace">
                      <text x="10" y="45" textAnchor="middle">68K</text>
                      <text x="10" y="75" textAnchor="middle">67K</text>
                      <text x="10" y="105" textAnchor="middle">66K</text>
                      <text x="10" y="135" textAnchor="middle">65K</text>
                      <text x="10" y="165" textAnchor="middle">64K</text>
                    </g> */}

                    {/* <g fill="#71717a" fontSize="9" fontFamily="monospace">
                      <text x="80" y="185" textAnchor="middle">09:00</text>
                      <text x="160" y="185" textAnchor="middle">12:00</text>
                      <text x="240" y="185" textAnchor="middle">15:00</text>
                      <text x="320" y="185" textAnchor="middle">18:00</text>
                    </g> */}
                  </svg>

                  {/* <div className="mb-4">
                    <svg width="100%" height="60" viewBox="0 0 400 60">
                      <g id="volumeBars">
                        <rect x="76" y="35" width="8" height="20" fill="url(#volumeGradient)" rx="2" />
                        <rect x="116" y="25" width="8" height="30" fill="url(#volumeGradient)" rx="2" />
                        <rect x="156" y="20" width="8" height="35" fill="url(#volumeGradient)" rx="2" />
                        <rect x="196" y="15" width="8" height="40" fill="url(#volumeGradient)" rx="2" />
                        <rect x="236" y="30" width="8" height="25" fill="url(#volumeGradient)" rx="2" />
                        <rect x="276" y="10" width="8" height="45" fill="url(#volumeGradient)" rx="2" />
                        <rect x="316" y="18" width="8" height="37" fill="url(#volumeGradient)" rx="2" />
                      </g>
                    </svg>
                  </div> */}

                  {/* <div className="grid grid-cols-3 gap-4 text-sm border-t border-white/10 pt-4">
                    <div className="text-center">
                      <div className="text-neutral-500 text-xs mb-0.5">RSI</div>
                      <div className="text-cyan-300 font-bold">72.4</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neutral-500 text-xs mb-0.5">MACD</div>
                      <div className="text-cyan-300 font-bold">+0.23</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neutral-500 text-xs mb-0.5">Vol</div>
                      <div className="text-neutral-300 font-bold">2.4M</div>
                    </div>
                  </div> */}
                </div>

                {/* <div className="absolute bottom-4 left-6 bg-neutral-900/80 backdrop-blur-xl border border-white/10 text-white px-4 py-2.5 rounded-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wide">Portfolio</div>
                  <div
                    className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                    id="portfolioValue"
                  >
                    ₹50,567
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
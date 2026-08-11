import heroContent from "../../content/heroContent";
import HeroEffects from "../Effects/HeroEffects";

const HeroSection = () => {
  return (
    <>
      <HeroEffects />
      <section
        id="hero-section"
        className="relative bg-neutral-900 min-h-full pt-28 pb-16 overflow-hidden"
      >
        {/* Ambient glow orbs — same as rest of the site */}
        <div className="pointer-events-none absolute top-10 left-0 w-96 h-96 bg-blue-500/[0.08] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-cyan-400/[0.07] rounded-full blur-[130px]" />

        {/* Faint grid texture — hero's own signature detail */}
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
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-sm font-medium border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-60 animate-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                </span>
                Advanced Trading Tool
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Empower your trading with{" "}
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                ALGODER
              </span>
            </h1>

            <p className="text-neutral-400 text-lg md:text-xl mb-9 leading-relaxed max-w-2xl">
              Unlock professional trading strategies with our AI-powered platform.
              Experience real-time analytics, automated signals, and risk management tools
              designed for both beginners and experts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/6376076985"
                target="_blank"
                rel="noopener noreferrer"
                data-ripple
                className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_32px_rgba(34,211,238,0.55)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.005c5.46 0 9.9-4.45 9.9-9.91C21.93 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.6.83 2.06.9 2.21.07.15.12.33.02.53-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.6 2.01 1.11 1 2.04 1.31 2.33 1.46.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.62.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
                </svg>
                Chat on WhatsApp
              </a>

              <a
                href="/#/contact"
                data-ripple
                className="relative overflow-hidden inline-flex items-center justify-center px-8 py-4 border border-white/15 bg-white/[0.03] backdrop-blur-xl text-neutral-200 hover:bg-white/5 hover:border-white/25 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact us
              </a>
            </div>
          </div>

          {/* Right content — trading chart card */}
          <div className="w-full hidden md:flex md:w-[40%]">
            <div className="p-6 pt-5" id="imageContainer">
              <div className="image-3d relative transition-transform duration-200 ease-out">
                <div className="relative bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150 rounded-2xl p-6 shadow-[0_20px_60px_-16px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                  <div className="flex justify-between items-center mb-4">
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
                  </div>

                  <svg width="100%" height="200" viewBox="0 0 400 200" className="mb-4">
                    <defs>
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
                    </defs>

                    <rect width="400" height="200" fill="url(#chartBg)" rx="10" />

                    <g stroke="#ffffff" strokeWidth="0.5" opacity="0.06">
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
                    </g>

                    <g id="candlesticks">
                      <line x1="80" y1="120" x2="80" y2="90" stroke="#34d399" strokeWidth="1" />
                      <rect x="76" y="100" width="8" height="15" fill="#34d399" rx="1" />
                      <line x1="120" y1="85" x2="120" y2="125" stroke="#f87171" strokeWidth="1" />
                      <rect x="116" y="95" width="8" height="20" fill="#f87171" rx="1" />
                      <line x1="160" y1="110" x2="160" y2="75" stroke="#34d399" strokeWidth="1" />
                      <rect x="156" y="85" width="8" height="20" fill="#34d399" rx="1" />
                      <line x1="200" y1="95" x2="200" y2="65" stroke="#34d399" strokeWidth="1" />
                      <rect x="196" y="70" width="8" height="18" fill="#34d399" rx="1" />
                      <line x1="240" y1="60" x2="240" y2="85" stroke="#f87171" strokeWidth="1" />
                      <rect x="236" y="65" width="8" height="15" fill="#f87171" rx="1" />
                      <line x1="280" y1="75" x2="280" y2="45" stroke="#34d399" strokeWidth="1" />
                      <rect x="276" y="50" width="8" height="20" fill="#34d399" rx="1" />
                      <line x1="320" y1="65" x2="320" y2="35" stroke="#34d399" strokeWidth="1" />
                      <rect x="316" y="40" width="8" height="20" fill="#34d399" rx="1" />
                    </g>

                    <path
                      d="M80,110 L120,105 L160,95 L200,80 L240,72 L280,60 L320,50"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.9"
                      filter="url(#glow)"
                    >
                      <animate attributeName="stroke-dasharray" values="0,300;300,0" dur="4s" repeatCount="indefinite" />
                    </path>

                    <g fill="#71717a" fontSize="10" fontFamily="monospace">
                      <text x="10" y="45" textAnchor="middle">68K</text>
                      <text x="10" y="75" textAnchor="middle">67K</text>
                      <text x="10" y="105" textAnchor="middle">66K</text>
                      <text x="10" y="135" textAnchor="middle">65K</text>
                      <text x="10" y="165" textAnchor="middle">64K</text>
                    </g>

                    <g fill="#71717a" fontSize="9" fontFamily="monospace">
                      <text x="80" y="185" textAnchor="middle">09:00</text>
                      <text x="160" y="185" textAnchor="middle">12:00</text>
                      <text x="240" y="185" textAnchor="middle">15:00</text>
                      <text x="320" y="185" textAnchor="middle">18:00</text>
                    </g>
                  </svg>

                  <div className="mb-4">
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
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm border-t border-white/10 pt-4">
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
                  </div>
                </div>

                <div className="absolute bottom-4 left-6 bg-neutral-900/80 backdrop-blur-xl border border-white/10 text-white px-4 py-2.5 rounded-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wide">Portfolio</div>
                  <div
                    className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                    id="portfolioValue"
                  >
                    ₹50,567
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
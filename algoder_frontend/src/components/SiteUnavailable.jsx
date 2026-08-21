import { MessageCircle, AlertTriangle } from "lucide-react";
import GlowOrb from "../components/Effects/Gloworb";
const SiteUnavailable = () => {
  const phoneNumber = "916376076985"; // apna actual WhatsApp number yahan daalein
  const message = "Hi, I visited your website but it seems some content isn't loading. Can you help?";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="relative min-h-screen bg-neutral-900 flex items-center justify-center px-5 overflow-hidden">
      <GlowOrb color="59,130,246" opacity={0.07} size={884} className="top-1/4 left-1/40" />
      <GlowOrb color="34,211,238" opacity={0.07} size={884} className="top-1/40 left-1/2" />

      <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
          <span className="text-lg font-extrabold tracking-tight text-white">
            ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span>
          </span>
        </div>

        <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">Something's not right</h2>
        <p className="text-neutral-400 text-sm mb-6">
          Sorry for the inconvenience. If you have an inquiry, message us on WhatsApp now.
        </p>
        <a
        
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold py-2.5 rounded-lg transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp now
        </a>
      </div>
    </div>
  );
};

export default SiteUnavailable;
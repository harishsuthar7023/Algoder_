// src/data/trustFeatures.js
import {
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle,
  Fingerprint,
} from "lucide-react";

// Header content (easily editable)
export const trustHeader = {
  title: "Trusted by Algo Traders Across India",
  desc: `At ALGODER, we prioritize your privacy, payments, and product delivery with top-tier security and transparency.`,
};

// Trust cards content
const trustFeatures = [
  {
    icon: Lock,
    title: "Secure Checkout with Cashfree",
    desc: "We use Cashfree’s trusted gateway and 256-bit SSL to keep your transactions safe.",
  },
  {
    icon: CheckCircle,
    title: "Verified Customer Base",
    desc: "1000+ real traders and developers rely on our tools every month.",
  },
  {
    icon: ShieldCheck,
    title: "Purchase Protection",
    desc: "We offer reliable support in case of download issues or payment disputes.",
  },
  {
    icon: Truck,
    title: "Instant Download Access",
    desc: "Receive your ZIP file and license instantly after payment — no waiting!",
  },
  {
    icon: Fingerprint,
    title: "Privacy-First Policy",
    desc: "We never share your personal data. Everything is fully encrypted and private.",
  },
];

export default trustFeatures;

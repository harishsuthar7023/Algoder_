import React from "react";
import {
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle,
  Fingerprint,
} from "lucide-react";

const trustFeatures = [
  {
    icon: <Lock className="w-6 h-6 text-green-400" />,
    title: "Secure Payments",
    desc: "Your payment is processed securely through Cashfree with 256-bit SSL encryption.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-green-400" />,
    title: "Trusted by 1000+ Customers",
    desc: "Join a growing community of happy and satisfied buyers across India.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
    title: "Buyer Protection",
    desc: "We ensure every transaction is protected with refund & dispute support.",
  },
  {
    icon: <Truck className="w-6 h-6 text-green-400" />,
    title: "Fast Digital Delivery",
    desc: "Your product is delivered instantly via email/download after payment.",
  },
  {
    icon: <Fingerprint className="w-6 h-6 text-green-400" />,
    title: "SSL Encryption",
    desc: "All personal data is encrypted and never shared with third parties.",
  },
];

const TrustIndicators = () => {
  return (
    <div className="bg-neutral-800 py-12 px-4 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 px-8 sm:px-6 ">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Your Trust, Our Priority
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl ">
          We use industry-leading security standards powered by{" "}
          <span className="text-green-400 font-semibold">Cashfree</span> to keep your data and transactions safe.
        </p>
      </div>

      {/* Trust Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trustFeatures.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#303030] rounded-2xl p-6 shadow hover:shadow-lg transition duration-300"
          >
            <div className="flex items-start gap-3 mb-3">
              <div>{item.icon}</div>
              <h4 className="text-lg font-semibold">{item.title}</h4>
            </div>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustIndicators;

import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/HomeSections/Footer";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Phone, Mail, MapPin, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

const faqs = [
  {
    q: "How do I get started with trading?",
    a: "Getting started is easy — create an account, verify your details, fund your wallet, and begin trading. We provide tutorials and demo accounts to help you along the way.",
  },
  {
    q: "What are your trading fees?",
    a: "We charge a small commission with no hidden fees. Premium accounts enjoy reduced fees — contact us for the full breakdown.",
  },
  {
    q: "Is my money safe with ALGODER?",
    a: "Yes. We use bank-level encryption, two-factor authentication, and segregated client accounts to keep your funds secure.",
  },
  {
    q: "Do you offer customer support?",
    a: "Yes — we provide support via live chat, email, and phone. Our team is ready to help whenever you need it.",
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, subject, message } = formData;
    if (!firstName || !lastName || !email || !subject || !message) {
      setError(true);
      setSuccess(false);
      return;
    }
    setError(false);
    setSuccess(true);
    // Submit formData to backend here
  };

  const contactCards = [
    {
      icon: Phone,
      title: "Call us",
      desc: "Speak directly with our support team",
      detail: "+91 6376076985",
      note: "Mon–Fri, 9AM–6PM IST",
    },
    {
      icon: Mail,
      title: "Email us",
      desc: "Send us a detailed message",
      detail: "algoder09@gmail.com",
      note: "Response within 24 hours",
    },
    {
      icon: MapPin,
      title: "Address",
      desc: "Visit or write to us here",
      detail: "Nathdwara, Rajsamand, Rajasthan 313301",
      note: "",
    },
  ];

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.07] transition-colors";

  return (
    <>
      <Navbar />

      {/* Header */}
      <header className="relative bg-neutral-900 pt-32 pb-16 md:pt-40 md:pb-20 px-4 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/3 w-96 h-96 bg-blue-500/[0.08] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.07] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
            ALGODER — Professional trading platform
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5">
            Get in touch
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about our trading platform? Need support with your account?
            Our team is here to help you succeed in your trading journey.
          </p>
        </div>
      </header>

      {/* Contact Info Cards */}
      <section className="relative bg-neutral-900 py-6 md:py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactCards.map(({ icon: Icon, title, desc, detail, note }, idx) => (
            <div
              key={idx}
              className="bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl p-7 text-center transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-400/30 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-neutral-500 text-sm mb-3">{desc}</p>
              <p className="text-neutral-200 font-medium">{detail}</p>
              {note && <p className="text-xs text-neutral-500 mt-2">{note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map/Social */}
      <section className="relative bg-neutral-900 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form */}
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Send us a message</h2>

            {success && (
              <div className="mb-6 flex items-start gap-2.5 p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-emerald-400 text-sm">Thanks for reaching out — we'll get back to you shortly.</p>
              </div>
            )}
            {error && (
              <div className="mb-6 flex items-start gap-2.5 p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">Please fill in all required fields.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  name="firstName"
                  placeholder="First name *"
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="lastName"
                  placeholder="Last name *"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email address *"
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="phone"
                placeholder="Phone number"
                onChange={handleChange}
                className={inputClass}
              />
              <select name="subject" onChange={handleChange} className={inputClass}>
                <option value="" className="bg-neutral-900">Select a subject</option>
                <option value="general" className="bg-neutral-900">General inquiry</option>
                <option value="support" className="bg-neutral-900">Technical support</option>
                <option value="account" className="bg-neutral-900">Account issues</option>
                <option value="trading" className="bg-neutral-900">Trading questions</option>
                <option value="billing" className="bg-neutral-900">Billing and payments</option>
                <option value="partnership" className="bg-neutral-900">Partnership opportunities</option>
              </select>
              <textarea
                name="message"
                placeholder="Tell us how we can help you..."
                rows="5"
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-lg font-semibold text-neutral-900 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Map + Social */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-5">Our location</h3>
              <div className="rounded-xl h-56 sm:h-64 mb-6 overflow-hidden border border-white/10">
                <iframe
                  title="Nathdwara Map"
                  className="w-full h-full grayscale-[30%] contrast-125"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14714.095431962366!2d73.81247974206675!3d24.938028214670033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967bbcd06e8d8b7%3A0x898ea716295cd868!2sNathdwara%2C%20Rajasthan%20313301!5e0!3m2!1sen!2sin!4v1691414141414!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Business hours</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Monday – Friday</span>
                    <span className="text-neutral-300">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Saturday</span>
                    <span className="text-neutral-300">10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Sunday</span>
                    <span className="text-neutral-300">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3">Follow us</h3>
              <p className="text-neutral-500 text-sm mb-6">
                Stay connected for the latest updates and trading insights.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: FaFacebookF, href: "https://www.facebook.com/yourpage", hover: "hover:bg-blue-600" },
                  { Icon: FaTwitter, href: "https://twitter.com/yourprofile", hover: "hover:bg-sky-500" },
                  { Icon: FaInstagram, href: "https://www.instagram.com/algoderr", hover: "hover:bg-pink-500" },
                  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/yourprofile", hover: "hover:bg-blue-700" },
                ].map(({ Icon, href, hover }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-300 ${hover}`}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-neutral-900 py-16 md:py-20 px-4 overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Quick answers to common questions about our platform
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex justify-between items-center gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-semibold text-white">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-neutral-400 text-sm leading-relaxed px-5 pb-5">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactPage;
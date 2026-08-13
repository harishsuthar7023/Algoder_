import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { useSiteContent } from "../../hooks/useSiteContent";

const iconMap = {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
};

const Footer = () => {
  const { content, loading } = useSiteContent();
  const footerContent = content.footer || {};
  const { brandInfo, quickLinks, contactInfo, socialLinks } = footerContent;

  if (loading) {
    return (
      <footer className="bg-neutral-900 border-t border-white/10 pt-16 pb-6 px-4 text-center text-sm text-neutral-500">
        Loading...
      </footer>
    );
  }

  if (!brandInfo) return null;

  return (
    <footer className="relative bg-neutral-900 border-t border-white/10 text-neutral-400 pt-5 pb-8 px-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-blue-500/[0.05] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.04] rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Top row: brand + newsletter-style CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
            <h2 className="text-white text-2xl font-black tracking-tight">
              {brandInfo.name}
            </h2>
          </div>

          <a
            href="/#/contact"
            className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-blue-400/30 text-neutral-200 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300"
          >
            Get in touch
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand description */}
          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-sm leading-relaxed max-w-xs text-neutral-400">
              {brandInfo.description}
            </p>

            {/* Social icons moved here, more prominent */}
            {socialLinks?.length > 0 && (
              <div className="flex gap-2.5 mt-6">
                {socialLinks.map((item, index) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-blue-300 hover:bg-blue-500/10 hover:border-blue-400/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-xs tracking-widest uppercase">
              Quick links
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-blue-300 transition-colors duration-200 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-blue-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-xs tracking-widest uppercase">
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              {contactInfo?.map((item, index) => {
                const Icon = iconMap[item.icon];
                return (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 shrink-0 mt-0.5">
                      {Icon && <Icon className="w-3.5 h-3.5 text-blue-400" />}
                    </span>
                    <span className="text-neutral-400 leading-relaxed pt-1.5">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal / extra links (static, always shown) */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-xs tracking-widest uppercase">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/#/privacy" className="text-neutral-400 hover:text-blue-300 transition-colors">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="/#/terms" className="text-neutral-400 hover:text-blue-300 transition-colors">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="/#/refund" className="text-neutral-400 hover:text-blue-300 transition-colors">
                  Refund policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
          <span>
            © {new Date().getFullYear()} {brandInfo.name}. All rights reserved.
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
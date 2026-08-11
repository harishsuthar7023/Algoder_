import React from "react";
import {
  brandInfo,
  quickLinks,
  contactInfo,
  socialLinks,
} from "../../content/footerContent";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 border-t border-white/10 text-neutral-400 pt-16 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
            <h2 className="text-white text-xl font-extrabold tracking-tight">
              {brandInfo.name}
            </h2>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">{brandInfo.description}</p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
            Quick links
          </h3>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:text-blue-400 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="flex items-center gap-2.5">
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </span>
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
            Follow us
          </h3>
          <div className="flex gap-3">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-400/30 hover:text-blue-400 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-white/10 pt-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {brandInfo.name}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
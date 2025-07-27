import React from "react";
import {
  brandInfo,
  quickLinks,
  contactInfo,
  socialLinks,
} from "../content/footerContent";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 border-t border-gray-700 text-gray-300 py-4 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-white text-xl font-bold mb-2">{brandInfo.name}</h2>
          <p className="text-sm">{brandInfo.description}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-green-400" />
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {brandInfo.name}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

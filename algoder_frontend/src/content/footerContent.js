// src/data/footerContent.js
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Brand Info
export const brandInfo = {
  name: "ALGODER",
  description:
    "We offer quality products with secure checkout and instant digital delivery.",
};

// Quick Links
export const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/#/products" },
  { label: "About Us", href: "/#/about" },
  { label: "Contact", href: "/#/contact" },
];

// Contact Info
export const contactInfo = [
  {
    icon: MapPin,
    text: "NATHDWARA, Rajasthan, India",
  },
  {
    icon: Phone,
    text: "+91-6376076985",
  },
  {
    icon: Mail,
    text: "algoder09@gmail.com",
  },
];

// Social Media Links
export const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
];

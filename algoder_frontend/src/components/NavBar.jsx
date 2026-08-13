import { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import { Menu, X, UserCircle, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
      // case "Mycourse": return "/mycourse";
      // case "Courses": return "/courses";
const navLinks = ["Home", "Products", "Orders", "About", "Contact","Courses"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const menuBtnRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        await API.get("/protected/");
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    };
    fetchProtected();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("username");
    setIsLoggedIn(!!token);
    if (storedUser) setUsername(storedUser);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on outside click, but never on the toggle button itself
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!isOpen) return;
      if (menuBtnRef.current && menuBtnRef.current.contains(event.target)) return;
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = showLogoutConfirm || isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogoutConfirm, isOpen]);

  const getPath = (link) => {
    switch (link) {
      case "Home": return "/";
      case "Orders": return "/myorders/54857485/40984739/11111";
      case "Positons": return "/positions";
      case "About": return "/about";
      case "Checkout": return "/ordercheck";
      case "Mycourse": return "/mycourse";
      case "Courses": return "/courses";
      case "Contact": return "/contact";
      default: return `/${link.toLowerCase()}`;
    }
  };

  const handleNavClick = (link) => {
    navigate(getPath(link));
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-0 z-50">
      {/* Floating glass navbar — fixed slim height, no layout shift on scroll */}
      <nav
        className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl mx-auto px-4 md:px-5 rounded-xl h-12 md:h-13 flex items-center justify-between border transition-colors duration-300 ${
          scrolled
            ? "bg-neutral-900/80 border-white/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)]"
            : "bg-neutral-900/40 border-white/[0.08] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)]"
        } backdrop-blur-xl backdrop-saturate-150`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Logo */}
        <button
          className="flex items-center gap-2 cursor-pointer select-none outline-none"
          onClick={() => navigate("/")}
        >
          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-[0_0_8px_rgba(96,165,250,0.85)]" />
          <span className="text-lg md:text-xl font-extrabold tracking-tight text-white">
            ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === getPath(link);
            return (
              <button
                key={idx}
                onClick={() => handleNavClick(link)}
                className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
                  isActive ? "text-white" : "text-neutral-300 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/10 border border-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link}</span>
              </button>
            );
          })}

          <div className="w-px h-5 bg-white/10 mx-2" />

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-1 pl-1.5 pr-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
              >
                <UserCircle className="w-5 h-5 text-blue-400" />
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)] z-50 p-3"
                  >
                    <p className="text-neutral-200 text-sm mb-3 px-1">
                      Signed in as <span className="font-semibold text-white">{username}</span>
                    </p>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="flex items-center gap-2 w-full text-sm text-red-400 hover:bg-red-500/10 rounded-lg px-3 py-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/login/home/1/home`)}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 font-semibold px-4 py-1.5 rounded-lg text-sm transition-all duration-200 shadow-[0_0_16px_rgba(59,130,246,0.35)]"
            >
              Log in
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          ref={menuBtnRef}
          type="button"
          className="md:hidden relative z-[70] text-white p-2 -mr-1.5 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobileDropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed top-[3.75rem] left-1/2 w-[94%] -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl px-4 py-4 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)] z-[60]"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === getPath(link);
                return (
                  <li key={idx}>
                    <button
                      onClick={() => handleNavClick(link)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-neutral-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="h-px bg-white/10 my-3" />

            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-neutral-200 text-sm px-3.5">
                  <UserCircle className="w-5 h-5 text-blue-400" />
                  {username}
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-red-500/15 w-full"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/login/home/1/home`);
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-neutral-900 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all w-full"
              >
                Log in
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLogoutConfirm(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative bg-neutral-900/95 border border-white/10 p-6 rounded-2xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7)] w-full max-w-xs text-center backdrop-blur-xl"
            >
              <h2 className="text-lg font-semibold text-white mb-2">Log out?</h2>
              <p className="text-neutral-400 text-sm mb-6">
                You'll need to sign in again to access your account.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-200 rounded-lg text-sm transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("username");
                    setIsLoggedIn(false);
                    setShowDropdown(false);
                    navigate("/");
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_16px_rgba(239,68,68,0.4)]"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
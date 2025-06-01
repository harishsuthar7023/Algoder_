import { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import { Menu, X, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const navLinks = ["Home", "Products", "Orders", "About"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // const [message, setMessage] = useState('');

  useEffect(() => {
  const fetchProtected = async () => {
    try {
      const res = await API.get('protected/');
      // setMessage(res.data.message);
    } catch (err) {
      console.error('Auth failed, redirecting to login:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // navigate('/');
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLogoutConfirm ? "hidden" : "auto";
  }, [showLogoutConfirm]);

  const handleNavClick = (link) => {
    if (link === "Home") {
      navigate("/");
    } else if (link === "Orders") {
      navigate("/myorders");
    } else if (link === "Positons") {
      navigate("/positions");
    } else if (link === "About") {
      navigate("/about");
    } else {
      navigate(`/${link.toLowerCase()}`);
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#1f2937] shadow-md z-50">
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl mx-auto px-6 py-2 rounded-xl backdrop-blur-sm bg-white/50 shadow-md flex items-center justify-between h-14">
        <div
          className="text-2xl font-bold text-gray-800 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ALGODER
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => handleNavClick(link)}
              className="text-gray-700 hover:text-blue-600 dark:text-gray-900 transition duration-300"
            >
              {link}
            </button>
          ))}
          
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className="text-gray-800 cursor-pointer"
              >
                <UserCircle className="w-7 h-7 hover:text-blue-600" />
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
              {showDropdown && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 mt-4 w-48 backdrop-blur-md bg-white/80 rounded-md shadow-lg z-50 p-4"
                  >

                  <p className="text-gray-800 text-sm mb-2 font-semibold">
                    👋 Hello, {username}
                  </p>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="bg-red-500 text-white px-3 py-1 rounded w-full text-sm"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
              </AnimatePresence>

            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm"
            >
              Login
            </button>
          )}
          
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full rounded-2xl backdrop-blur-md bg-white/80 px-6 pb-4 pt-2 shadow-md z-40 mt-20"
          >
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className=" text-gray-800 text-left"
                >
                  {link}
                </button>
              ))}

              {isLoggedIn ? (
                <>
                  <div className="text-gray-700 dark:text-gray-200 font-medium">
                    👤 {username}
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full text-left"
                >
                  Login
                </button>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white backdrop-blur-md p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm"
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

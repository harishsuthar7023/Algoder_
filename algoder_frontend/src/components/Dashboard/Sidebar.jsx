import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  GraduationCap,
  Eye,
  Home,
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  FileEdit,
  ShoppingCart,
  Users, 
} from "lucide-react";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Add Product", path: "/productadmin", icon: PackagePlus },
  { label: "Manage Products", path: "/adminproducts", icon: Package },
  { label: "Manage Courses", path: "/courseadmin", icon: GraduationCap },
  { label: "Manage Orders", path: "/adminorders", icon: ShoppingCart },   // 👈 naya
  { label: "Manage Users", path: "/adminusers", icon: Users },  
  { label: "Site Content", path: "/sitecontent", icon: FileEdit },
];

const COLLAPSE_KEY = "admin_sidebar_collapsed";

/**
 * Single source of truth for admin navigation.
 * Desktop: a rail that collapses down to icons only, toggled by the user.
 * Mobile: a slim top bar that opens a right-side slide-in drawer —
 * same pattern as the public site's Navbar, for a consistent feel.
 */
const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  });

  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  /** Nav button used inside the collapsible desktop rail — icon-only when collapsed, with a hover tooltip. */
  const RailLink = ({ label, path, icon: Icon }) => {
    const isActive = location.pathname === path;
    return (
      <div className="relative group">
        <button
          onClick={() => handleNav(path)}
          aria-current={isActive ? "page" : undefined}
          title={collapsed ? label : undefined}
          className={`flex items-center gap-3 w-full py-2.5 rounded-lg text-sm font-medium transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
            collapsed ? "justify-center px-0" : "px-3.5"
          } ${
            isActive
              ? "bg-white/10 text-white border border-white/10"
              : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
          }`}
        >
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : ""}`} strokeWidth={2} />
          {!collapsed && <span className="truncate">{label}</span>}
        </button>
        {collapsed && (
          <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-neutral-900 border border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg shadow-black/40">
            {label}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ---------------- Mobile top bar ---------------- */}
      <header className="md:hidden flex items-center justify-between bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
          ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-neutral-300 p-2 rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* ---------------- Mobile drawer + overlay ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="md:hidden fixed inset-y-0 right-0 z-[60] w-[82%] max-w-[320px] bg-neutral-900/95 border-l border-white/10 backdrop-blur-xl shadow-[-16px_0_48px_-12px_rgba(0,0,0,0.6)] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+1.1rem)] pb-4 border-b border-white/10">
                <span className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                  ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3">
                <ul className="flex flex-col gap-1">
                  {navItems.map(({ label, path, icon: Icon }) => {
                    const isActive = location.pathname === path;
                    return (
                      <li key={path}>
                        <button
                          onClick={() => handleNav(path)}
                          className={`flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-white/10 text-white border border-white/10"
                              : "text-neutral-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-blue-400" : "text-neutral-500"}`} />
                          {label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer: logout, pinned, safe-area aware */}
              <div className="px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-rose-500/10 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-rose-500/15 w-full"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- Desktop rail (collapsible) ---------------- */}
      <div
        aria-hidden="true"
        className={`hidden md:block shrink-0 transition-[width] duration-300 ${
          collapsed ? "md:w-[76px]" : "md:w-64"
        }`}
      />

      <aside
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-30 bg-neutral-900 border-r border-white/10 p-3 transition-[width] duration-300 ${
          collapsed ? "md:w-[76px]" : "md:w-64"
        }`}
      >
        <div className={`flex items-center mb-8 px-1 ${collapsed ? "flex-col gap-3" : "justify-between"}`}>
          <Link to="/" className={collapsed ? "" : "min-w-0"}>
            {collapsed ? (
              <span className="w-7 h-7 mx-auto rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center text-white font-bold text-xs">
                AD
              </span>
            ) : (
              <>
                <span className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                  ALGO<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">DER</span>
                </span>
                <p className="text-neutral-500 text-xs mt-0.5">Admin panel</p>
              </>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-neutral-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <RailLink key={item.path} {...item} />
          ))}
        </nav>

        <div className="relative group mt-4">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex items-center gap-3 w-full py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 text-left ${
              collapsed ? "justify-center px-0" : "px-3.5"
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && "Logout"}
          </button>
          {collapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-neutral-900 border border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg shadow-black/40">
              Logout
            </span>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
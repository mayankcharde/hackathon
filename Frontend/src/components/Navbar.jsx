import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  Menu,
  X,
  Package,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  Search,
  ShieldCheck,
  Plus,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const isFounder = user?.role === "founder";
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4 md:pt-5">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto glass-card rounded-[2rem] px-4 md:px-6 py-3.5 relative overflow-hidden"
      >
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white">
              Found<span className="text-gradient">It</span>.
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {user ? (
              <>
                {!isFounder && (
                  <NavPill
                    to="/dashboard"
                    icon={LayoutDashboard}
                    active={isActive("/dashboard")}
                  >
                    Items
                  </NavPill>
                )}
                <NavPill
                  to="/messages"
                  icon={MessageSquare}
                  active={isActive("/messages")}
                  badge={notifications.length}
                >
                  {isFounder ? "Chats" : "Inbox"}
                </NavPill>

                <div className="w-px h-5 bg-white/10 mx-3" />

                {isFounder ? (
                  <Link
                    to="/scan"
                    className="btn-primary text-sm py-2 px-5 gap-2"
                  >
                    <Search className="w-4 h-4" /> Scan QR
                  </Link>
                ) : (
                  <Link
                    to="/add-item"
                    className="btn-primary text-sm py-2 px-5 gap-2"
                  >
                    <Plus className="w-4 h-4" /> Protect Item
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-2 p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/founder-login"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-300" /> Finder Hub
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-3"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden mt-4 pt-4 border-t border-white/10 space-y-2"
            >
              {user ? (
                <>
                  {!isFounder && (
                    <MobileLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                    >
                      Your Items
                    </MobileLink>
                  )}
                  <MobileLink to="/messages" onClick={() => setIsOpen(false)}>
                    Messages
                  </MobileLink>
                  {isFounder ? (
                    <Link
                      to="/scan"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary w-full py-3 mt-2 text-sm"
                    >
                      Scan Item
                    </Link>
                  ) : (
                    <Link
                      to="/add-item"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary w-full py-3 mt-2 text-sm"
                    >
                      Protect New Item
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 text-red-400 font-semibold text-sm border-t border-white/10 mt-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileLink
                    to="/founder-login"
                    onClick={() => setIsOpen(false)}
                  >
                    Finder Hub
                  </MobileLink>
                  <MobileLink to="/login" onClick={() => setIsOpen(false)}>
                    Owner Login
                  </MobileLink>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full py-3 mt-2 text-sm"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

const NavPill = ({ to, icon: Icon, children, active, badge }) => (
  <Link
    to={to}
    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      active
        ? "text-white bg-white/10"
        : "text-slate-400 hover:text-white hover:bg-white/05"
    }`}
  >
    <Icon className="w-4 h-4" />
    {children}
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
        {badge}
      </span>
    )}
  </Link>
);

const MobileLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block py-2.5 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;

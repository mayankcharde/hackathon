import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Package,
  QrCode,
  Search,
  MoreVertical,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        setItems(res.data.data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/12 rounded-full blur-[100px] animate-pulse-soft" />
          <div className="absolute -top-10 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] animate-pulse-soft delay-1000" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">
                  Vault Overview
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-white mb-2 leading-[0.9]">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
                  Assets
                </span>
                .
              </h1>
              <p className="text-slate-400 font-medium text-lg lg:max-w-md">
                Securely monitor your high-value belongings with AI-powered
                recovery.
              </p>
            </div>

            <Link to="/add-item" className="btn-primary group h-fit">
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
              <span>Register New Item</span>
            </Link>
          </div>
        </motion.div>

        {/* Filters/Stats Bar */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 mb-12">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-300 transition-colors" />
            <input
              type="text"
              placeholder="Filter your inventory..."
              className="input-field pl-14 py-5 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <StatMini label="Vault" value={items.length} icon={LayoutGrid} />
            <div className="w-[1px] h-8 bg-white/10" />
            <StatMini
              label="Lost"
              value={items.filter((i) => i.status === "lost").length}
              icon={AlertCircle}
              color="text-red-400"
            />
            <div className="w-[1px] h-8 bg-white/10" />
            <StatMini
              label="Active"
              value={items.filter((i) => i.status === "active").length}
              icon={ShieldCheck}
              color="text-green-400"
            />
          </div>
        </div>

        {/* Grid System */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] glass-morphism rounded-[3rem] animate-pulse relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />
                </div>
              ))}
            </motion.div>
          ) : filteredItems.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 glass-morphism rounded-[4rem] border-dashed border-white/10"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                <Package className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                Vault is Empty
              </h3>
              <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed text-lg">
                Your belongings are not yet under AI protection. Register your
                first item to begin.
              </p>
              <Link to="/add-item" className="btn-primary inline-flex">
                Protect First Item
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const StatMini = ({ label, value, icon: Icon, color = "text-blue-400" }) => (
  <div className="flex items-center space-x-3 px-6 py-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
    <Icon
      className={`w-4 h-4 ${color} transition-transform group-hover:scale-110`}
    />
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">
        {label}
      </span>
      <span className="text-lg font-black text-white leading-none tracking-tighter">
        {value}
      </span>
    </div>
  </div>
);

const AlertCircle = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ItemCard = ({ item, index }) => {
  const statusConfig = {
    active: {
      color: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-400",
      label: "Secured",
    },
    lost: {
      color: "from-red-500/20 to-red-500/5",
      iconColor: "text-red-400",
      label: "Broadcast",
    },
    found: {
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
      label: "Located",
    },
    archived: {
      color: "from-slate-500/20 to-slate-500/5",
      iconColor: "text-slate-400",
      label: "Archived",
    },
  };

  const config = statusConfig[item.status] || statusConfig.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-sky-500/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative glass-morphism rounded-[3rem] overflow-hidden border border-white/5 group-hover:border-white/20 transition-all duration-500">
        {/* Media Container */}
        <div className="aspect-[5/4] relative overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5">
              <Package className="w-16 h-16 text-white/10 mb-4" />
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                Empty Visual Vault
              </div>
            </div>
          )}

          {/* Status Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="px-4 py-1.5 rounded-full glass-morphism backdrop-blur-3xl border border-white/20 flex items-center space-x-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.iconColor} bg-current`}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${config.iconColor}`}
                >
                  {config.label}
                </span>
              </div>
              <button className="p-3 glass rounded-2xl hover:bg-white/10 transition-colors">
                <MoreVertical className="w-5 h-5 text-white/50" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white tracking-tighter leading-none group-hover:translate-x-1 transition-transform">
                {item.name}
              </h3>
              <p className="text-sm text-white/50 font-medium tracking-tight line-clamp-1">
                {item.description || "Verified Asset Under Protection"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 flex items-center justify-between bg-white/[0.02]">
          <Link
            to={`/qr/${item._id}`}
            className="flex items-center space-x-3 text-white/60 hover:text-white transition-colors group/btn"
          >
            <div className="p-2.5 bg-white/5 rounded-xl group-hover/btn:bg-cyan-600/20 transition-colors">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest px-1">
              Identity QR
            </span>
          </Link>

          <Link
            to={`/item/${item._id}`}
            className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-cyan-300 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

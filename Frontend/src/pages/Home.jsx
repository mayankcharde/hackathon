import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Shield,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import InteractiveNeuralVortex from "../components/ui/interactive-neural-vortex-background";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <InteractiveNeuralVortex />

      <section className="px-4 pb-20">
        <div className="page-container grid md:grid-cols-2 gap-8">
          <PortalCard
            title="Item Owners"
            description="Protect your wallets, bags, gadgets, and pets with trackable QR identity linked to private communication."
            to="/register"
            action="Register as Owner"
            icon={<Package className="w-12 h-12 text-cyan-300" />}
          />
          <PortalCard
            title="Item Finders"
            description="Found something? Upload proof and connect safely with owners without sharing your personal phone number."
            to="/founder-register"
            action="Join Finder Network"
            icon={<ShieldCheck className="w-12 h-12 text-sky-300" />}
          />
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="page-container section-panel p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-100 mb-4 tracking-tight">
              Intelligence Combined with Trust
            </h2>
            <p className="text-slate-300 text-base md:text-lg font-medium max-w-3xl mx-auto">
              Every interaction is privacy-first, monitored for safety, and
              optimized for quicker returns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-7 h-7 text-cyan-300" />}
              title="Privacy Guard"
              desc="Coordinate returns without exposing personal contact details."
            />
            <FeatureCard
              icon={<MessageCircle className="w-7 h-7 text-cyan-300" />}
              title="Smart Chat"
              desc="AI-assisted real-time messaging with spam-aware guidance."
            />
            <FeatureCard
              icon={<MapPin className="w-7 h-7 text-cyan-300" />}
              title="Anywhere Access"
              desc="One scan from any phone instantly opens a secure return flow."
            />
          </div>
        </div>
      </section>

      <footer className="px-4 pb-14">
        <div className="page-container text-center pt-8 border-t border-slate-800">
          <div className="flex items-center justify-center space-x-2 text-2xl font-black text-cyan-300 mb-5">
            <Package className="w-8 h-8" />
            <span>FoundIt.</span>
          </div>
          <p className="text-slate-400 font-medium mb-8">
            Building a future where lost things return home faster.
          </p>
          <div className="flex justify-center gap-6 text-slate-400 font-semibold text-sm uppercase tracking-widest">
            <a href="#" className="hover:text-cyan-300">
              Privacy
            </a>
            <a href="#" className="hover:text-cyan-300">
              Terms
            </a>
            <a href="#" className="hover:text-cyan-300">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PortalCard = ({ title, description, to, action, icon }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="section-panel p-8 md:p-10 relative overflow-hidden"
  >
    <div className="relative z-10">
      <div className="mb-6">{icon}</div>
      <h2 className="text-3xl font-black mb-3 text-slate-100">{title}</h2>
      <p className="text-slate-300 text-base mb-8 font-medium leading-relaxed">
        {description}
      </p>
      <Link
        to={to}
        className="flex items-center space-x-3 text-cyan-300 font-black text-base hover:text-cyan-200 transition-colors"
      >
        <span>{action}</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
    <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
  </motion.div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="glass-morphism p-7 rounded-3xl border border-slate-700/60"
  >
    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-100 mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-300 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export default Home;

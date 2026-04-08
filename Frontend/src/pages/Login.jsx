import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { SmokeyBackground } from "../components/ui/login-form";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell relative overflow-hidden">
      <SmokeyBackground className="pointer-events-none" color="#0f3fa3" />
      <Navbar />
      <div className="page-container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="section-panel p-8 md:p-10"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-400/30">
              <LogIn className="w-8 h-8 text-cyan-300" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-slate-100 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-slate-400 mb-8">
            Access your protected belongings
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                className="input-field pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-300 hover:underline">
              Register Now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

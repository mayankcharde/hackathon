import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { QrCode, ArrowLeft, Info, Zap } from "lucide-react";

const Scanner = () => {
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // delay scanner initialization slightly to ensure element is in DOM
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    });

    scanner.render(
      (decodedText) => {
        // Logic: If the QR contains an ID or a full URL
        // Our QR codes encode just the item ID (e.g., "64f123...")
        // but we should handle both case
        setScanning(false);
        scanner.clear();

        const itemId = decodedText.split("/").pop(); // handles both full URL and raw ID
        navigate(`/item/${itemId}`);
      },
      (error) => {
        // Silently handle scan errors (common during continuous scanning)
      },
    );

    return () => {
      scanner
        .clear()
        .catch((err) => console.error("Failed to clear scanner", err));
    };
  }, [navigate]);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-container max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-100 mb-3">
            Item Scanner
          </h1>
          <p className="text-slate-400">
            Scan any FoundIt QR code to contact the owner.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="section-panel rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-700 relative"
        >
          {/* Scanner UI container */}
          <div id="reader" className="w-full h-full min-h-[400px]"></div>

          {!scanning && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-8 text-center">
              <div className="animate-bounce mb-4 text-cyan-300">
                <Zap className="w-12 h-12 fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100">Code Found!</h3>
              <p className="text-slate-400">Redirecting to item details...</p>
            </div>
          )}
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-morphism p-6 rounded-2xl flex items-start space-x-4 border border-cyan-500/20">
            <div className="p-2 bg-cyan-600 rounded-lg shrink-0">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-cyan-100 text-sm">Scan Anytime</h4>
              <p className="text-sm text-cyan-200/90">
                Works in low light and scans instantly.
              </p>
            </div>
          </div>
          <div className="glass-morphism p-6 rounded-2xl flex items-start space-x-4 border border-slate-700">
            <div className="p-2 bg-slate-700 rounded-lg shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">
                Privacy Guaranteed
              </h4>
              <p className="text-sm text-slate-400">
                Your scan data is used only for location aid.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scanner;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  ArrowLeft,
  Package,
  CheckCircle2,
} from "lucide-react";

const QRGenerator = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data.data);
      } catch (err) {
        console.error("Failed to fetch item", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  const downloadQR = () => {
    if (!item?.qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = item.qrCodeUrl;
    link.download = `QR_${item.name.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse text-cyan-300 font-bold">
        Loading QR Tag...
      </div>
    );

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-container max-w-3xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 text-slate-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-panel rounded-3xl shadow-xl border border-slate-700 p-8 md:p-12 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <CheckCircle2 className="w-10 h-10 text-emerald-300" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100 mb-2">
            Protection Ready!
          </h1>
          <p className="text-slate-400 mb-10">
            Download and print this QR code to attach it to your{" "}
            <strong className="text-slate-200">{item.name}</strong>.
          </p>

          <div className="inline-block p-6 bg-slate-900 border-8 border-slate-800 rounded-3xl shadow-inner mb-10">
            <img
              src={item.qrCodeUrl}
              alt="Item QR Code"
              className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={downloadQR}
              className="btn-primary flex items-center justify-center space-x-2 py-4"
            >
              <Download className="w-5 h-5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={() => {
                navigator
                  .share({
                    title: `QR Protection for ${item.name}`,
                    url: window.location.origin + `/item/${item._id}`,
                  })
                  .catch(() => alert("Copied to clipboard!"));
              }}
              className="btn-secondary flex items-center justify-center space-x-2 py-4"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Link</span>
            </button>
          </div>

          <div className="mt-12 p-6 bg-slate-900 rounded-2xl border border-slate-700 text-left">
            <h4 className="font-bold text-slate-100 mb-2 flex items-center space-x-2">
              <Package className="w-5 h-5 text-cyan-300" />
              <span>Safety Tips</span>
            </h4>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
              <li>Laminate the QR code for durability.</li>
              <li>Attach it securely where it won't easily scratch off.</li>
              <li>
                Anyone who scans this will be able to contact you securely.
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default QRGenerator;

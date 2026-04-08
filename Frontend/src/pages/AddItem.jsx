import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Upload,
  Wand2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setPreview(null);
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const generateWithAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/generate-description", {
        prompt: aiPrompt,
      });
      setFormData({
        ...formData,
        name: res.data.data.name,
        description: res.data.data.description,
      });
    } catch (err) {
      setError("AI generation failed. Please try manual input.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("status", formData.status);
    if (image) data.append("image", image);

    try {
      const res = await api.post("/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/qr/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="page-container max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid md:grid-cols-5 gap-10">
          {/* AI Helper Sidebar */}
          <div className="md:col-span-2 order-2 md:order-1">
            <div className="section-panel text-white p-6 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <Wand2 className="w-5 h-5 text-cyan-300" />
                  <h3 className="font-bold text-lg">AI Assistant</h3>
                </div>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Describe your item briefly (e.g., "blue leather wallet with my
                  ID") and let Gemini generate professional details.
                </p>
                <textarea
                  className="w-full bg-slate-950 border border-slate-700 placeholder:text-slate-500 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500/40 outline-none mb-4"
                  rows="3"
                  placeholder="Describe your item here..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <button
                  onClick={generateWithAI}
                  disabled={aiLoading || !aiPrompt}
                  className="w-full py-2 bg-cyan-500 text-slate-950 rounded-lg font-bold text-sm hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  {aiLoading ? "Generating..." : "Auto-Fill Details"}
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-300/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            </div>
          </div>

          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-3 order-1 md:order-2 space-y-6 section-panel p-6 md:p-8 rounded-3xl"
          >
            <h1 className="text-3xl font-bold text-slate-100">Add New Item</h1>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">
                  Item Image
                </label>
                <div
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  className="w-full aspect-video bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 transition-all overflow-hidden relative"
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                        aria-label="Remove selected image"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-400 mb-2" />
                      <span className="text-slate-400 font-medium">
                        Click to upload image
                      </span>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., iPhone 15 Pro Max"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder="Include defining features, serial numbers, etc."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Protect This Item</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddItem;

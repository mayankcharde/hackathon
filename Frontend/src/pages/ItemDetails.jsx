import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  Camera,
  CheckCircle2,
  User,
  Eye,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [activeConversations, setActiveConversations] = useState([]); // For Owner POV
  const [error, setError] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);

  // Founder Proof State
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemRes = await api.get(`/items/${id}`);
        const itemData = itemRes.data.data;
        setItem(itemData);

        const isItemOwner = user?._id === itemData.userId._id;

        if (isItemOwner) {
          // OWNER POV: Fetch all people who found this specific item
          // Using query param ?itemId=id now handled by backend
          const convRes = await api.get("/conversations");
          const filtered = convRes.data.data.filter((c) => c.itemId._id === id);
          setActiveConversations(filtered);
        } else {
          // DISCOVERY POV: Check if I (the finder) already have a conversation
          if (user) {
            const convRes = await api.get("/conversations");
            const existing = convRes.data.data.find(
              (c) => c.itemId._id === id && c.founderId._id === user._id,
            );
            if (existing) setConversation(existing);
          }
        }
      } catch (err) {
        setError("Item not found or link expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStartChatWithProof = async () => {
    // SECURITY AUTH CHECK: Ensure user is logged in
    if (!user) {
      if (
        window.confirm(
          "SECURITY ALERT: An account is required to contact the owner. Redirecting to registration...",
        )
      ) {
        navigate("/founder-register");
      }
      return;
    }

    // BLOCK SELF-CHAT: You cannot "find" your own item
    if (item.userId._id === user._id) {
      alert(
        "ACTION BLOCKED: You are the owner of this item. You cannot start a discovery report for your own belonging.",
      );
      return;
    }

    // Validation: Require proof if conversation doesn't exist
    if (!conversation && !proofFile) {
      alert(
        "ACTION REQUIRED: Please pick a photo of the item as proof of discovery.",
      );
      return;
    }

    setMsgLoading(true);
    try {
      let res;

      if (proofFile) {
        const formData = new FormData();
        formData.append("itemId", id);
        formData.append("proofImage", proofFile);

        // Let Axios/browser set multipart boundaries automatically.
        res = await api.post("/conversations", formData);
      } else {
        // Existing conversations can be resumed without re-uploading proof.
        res = await api.post("/conversations", { itemId: id });
      }

      setConversation(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not start chat. Please try again.",
      );
    } finally {
      setMsgLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-300 font-bold tracking-widest animate-pulse uppercase text-xs">
        Initializing Secure Protocol...
      </div>
    );
  if (!item)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-100 font-bold">
        {" "}
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />{" "}
        <span>Item Not Found</span>{" "}
      </div>
    );

  const isItemOwner = user?._id === item.userId._id;

  return (
    <div className="page-shell">
      <Navbar />

      {/* Role Banner - Accuracy Visibility Fix */}
      <div
        className={`py-3 px-4 text-center text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${isItemOwner ? "bg-slate-900 text-white" : "bg-cyan-700 text-white"}`}
      >
        {isItemOwner ? (
          <div className="flex items-center justify-center space-x-2">
            <Eye className="w-3 h-3" />{" "}
            <span>Owner Management Perspective Active</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <ShieldCheck className="w-3 h-3" />{" "}
            <span>Discovery Portal Active</span>
          </div>
        )}
      </div>

      <main className="page-container py-2 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Item Overview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-panel rounded-[3rem] p-4 lg:p-6 shadow-xl border border-slate-700/70">
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-900 mb-8">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <Package className="w-20 h-20 mb-4 opacity-20" />
                    <span className="text-[10px] uppercase font-black tracking-widest">
                      Image Unavailable
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-cyan-600/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-white">
                      Verified Item
                    </span>
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                      {item.name}
                    </h1>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white">
                    <Package />
                  </div>
                </div>
              </div>

              <div className="px-4 space-y-6">
                <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-6">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  <span>AI Protected Information</span>
                </div>
                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  {item.description ||
                    "Verified protected item. Please use the encrypted portal to contact the owner."}
                </p>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="p-5 bg-slate-900 rounded-3xl group hover:bg-slate-800 transition-all duration-500 border border-slate-800">
                    <User className="w-5 h-5 text-slate-400 mb-2 group-hover:text-cyan-300" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">
                      Owner
                    </p>
                    <p className="font-black text-slate-100 truncate">
                      {isItemOwner ? "You" : item.userId.name}
                    </p>
                  </div>
                  <div className="p-5 bg-slate-900 rounded-3xl group hover:bg-slate-800 transition-all duration-500 border border-slate-800">
                    <div className="w-5 h-5 text-slate-400 mb-2 group-hover:text-cyan-300 flex items-center justify-center font-black text-xs">
                      ID
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">
                      Reference
                    </p>
                    <p className="font-black text-slate-100">
                      {item._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interaction Panel */}
          <section className="section-panel rounded-[3.5rem] p-8 md:p-10 border border-slate-700/70 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isItemOwner ? (
                /* OWNER POV: Manage Chats */
                <motion.div
                  key="owner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10 relative z-10"
                >
                  <div>
                    <h2 className="text-4xl font-black text-slate-100 tracking-tighter mb-3">
                      Item Administration
                    </h2>
                    <p className="text-slate-400 font-medium">
                      Verify finding proof below before engaging in real-time
                      recovery communication.
                    </p>
                  </div>

                  {activeConversations.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-[10px] font-black text-cyan-300 uppercase tracking-widest mb-6 py-2 px-4 bg-cyan-500/10 rounded-lg w-fit">
                        Active Discovery Chats
                      </div>
                      {activeConversations.map((conv) => (
                        <div
                          key={conv._id}
                          onClick={() => setConversation(conv)}
                          className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative ${conversation?._id === conv._id ? "bg-slate-900 border-slate-700 text-white shadow-2xl scale-[1.02]" : "bg-slate-900/60 border-slate-700 hover:border-cyan-400 shadow-sm"}`}
                        >
                          <div className="flex items-center space-x-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                              {conv.proofImage ? (
                                <img
                                  src={conv.proofImage}
                                  alt="proof"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                  <Camera />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-black text-lg tracking-tight truncate">
                                  {conv.founderId?.name}
                                </h4>
                                <div className="px-2 py-0.5 bg-emerald-500 rounded-md text-[8px] font-black text-white uppercase">
                                  Proof Verified
                                </div>
                              </div>
                              <p
                                className={`text-[10px] font-bold uppercase tracking-widest truncate ${conversation?._id === conv._id ? "text-slate-400" : "text-slate-400"}`}
                              >
                                Discovery at{" "}
                                {new Date(conv.updatedAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <ArrowRight
                              className={`w-6 h-6 ${conversation?._id === conv._id ? "text-cyan-300" : "text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1"} transition-all`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center bg-slate-900 rounded-[3rem] border border-dashed border-slate-700">
                      <ShieldAlert className="w-16 h-16 text-slate-500 mx-auto mb-6" />
                      <h4 className="text-slate-100 font-black text-xl mb-1">
                        Your item is secure.
                      </h4>
                      <p className="text-slate-400 font-medium text-sm">
                        Waiting for a finder to contact you via QR scan.
                      </p>
                    </div>
                  )}

                  {conversation && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-10 mt-10 border-t border-slate-700"
                    >
                      <Chat
                        conversationId={conversation._id}
                        recipientName={conversation.founderId.name}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* DISCOVERY POV: Visible TO ALL NON-OWNERS (Regardless of Account Role) */
                <motion.div
                  key="discovery"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10 relative z-10"
                >
                  {!conversation ? (
                    <div className="space-y-10">
                      <div>
                        <div className="bg-cyan-600 text-white w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                          Contact Owner Available
                        </div>
                        <h2 className="text-4xl font-black text-slate-100 tracking-tighter mb-3">
                          Report a Finding
                        </h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          Have you discovered this item? Upload a verification
                          photo to unlock a secure real-time chat with the
                          owner.
                        </p>
                      </div>

                      {/* Drop Zone */}
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div
                          className={`aspect-video rounded-[3rem] border-4 border-dashed transition-all flex flex-col items-center justify-center p-10 ${proofPreview ? "border-cyan-500 bg-cyan-500/10 shadow-2xl shadow-cyan-900/40" : "border-slate-700 bg-slate-900 group-hover:border-cyan-400 group-hover:bg-slate-800"}`}
                        >
                          {proofPreview ? (
                            <div className="relative w-full h-full">
                              <img
                                src={proofPreview}
                                alt="preview"
                                className="w-full h-full object-cover rounded-[2rem] shadow-xl"
                              />
                              <div className="absolute top-4 right-4 bg-cyan-600 text-white p-2 rounded-full shadow-lg">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                            </div>
                          ) : (
                            <div className="text-center group-hover:scale-105 transition-transform duration-500">
                              <div className="p-6 bg-slate-800 rounded-full shadow-lg border border-slate-700 mb-6 mx-auto w-fit">
                                <Camera className="w-10 h-10 text-cyan-300" />
                              </div>
                              <h4 className="text-xl font-black text-slate-100 mb-1">
                                Pick Discovery Photo
                              </h4>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                Verification Proof Required
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleStartChatWithProof}
                        disabled={msgLoading}
                        className="btn-primary w-full py-6 text-2xl flex items-center justify-center space-x-4 hover:scale-[1.01] active:scale-95 transition-all"
                      >
                        {msgLoading ? (
                          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <MessageCircle className="w-8 h-8" />
                            <span className="font-black">
                              Start Chat with Owner
                            </span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center space-x-3 text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-cyan-300" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                          Verified Secure Session
                        </p>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50 font-black">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-emerald-300 tracking-tighter leading-none mb-1">
                              Verification Active
                            </h3>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                              Founder Metadata Authenticated
                            </p>
                          </div>
                        </div>
                      </div>
                      <Chat
                        conversationId={conversation._id}
                        recipientName="Item Owner"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background Accent */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/8 rounded-full blur-[100px] -z-10" />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ItemDetails;

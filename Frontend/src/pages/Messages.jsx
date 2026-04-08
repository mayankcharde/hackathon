import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Wand2,
  Package,
  ChevronRight,
  Inbox,
} from "lucide-react";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState("");
  const [sugLoading, setSugLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/conversations");
        setConversations(res.data.data);
        if (res.data.data.length > 0) setSelectedConv(res.data.data[0]);
      } catch (err) {
        console.error("Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const getAISuggestion = async () => {
    if (!selectedConv?.lastMessage?.text) return;
    setSugLoading(true);
    setSuggestion("");
    try {
      // Use the last message in the thread for the suggestion
      const partnerName =
        user._id === selectedConv.ownerId._id
          ? selectedConv.founderId.name
          : selectedConv.ownerId.name;
      const res = await api.post("/ai/suggest-reply", {
        finderName: partnerName,
        messageText: selectedConv.lastMessage.text,
      });
      setSuggestion(res.data.data);
    } catch (err) {
      setSuggestion("Failed to get suggestion.");
    } finally {
      setSugLoading(false);
    }
  };

  return (
    <div className="page-shell flex flex-col overflow-hidden">
      <Navbar />

      <main className="page-container flex-1 flex overflow-hidden rounded-[2rem] shadow-2xl border border-slate-700/70 glass-morphism min-h-[calc(100vh-10rem)]">
        {/* Sidebar: Conversations List */}
        <aside className="w-full md:w-80 lg:w-96 bg-slate-900/70 border-r border-slate-700 flex flex-col shrink-0">
          <div className="p-8 border-b border-slate-700 flex items-center justify-between bg-slate-900/70 backdrop-blur-md">
            <h2 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
              <Inbox className="w-6 h-6 text-cyan-300" />
              <span>Inbox</span>
            </h2>
            <div className="px-2 py-1 bg-cyan-500/10 text-cyan-200 rounded-lg text-[10px] font-bold uppercase tracking-widest">
              {conversations.length} Threads
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-slate-800 animate-pulse rounded-3xl"
                  />
                ))}
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => {
                const isSelected = selectedConv?._id === conv._id;
                const partnerName =
                  user._id === conv.ownerId._id
                    ? conv.founderId.name
                    : conv.ownerId.name;

                return (
                  <button
                    key={conv._id}
                    onClick={() => {
                      setSelectedConv(conv);
                      setSuggestion("");
                    }}
                    className={`w-full text-left p-6 transition-all duration-300 relative group flex items-start space-x-4 border-b border-slate-800 ${isSelected ? "bg-slate-800 shadow-xl z-10 scale-[1.02] rounded-r-3xl my-2" : "hover:bg-slate-800/60"}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                      {partnerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-slate-100 truncate">
                          {partnerName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-2 overflow-hidden">
                        <Package className="w-3 h-3" />
                        <span className="truncate">{conv.itemId?.name}</span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1 italic">
                        {conv.lastMessage?.text || "New conversation started"}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400 rounded-r-full" />
                    )}
                    <ChevronRight
                      className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isSelected ? "translate-x-1" : "group-hover:translate-x-1"}`}
                    />
                  </button>
                );
              })
            ) : (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full space-y-4">
                <div className="p-6 bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-700">
                  <MessageSquare className="w-16 h-16 opacity-20" />
                </div>
                <div>
                  <p className="font-bold text-slate-100">
                    No conversations yet
                  </p>
                  <p className="text-xs">Your chat threads will appear here</p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Content: Chat window & AI Tools */}
        <section className="flex-1 bg-slate-950/20 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedConv ? (
              <motion.div
                key={selectedConv._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {/* Header Header */}
                <header className="p-8 border-b border-slate-700 bg-slate-900/60 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-inner">
                      {selectedConv.itemId?.image ? (
                        <img
                          src={selectedConv.itemId.image}
                          alt="item"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Package />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-100">
                        {user._id === selectedConv.ownerId._id
                          ? selectedConv.founderId.name
                          : selectedConv.ownerId.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center space-x-1.5 text-cyan-300">
                          <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />{" "}
                          <span>Conversation in Progress</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <span>|</span> <Package className="w-3.5 h-3.5" />{" "}
                          <span>{selectedConv.itemId?.name}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestion Trigger */}
                  <button
                    onClick={getAISuggestion}
                    disabled={sugLoading || !selectedConv.lastMessage}
                    className="group relative flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white rounded-2xl font-bold shadow-xl shadow-cyan-900/50 hover:bg-cyan-500 transition-all disabled:opacity-20"
                  >
                    {sugLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    )}
                    <span>AI Suggest Reply</span>
                  </button>
                </header>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950/20">
                  {/* Chat Container */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col overflow-hidden">
                    <Chat
                      conversationId={selectedConv._id}
                      recipientName={
                        user._id === selectedConv.ownerId._id
                          ? selectedConv.founderId.name
                          : selectedConv.ownerId.name
                      }
                    />
                  </div>

                  {/* Sidebar info (AI results, Map if available) */}
                  <aside className="hidden md:flex w-80 lg:w-96 p-8 border-l border-slate-700 flex-col space-y-6 overflow-y-auto bg-slate-900/50">
                    <div className="p-6 bg-slate-900 rounded-3xl border border-slate-700 shadow-sm relative overflow-hidden group">
                      <div className="relative z-10">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                          Gemini Intelligence
                        </h4>
                        <div className="space-y-4">
                          {suggestion ? (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30"
                            >
                              <p className="text-sm italic text-cyan-100 leading-relaxed font-medium">
                                "{suggestion}"
                              </p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(suggestion);
                                  alert("Copied to clipboard!");
                                }}
                                className="mt-4 text-[10px] font-black text-cyan-300 uppercase hover:underline"
                              >
                                Copy and close
                              </button>
                            </motion.div>
                          ) : (
                            <div className="py-6 text-center text-slate-400">
                              <p className="text-xs font-medium">
                                Click "AI Suggest Reply" to see generated
                                responses here.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </div>

                    <div className="p-6 bg-slate-900 rounded-3xl border border-slate-700 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        Item Snapshot
                      </h4>
                      <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                        {selectedConv.itemId?.image ? (
                          <img
                            src={selectedConv.itemId.image}
                            alt="item"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Package className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <h5 className="font-black text-slate-100 truncate">
                          {selectedConv.itemId?.name}
                        </h5>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                          {selectedConv.itemId?.description}
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-pulse bg-slate-900/40">
                <div className="p-10 bg-slate-900 rounded-[3rem] shadow-xl border border-slate-700 mb-6">
                  <MessageSquare className="w-24 h-24 opacity-20" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-[0.3em]">
                  Select a conversation
                </h3>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default Messages;

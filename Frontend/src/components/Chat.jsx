import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import {
  Send,
  User,
  Clock,
  Check,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chat = ({ conversationId, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/conversations/${conversationId}/messages`);
        setMessages(res.data.data);
      } catch (err) {
        console.error("Failed to fetch chat history");
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchMessages();
      // Join the conversation room immediately
      if (socket) {
        socket.emit("join_conversation", conversationId);
      }
    }

    if (socket) {
      const handleReceive = (msg) => {
        if (msg.conversationId === conversationId) {
          setMessages((prev) => {
            // Prevent duplicate rendering of the same message
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
      };
      socket.on("receive_message", handleReceive);
      return () => socket.off("receive_message", handleReceive);
    }
  }, [conversationId, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await api.post("/messages", {
        conversationId,
        message: newMessage,
      });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-88 md:min-h-0 glass-morphism rounded-[2rem] shadow-2xl border border-slate-700/50 overflow-hidden relative">
      {/* Real-time Indicator */}
      <div className="absolute top-4 right-6 flex items-center space-x-2 z-10">
        <div
          className={`w-2 h-2 rounded-full ${socket?.connected ? "bg-green-500 animate-pulse" : "bg-red-400"}`}
        />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {socket?.connected ? "Live" : "Offline"}
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-950/30 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?._id;
            return (
              <motion.div
                key={msg._id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-[1.5rem] px-5 py-3 shadow-lg relative ${isMe ? "bg-cyan-600 text-white rounded-br-none shadow-cyan-900/50" : "bg-slate-900 text-slate-100 border border-slate-700 rounded-bl-none shadow-slate-950/50"}`}
                >
                  <p className="text-sm md:text-md leading-relaxed font-medium">
                    {msg.message}
                  </p>
                  <div
                    className={`text-[9px] mt-2 flex items-center justify-end space-x-1 font-bold ${isMe ? "text-cyan-100" : "text-slate-400"}`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && <CheckCheck className="w-2.5 h-2.5 ml-1" />}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-75">
            <div className="p-6 bg-slate-900 rounded-full shadow-inner mb-4 border border-slate-700">
              <ShieldCheck className="w-12 h-12 text-cyan-400" />
            </div>
            <p className="text-sm font-black uppercase tracking-widest">
              Secure conversation with {recipientName}
            </p>
            <p className="text-xs font-bold mt-1 uppercase opacity-50">
              Encryption Active
            </p>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-5 bg-slate-900/80 border-t border-slate-700/70 flex items-center space-x-4"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            autoFocus
            placeholder="Type your secure message..."
            className="w-full bg-slate-950 border border-slate-700 rounded-[1.2rem] px-5 py-3.5 text-sm font-bold text-slate-100 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
        </div>
        <button
          disabled={!newMessage.trim() || sending}
          className="p-4 bg-cyan-600 text-white rounded-[1.2rem] hover:bg-cyan-500 disabled:opacity-30 transition-all shadow-xl shadow-cyan-900/50 hover:-translate-y-0.5"
        >
          {sending ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default Chat;

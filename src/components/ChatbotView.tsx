import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Brain,
  Zap,
  FileText,
  Lightbulb,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isThinking?: boolean;
  modelUsed?: string;
}

interface ChatbotViewProps {
  contextData?: {
    totalWarga?: number;
    saldoKas?: number;
    totalAduan?: number;
    pendingAduan?: number;
    totalPengumuman?: number;
    totalKegiatan?: number;
    totalBarang?: number;
  };
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ contextData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: 'Halo! Saya **Asisten AI Integrated Sukamaju** powered by **Gemini AI**. Ada yang bisa saya bantu terkait layanan warga, administrasi RT/RW, pembuatan draf pengumuman, atau informasi kegiatan lingkungan hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.6-flash',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enableThinking, setEnableThinking] = useState(false);
  const [systemRole, setSystemRole] = useState<'GENERAL' | 'LEGAL' | 'CREATIVE'>('GENERAL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare payload for server API
      const historyPayload = newMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          enableThinking,
          systemRole,
          contextData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses pesan.');
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        text: data.text || 'Tidak ada respons dari AI.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isThinking: data.isThinking,
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Gagal terhubung ke layanan Gemini AI Server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat percakapan chat AI?')) {
      setMessages([
        {
          id: 'welcome-reset-' + Date.now(),
          role: 'model',
          text: 'Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan baru Anda.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'gemini-3.6-flash',
        },
      ]);
      setErrorMsg(null);
    }
  };

  // Helper renderer for simple Markdown formatting
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold replacement regex
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-2">
            <span className="text-sky-600 font-bold">•</span>
            <span>{lineContent}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-2">
            <span className="font-mono text-sky-600 font-bold">{line.trim().split('.')[0]}.</span>
            <span>{lineContent}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return <p key={idx} className="my-0.5 leading-relaxed">{lineContent}</p>;
    });
  };

  const quickPrompts = [
    {
      icon: MessageSquare,
      label: 'Ringkasan Warga',
      query: 'Berapa total warga Sukamaju dan bagaimana komposisi demografinya saat ini?',
    },
    {
      icon: FileText,
      label: 'Draf Surat Pengantar',
      query: 'Tolong buatkan draf Surat Pengantar RT/RW resmi untuk pembuatan KTP baru warga.',
    },
    {
      icon: Lightbulb,
      label: 'Ide Acara 17 Agustus',
      query: 'Berikan 5 ide lomba dan acara peringatan 17 Agustus yang seru dan hemat biaya untuk Karang Taruna.',
    },
    {
      icon: HelpCircle,
      label: 'Panduan Bank Sampah',
      query: 'Bagaimana alur dan syarat warga untuk menjadi nasabah Bank Sampah Sukamaju?',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white border-2 border-white shadow-md shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Asisten AI Integrated Sukamaju</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-400 text-slate-900 uppercase font-mono">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Pusat Bantuan Cerdas RT/RW: Layanan Administrasi, Draf Legal, Regulasi, & Inovasi Acara Warga.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Bersihkan riwayat percakapan"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bersihkan Chat
            </button>
          </div>
        </div>

        {/* Mode & Persona Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-700/80 pt-4 text-xs">
          {/* Mode Model Selector */}
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-700/60">
            <span className="font-mono text-[10px] uppercase text-slate-400 font-bold shrink-0">Modus AI:</span>
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={() => setEnableThinking(false)}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  !enableThinking
                    ? 'bg-sky-500 text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Flash (Respon Cepat)
              </button>
              <button
                onClick={() => setEnableThinking(true)}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  enableThinking
                    ? 'bg-purple-500 text-white shadow-xs font-extrabold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Brain className="w-3.5 h-3.5" /> Thinking Mode (Gemini 3.1 Pro)
              </button>
            </div>
          </div>

          {/* Role Persona Selector */}
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-700/60">
            <span className="font-mono text-[10px] uppercase text-slate-400 font-bold shrink-0">Peran AI:</span>
            <select
              value={systemRole}
              onChange={(e) => setSystemRole(e.target.value as any)}
              className="w-full bg-slate-900 text-slate-100 font-bold border border-slate-700 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-sky-400"
            >
              <option value="GENERAL">🏢 Asisten Layanan RT/RW & Umum</option>
              <option value="LEGAL">📜 Konsultan Legal & Draf Surat Menyurat</option>
              <option value="CREATIVE">💡 Inovator Acara & Kegiatan Warga</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Chat Thread Window */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] overflow-hidden flex flex-col h-[580px]">
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border-2 shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white border-blue-700'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble Box */}
                <div className="space-y-1 group">
                  <div className="flex items-center gap-2 px-1 text-[10px] font-mono font-semibold text-slate-500">
                    <span>{isUser ? 'Anda' : 'Asisten AI Sukamaju'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.isThinking && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold text-[9px] flex items-center gap-1">
                        <Brain className="w-2.5 h-2.5" /> High Thinking
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl border-2 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-slate-900 text-white border-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-800 border-slate-200 rounded-tl-none font-medium'
                    }`}
                  >
                    {isUser ? <p className="whitespace-pre-wrap">{msg.text}</p> : renderFormattedText(msg.text)}
                  </div>

                  {/* Copy Button for Bot Messages */}
                  {!isUser && (
                    <div className="flex items-center gap-2 pt-0.5 px-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-[10px] text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> <span className="text-emerald-600">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Salin Teks
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center border-2 border-blue-700 shadow-xs shrink-0 animate-bounce">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border-2 border-slate-200 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-600 font-semibold flex items-center gap-3 shadow-xs">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping delay-150" />
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping delay-300" />
                </div>
                <span>
                  {enableThinking
                    ? 'AI Gemini 3.1 Pro sedang melakukan analisis mendalam (High Thinking Mode)...'
                    : 'AI sedang menyusun tanggapan...'}
                </span>
              </div>
            </div>
          )}

          {/* Error Card */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold hover:bg-rose-700 transition cursor-pointer shrink-0 flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" /> Coba Lagi
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase shrink-0">Tanya Cepat:</span>
          {quickPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-white hover:bg-sky-50 hover:text-sky-700 text-slate-700 border border-slate-300 rounded-xl font-bold whitespace-nowrap text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-sky-600" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Bottom Input Controls */}
        <div className="p-4 bg-white border-t-2 border-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                enableThinking
                  ? 'Ketik pertanyaan kompleks untuk diteliti oleh Gemini High Thinking Mode...'
                  : 'Ketik pertanyaan mengenai layanan warga, administrasi, atau ide kegiatan...'
              }
              disabled={isLoading}
              className="flex-1 bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-slate-900 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border-2 border-slate-900 transition shadow-[2px_2px_0px_0px_#0f172a] disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" /> Kirim
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Data terenkripsi & diproses server terisolasi.
            </span>
            <span>
              Model: <strong className="text-slate-700">{enableThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash'}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

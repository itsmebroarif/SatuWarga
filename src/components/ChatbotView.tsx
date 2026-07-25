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
  Key,
  Settings,
  X,
  ExternalLink,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

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

const STORAGE_KEY_API_CODE = 'satuwarga_custom_gemini_api_key';

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

  // Custom API Key / Code State
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_API_CODE) || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKeyInput, setTempApiKeyInput] = useState('');
  const [showKeySecret, setShowKeySecret] = useState(false);
  const [savedKeyNotification, setSavedKeyNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempApiKeyInput.trim();
    setCustomApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem(STORAGE_KEY_API_CODE, cleanKey);
    } else {
      localStorage.removeItem(STORAGE_KEY_API_CODE);
    }
    setSavedKeyNotification(true);
    setTimeout(() => setSavedKeyNotification(false), 3000);
    setIsApiKeyModalOpen(false);
  };

  const handleClearApiKey = () => {
    setCustomApiKey('');
    setTempApiKeyInput('');
    localStorage.removeItem(STORAGE_KEY_API_CODE);
    setIsApiKeyModalOpen(false);
  };

  // Direct Client-Side Gemini Execution Helper
  const executeClientSideGemini = async (
    apiKey: string,
    historyPayload: { role: 'user' | 'model'; text: string }[]
  ) => {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const modelName = enableThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash';

    let roleInstruction =
      "Anda adalah Asisten Digital Cerdas AI Sukamaju ('SatuWarga Assistant'). Tugas Anda membantu warga dan pengurus RT/RW dalam memberikan informasi administrasi, layanan warga, kegiatan, kas keuangan, dan aturan kemasyarakatan di Indonesia secara ramah, sopan, ringkas, dan akurat.";

    if (systemRole === 'LEGAL') {
      roleInstruction =
        'Anda adalah Asisten Legal & Draf Administrasi RT/RW Sukamaju. Anda ahli dalam membimbing warga serta menyusun draf pengumuman resmi, surat keputusan RT/RW, proposal kegiatan warga, dan regulasi ketertiban lingkungan sesuai aturan di Indonesia.';
    } else if (systemRole === 'CREATIVE') {
      roleInstruction =
        'Anda adalah Inovator & Perencana Acara Warga Sukamaju. Anda bertugas memberikan ide-ide kreatif kegiatan warga (PKK, Karang Taruna, Posyandu, 17 Agustus), lomba warga, ide pengelolaan Bank Sampah, dan konsep kerja bakti lingkungan yang menyenangkan.';
    }

    let fullSystemInstruction = roleInstruction;
    if (contextData) {
      fullSystemInstruction += `\n\n--- KONTEKS DATA REAL LINGKUNGAN SUKAMAJU SAAT INI ---
(Gunakan data ini jika warga/pengurus menanyakan statistik atau kondisi wilayah):
- Total Warga Terdaftar: ${contextData.totalWarga ?? 0} Jiwa
- Saldo Kas RW: Rp ${(contextData.saldoKas ?? 0).toLocaleString('id-ID')}
- Total Aduan Warga: ${contextData.totalAduan ?? 0} (Belum Selesai / Pending: ${contextData.pendingAduan ?? 0})
- Total Pengumuman Aktif: ${contextData.totalPengumuman ?? 0}
- Total Kegiatan Terjadwal: ${contextData.totalKegiatan ?? 0}
- Total Barang Inventaris: ${contextData.totalBarang ?? 0} Unit`;
    }

    const formattedContents = historyPayload.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const config: any = {
      systemInstruction: fullSystemInstruction,
    };

    if (enableThinking && modelName === 'gemini-3.1-pro-preview') {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: formattedContents,
      config,
    });

    return {
      text: response.text || 'Maaf, AI tidak dapat menghasilkan tanggapan.',
      modelUsed: modelName,
      isThinking: Boolean(enableThinking),
    };
  };

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

    const historyPayload = newMessages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      // 1. Prioritize User's Personal API Code if provided
      if (customApiKey.trim().length > 0) {
        const result = await executeClientSideGemini(customApiKey.trim(), historyPayload);
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          role: 'model',
          text: result.text,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isThinking: result.isThinking,
          modelUsed: `${result.modelUsed} (Client Key)`,
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      // 2. Otherwise call backend API (/api/chat)
      let response: Response;
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyPayload,
            enableThinking,
            systemRole,
            contextData,
          }),
        });
      } catch (networkErr: any) {
        throw new Error(
          'Tidak dapat terhubung ke server backend (/api/chat). Jika menggunakan Vercel Hosting Statis, silakan masukkan API Code / GEMINI_API_KEY pribadi Anda di tombol "Set API Code".'
        );
      }

      // Safe check content-type before calling response.json() to prevent SyntaxError: Unexpected token 'T'
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.warn('Backend returned non-JSON response:', textResponse.slice(0, 200));

        // If hosted on Vercel static without server function, prompt user clearly to input API Code
        throw new Error(
          'Endpoint server (/api/chat) mengembalikan format HTML (misal Vercel 404 / Hosting Statis). Silakan klik tombol "Set API Code" di pojok kanan atas untuk memasukkan Gemini API Key pribadi Anda agar chatbot dapat berjalan langsung di Vercel.'
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada layanan AI.');
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
      setErrorMsg(
        err.message ||
          'Gagal terhubung ke layanan Gemini AI. Silakan masukkan API Code pribadi Anda di menu pengaturan.'
      );
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
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black tracking-tight">Asisten AI Integrated Sukamaju</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-400 text-slate-900 uppercase font-mono">
                  Gemini AI
                </span>
                {customApiKey ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 font-mono">
                    <Key className="w-3 h-3" /> API Code Personal
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-200 flex items-center gap-1 font-mono">
                    <Server className="w-3 h-3 text-sky-300" /> Server Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Pusat Bantuan Cerdas RT/RW: Layanan Administrasi, Draf Legal, Regulasi, & Inovasi Acara Warga.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => {
                setTempApiKeyInput(customApiKey);
                setIsApiKeyModalOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                customApiKey
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-xs'
                  : 'bg-sky-600/80 hover:bg-sky-500 text-white border-sky-400'
              }`}
              title="Atur GEMINI API Key / Code Pribadi"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{customApiKey ? 'API Code Aktif' : 'Set API Code'}</span>
            </button>

            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Bersihkan riwayat percakapan"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bersihkan
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

      {/* Saved Notification */}
      {savedKeyNotification && (
        <div className="bg-emerald-100 border-2 border-emerald-500 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan Kunci API Code berhasil disimpan di memori browser Anda! Chatbot siap digunakan secara mandiri.</span>
        </div>
      )}

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
            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 text-xs space-y-2 shadow-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{errorMsg}</p>
                  <p className="text-[11px] text-rose-700 font-medium">
                    Solusi: Jika Anda meletakkan web di Vercel atau hosting statis, klik tombol <strong>"Set API Code"</strong> di atas untuk memasukkan Kunci Gemini API Anda sendiri secara gratis.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setTempApiKeyInput(customApiKey);
                    setIsApiKeyModalOpen(true);
                  }}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg border border-amber-600 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3 h-3" /> Input API Code Sekarang
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition cursor-pointer text-[11px] flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Coba Lagi
                </button>
              </div>
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
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {customApiKey
                ? 'Mode Direct Client: API Code Anda tersimpan lokal & aman.'
                : 'Mode Server Fullstack (Cloud Run).'}
            </span>
            <span>
              Model: <strong className="text-slate-700">{enableThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CONFIGURATION SET API CODE (GEMINI API KEY PRIBADI)                */}
      {/* ========================================================================= */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-900 max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold border-2 border-slate-900">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Pengaturan API Code (Gemini API Key)</h3>
                  <p className="text-xs text-slate-500 font-medium">Penggunaan Kunci API Pribadi untuk Hosting Statis / Vercel</p>
                </div>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-2 text-amber-900 font-medium">
                <p className="font-bold flex items-center gap-1.5 text-xs text-amber-950">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" /> Mengapa Membutuhkan API Code Pribadi?
                </p>
                <p className="text-[11px] leading-relaxed">
                  Jika aplikasi ini di-deploy di platform statis seperti <strong>Vercel / GitHub Pages</strong>, server backend tidak berjalan. Dengan memasukkan API Code sendiri, Chatbot Gemini AI akan berjalan 100% langsung dari browser Anda secara gratis tanpa batasan server!
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-amber-950 hover:underline pt-1"
                >
                  Dapatkan Gemini API Key Gratis di Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Kunci API Code (GEMINI_API_KEY)</label>
                <div className="relative">
                  <input
                    type={showKeySecret ? 'text' : 'password'}
                    value={tempApiKeyInput}
                    onChange={(e) => setTempApiKeyInput(e.target.value)}
                    placeholder="Contoh: AIzaSyD..."
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-3 pr-20 py-2.5 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeySecret(!showKeySecret)}
                    className="absolute right-2 top-2 px-2 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    {showKeySecret ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Kunci ini disimpan hanya di LocalStorage browser Anda dan tidak pernah dikirim ke server pihak ketiga manapun.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                {customApiKey ? (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Hapus API Code
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApiKeyModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
                  >
                    Simpan API Code
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


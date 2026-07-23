import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, User } from 'lucide-react';
import { UserRole } from '../types';

interface AIAssistantModalProps {
  currentRole: UserRole;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ currentRole, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'AI',
      text: `Halo! Saya AI Asisten **SatuWarga.id**. Ada yang bisa saya bantu terkait administrasi RT/RW, pembuatan surat, informasi iuran, atau regulasi warga? (Role aktif: ${currentRole})`,
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'USER',
      text: inputPrompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptText = inputPrompt;
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          role: currentRole,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'AI',
        text: data.reply || 'Maaf, terjadi kendala saat memproses permintaan.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      const errorMsg: Message = {
        id: 'ai-err-' + Date.now(),
        sender: 'AI',
        text: 'Sistem mengalami gangguan koneksi. Mohon coba beberapa saat lagi.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                AI Asisten SatuWarga <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Bantuan Administrasi Warga & Pengurus</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'AI' && (
                <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3 rounded-lg max-w-[85%] leading-relaxed ${
                  m.sender === 'USER'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              {m.sender === 'USER' && (
                <div className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" /> Gemini AI sedang berpikir...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[10px]">
          <button
            onClick={() => setInputPrompt('Bagaimana cara mengajukan Surat Keterangan Usaha (SKU)?')}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 hover:bg-slate-200 whitespace-nowrap"
          >
            Syarat SKU
          </button>
          <button
            onClick={() => setInputPrompt('Berapa nominal iuran kebersihan RT bulan ini?')}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 hover:bg-slate-200 whitespace-nowrap"
          >
            Iuran Kebersihan
          </button>
          <button
            onClick={() => setInputPrompt('Bagaimana aturan jadwal ronda malam untuk warga baru?')}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 hover:bg-slate-200 whitespace-nowrap"
          >
            Aturan Ronda
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ketik pertanyaan terkait RT/RW di sini..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-1 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" /> Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

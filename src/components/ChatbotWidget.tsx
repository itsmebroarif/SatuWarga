import React, { useState } from 'react';
import { Sparkles, X, Bot, ChevronUp, MessageSquare } from 'lucide-react';
import { ChatbotView } from './ChatbotView';

interface ChatbotWidgetProps {
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

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white px-4 py-3 rounded-full border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5 animate-spin" />}
          </div>
          <span className="font-extrabold text-xs tracking-tight">AI Sukamaju</span>
          <span className="hidden sm:inline bg-sky-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
            Gemini
          </span>
        </button>
      </div>

      {/* Slide-over Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-slate-900 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl h-[88vh] sm:h-[650px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-3.5 border-b-2 border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-slate-950 font-bold flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider text-white">Asisten AI Integrated Sukamaju</h3>
                  <p className="text-[10px] text-sky-300 font-mono">Powered by Gemini 3.6 Flash & 3.1 Pro Thinking Mode</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with ChatbotView */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-slate-100/50">
              <ChatbotView contextData={contextData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

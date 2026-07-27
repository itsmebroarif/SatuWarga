import React, { useState } from 'react';
import { Coffee, Heart, ExternalLink, Sparkles, X, Check, Copy, MessageCircleHeart } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TRAKTEER_URL = 'https://trakteer.id/itsmebroarif/tip?open=true';

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(TRAKTEER_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-amber-400 text-slate-950 p-5 flex items-center justify-between border-b-4 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-amber-600 flex items-center justify-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <Coffee className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                Dukung / Traktir Kopi ☕
              </h2>
              <p className="text-xs font-bold text-slate-900">
                Apresiasi & Dukungan Pengembangan Aplikasi E-REKAP
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <MessageCircleHeart className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Saran, Masukan & Apresiasi Warga</span>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-slate-700">
              Aplikasi ini dikembangkan secara penuh untuk mempermudah tata kelola warga RT/RW, Karang Taruna, dan administrasi kependudukan. Saya menerima donation untuk saran dan masukan untuk perkembangan aplikasi ini agar makin berkembang, lebih handal, dan bermanfaat bagi masyarakat luas!
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-900">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Link Resmi Trakteer:</span>
              <button
                onClick={handleCopyLink}
                className="text-amber-700 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Link
                  </>
                )}
              </button>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 break-all">
              {TRAKTEER_URL}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs border border-slate-400 transition cursor-pointer"
            >
              Lain Kali
            </button>

            <a
              href={TRAKTEER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Coffee className="w-4 h-4 stroke-[2.5]" />
              <span>Traktir Kopi di Trakteer.id</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, Heart, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-6 border-t-2 border-slate-900 bg-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 bg-[#0056b3] text-white flex items-center justify-center font-black text-xs rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
              SW
            </div>
            <span className="font-extrabold text-slate-900 text-sm">
              Satu<span className="text-[#0056b3]">Warga.id</span> — Community ERP
            </span>
            <span className="text-[10px] bg-emerald-300 text-slate-900 font-extrabold px-2 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
              Versi 1.0
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Platform Tata Kelola Warga Digital RT 01-10 / RW 01-30 Sukamaju
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-900 rounded-full text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            <Shield className="w-3.5 h-3.5 text-emerald-600" /> AES-256 E2E Encryption
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-slate-900 rounded-full text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> Standar Permendagri No. 18/2018
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
        <p>© {new Date().getFullYear()} SatuWarga.id. Pengelolaan Mandiri Pengurus RT/RW.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-900 cursor-pointer">Panduan Pengguna</span>
          <span className="hover:text-slate-900 cursor-pointer">Pernyataan Privasi</span>
          <span className="hover:text-slate-900 cursor-pointer">Bantuan RT/RW</span>
        </div>
      </div>
    </footer>
  );
};

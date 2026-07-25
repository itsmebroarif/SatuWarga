import React from 'react';
import { Shield, Heart, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto pt-5 border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#000000] space-y-3 transition-colors">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 bg-[#0056b3] text-white flex items-center justify-center font-black text-xs rounded-lg border border-slate-900 dark:border-slate-700 shadow-[1px_1px_0px_0px_#0f172a]">
              SK
            </div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              Sukamaju <span className="text-[#0056b3] dark:text-blue-400">ERP</span> — Community Operating System
            </span>
            <span className="text-[10px] bg-emerald-300 dark:bg-emerald-500 text-slate-900 dark:text-slate-950 font-extrabold px-2 py-0.5 rounded-full border border-slate-900 dark:border-slate-950 shadow-[1px_1px_0px_0px_#0f172a]">
              Versi 1.0
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Platform Tata Kelola Warga Digital RT 01-10 / RW 01-30 Sukamaju
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-full text-xs font-bold text-slate-900 dark:text-slate-200 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000]">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> AES-256 E2E Encryption
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/80 border border-slate-900 dark:border-amber-700/80 rounded-full text-xs font-bold text-slate-900 dark:text-amber-300 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000]">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Standar Permendagri No. 18/2018
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} Sukamaju ERP. Pengelolaan Mandiri Pengurus RT/RW Sukamaju.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors">Panduan Pengguna</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors">Pernyataan Privasi</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors">Bantuan RT/RW</span>
        </div>
      </div>
    </footer>
  );
};

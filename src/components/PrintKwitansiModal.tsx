import React from 'react';
import { TagihanIuran } from '../types';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface PrintKwitansiModalProps {
  tagihan: TagihanIuran;
  onClose: () => void;
}

export const PrintKwitansiModal: React.FC<PrintKwitansiModalProps> = ({ tagihan, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4 print:p-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-600" /> Cetak Kwitansi Pembayaran Iuran
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded font-semibold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE KWITANSI OFFICIAL FORMAT */}
        <div className="border-2 border-slate-900 p-5 rounded space-y-4 bg-amber-50/20 font-serif">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <div>
              <h3 className="font-bold text-base uppercase text-slate-900 tracking-wider">KWITANSI PEMBAYARAN IURAN</h3>
              <p className="text-[10px] font-sans text-slate-600">RT 01 / RW 05 - Kelurahan Graha Warga</p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="bg-emerald-800 text-white font-bold px-2 py-0.5 rounded text-[10px]">LUNAS</span>
              <p className="text-[10px] text-slate-500 mt-1">No: {tagihan.noKwitansi || 'KW-202607-R01'}</p>
            </div>
          </div>

          <div className="text-xs space-y-2 font-sans">
            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
              <span className="text-slate-600 font-semibold">Telah Diterima Dari:</span>
              <span className="font-bold text-slate-900">{tagihan.wargaNama} ({tagihan.nomorRumah})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
              <span className="text-slate-600 font-semibold">Uang Sejumlah:</span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                Rp {tagihan.jumlah.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
              <span className="text-slate-600 font-semibold">Untuk Pembayaran:</span>
              <span className="font-medium text-slate-800">{tagihan.jenisIuran} - {tagihan.bulanTahun}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dashed border-slate-300">
              <span className="text-slate-600 font-semibold">Metode Bayar:</span>
              <span className="font-mono font-bold text-purple-700">{tagihan.metodeBayar || 'QRIS'}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> E-Receipt Verified
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] text-slate-500">Penerima / Bendahara RT</p>
              <p className="font-bold underline text-slate-900 pt-4">Bendahara RT 01</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

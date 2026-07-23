import React from 'react';
import { Surat } from '../types';
import { X, Printer, ShieldCheck, CheckCircle } from 'lucide-react';

interface PrintSuratModalProps {
  surat: Surat;
  onClose: () => void;
}

export const PrintSuratModal: React.FC<PrintSuratModalProps> = ({ surat, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 print:p-0 print:shadow-none print:m-0 print:w-full">
        {/* Top Actions (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">Cetak Kop Surat Resmi RT/RW</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-1.5 rounded font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / Download PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* OFFICIAL KOP SURAT INDONESIA FORMAT */}
        <div id="surat-printable" className="p-4 sm:p-8 space-y-6 font-serif border border-slate-300 print:border-none bg-white">
          {/* Header Kop Surat */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-3 space-y-1">
            <h3 className="font-bold text-base sm:text-lg tracking-widest uppercase text-slate-900">
              RUKUN TETANGGA {surat.rt} / RUKUN WARGA {surat.rw}
            </h3>
            <h4 className="font-bold text-sm sm:text-base tracking-wider uppercase text-slate-800">
              DESA / KELURAHAN SUKAMAJU
            </h4>
            <p className="text-xs font-sans text-slate-600 italic">
              Sekretariat: Jl. Graha Warga Utama No. 1, Telp/WA: 0812-9876-5432, Kode Pos 17123
            </p>
          </div>

          {/* Letter Title & Number */}
          <div className="text-center space-y-1 pt-2">
            <h2 className="font-bold text-base sm:text-lg uppercase underline tracking-wider text-slate-900">
              {surat.jenisSurat}
            </h2>
            <p className="font-mono text-xs text-slate-700">Nomor: {surat.nomorSurat}</p>
          </div>

          {/* Opening Body */}
          <div className="text-xs sm:text-sm text-slate-800 space-y-3 leading-relaxed font-sans">
            <p>
              Yang bertanda tangan di bawah ini Ketua Rukun Tetangga {surat.rt} / Rukun Warga {surat.rw} Kelurahan Graha Warga, dengan ini menerangkan bahwa:
            </p>

            <table className="w-full text-xs sm:text-sm my-3 font-sans">
              <tbody>
                <tr>
                  <td className="w-36 py-1 font-semibold">Nama Lengkap</td>
                  <td className="w-4 py-1">:</td>
                  <td className="py-1 font-bold">{surat.namaWarga}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">NIK</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-mono">{surat.nik}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Alamat Domisili</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{surat.alamatWarga}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Keperluan</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-medium text-slate-900">{surat.keperluan}</td>
                </tr>
              </tbody>
            </table>

            <p>
              Demikian Surat Keterangan / Pengantar ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* Signature & QR Stamp Footer */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs font-sans gap-4">
            <div className="space-y-1">
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-bold">Ketua RW {surat.rw}</p>
              <div className="h-16 flex items-center justify-center my-2">
                <div className="w-20 h-20 border-2 border-dashed border-emerald-600 rounded-full flex flex-col items-center justify-center p-1 text-emerald-700 text-[9px] font-bold">
                  <span>STEMPEL RW</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600 my-0.5" />
                  <span>TERVERIFIKASI</span>
                </div>
              </div>
              <p className="font-bold underline text-slate-900">Drs. Hendra Wijaya</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-600">Graha Warga, {surat.tglDisetujui || new Date().toISOString().slice(0, 10)}</p>
              <p className="font-bold">Ketua RT {surat.rt}</p>
              <div className="h-16 flex items-center justify-center my-2">
                <div className="border border-slate-300 p-1.5 rounded bg-slate-50 flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-900 text-white font-mono font-bold text-[8px] flex items-center justify-center p-1 text-center">
                    QR VERIFY
                  </div>
                  <div className="text-[8px] text-left font-mono">
                    <p className="font-bold text-emerald-700">E-SIGNATURE RT</p>
                    <p>{surat.qrCodeHash}</p>
                  </div>
                </div>
              </div>
              <p className="font-bold underline text-slate-900">H. Ahmad Dahlan</p>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-sans">
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Digital Document Validated by Sukamaju ERP
            </span>
            <span className="font-mono">Hash: {surat.qrCodeHash}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

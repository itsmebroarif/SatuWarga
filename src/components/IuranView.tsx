import React, { useState } from 'react';
import {
  Receipt,
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  MessageSquare,
  Plus,
  Send,
  X,
  CreditCard,
  Download,
} from 'lucide-react';
import { TagihanIuran } from '../types';
import { PrintKwitansiModal } from './PrintKwitansiModal';
import { exportToCSV } from '../utils/csvExport';

interface IuranViewProps {
  tagihanList: TagihanIuran[];
  onToggleStatusIuran: (id: string, status: 'LUNAS' | 'BELUM_LUNAS') => void;
  onAddTagihan: (t: TagihanIuran) => void;
}

export const IuranView: React.FC<IuranViewProps> = ({
  tagihanList = [],
  onToggleStatusIuran,
  onAddTagihan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // QRIS Modal State
  const [qrisTagihan, setQrisTagihan] = useState<TagihanIuran | null>(null);

  // Kwitansi Modal State
  const [kwitansiTagihan, setKwitansiTagihan] = useState<TagihanIuran | null>(null);

  // WhatsApp Reminder Modal State
  const [waModalTagihan, setWaModalTagihan] = useState<TagihanIuran | null>(null);

  const filteredTagihan = tagihanList.filter((t) => {
    const matchesSearch =
      t.wargaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.jenisIuran.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTagihan = tagihanList.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalLunas = tagihanList
    .filter((t) => t.status === 'LUNAS')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalBelumLunas = totalTagihan - totalLunas;

  const exportTagihanCsv = () => {
    const headers = [
      'ID Tagihan',
      'Nama Warga',
      'Nomor Rumah',
      'Bulan & Tahun',
      'Jenis Iuran',
      'Nominal Tagihan (Rp)',
      'Status Pembayaran',
      'Metode Bayar',
      'Tanggal Bayar',
    ];
    const rows = filteredTagihan.map((t) => [
      t.id,
      t.wargaNama,
      t.nomorRumah,
      t.bulanTahun,
      t.jenisIuran,
      t.jumlah,
      t.status,
      t.metodePembayaran || '-',
      t.tglBayar || '-',
    ]);
    exportToCSV('Data_Tagihan_Iuran_Warga_Sukamaju', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Modul Iuran Warga & Tagihan Otomatis
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengelolaan Iuran Kebersihan, Keamanan, Kas Rutin RT, dan Pembayaran via QRIS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportTagihanCsv}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Export CSV
            </button>
            <button
              onClick={() => {
                const newT: TagihanIuran = {
                  id: 'iuran-' + Date.now(),
                  nomorRumah: 'A-02',
                  wargaNama: 'Warga Rumah A-02',
                  bulanTahun: 'Juli 2026',
                  jenisIuran: 'Kebersihan & Sampah',
                  jumlah: 50000,
                  status: 'BELUM_LUNAS',
                };
                onAddTagihan(newT);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Generate Tagihan Masal
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Target Iuran Bulan Ini</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Rp {totalTagihan.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
            <span className="text-[10px] font-semibold text-emerald-800 uppercase">Terkumpul (Lunas)</span>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">
              Rp {totalLunas.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-rose-50 p-3 rounded border border-rose-200">
            <span className="text-[10px] font-semibold text-rose-800 uppercase">Belum Lunas (Tunggakan)</span>
            <div className="text-sm font-bold text-rose-700 mt-0.5">
              Rp {totalBelumLunas.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nama Warga, No. Rumah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status Bayar:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700"
          >
            <option value="ALL">Semua Status</option>
            <option value="LUNAS">Lunas Only</option>
            <option value="BELUM_LUNAS">Belum Lunas Only</option>
          </select>
        </div>
      </div>

      {/* Tagihan Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-3 border-b border-slate-800">Rumah</th>
                <th className="p-3 border-b border-slate-800">Nama Warga / Kepala Rumah</th>
                <th className="p-3 border-b border-slate-800">Jenis Iuran</th>
                <th className="p-3 border-b border-slate-800">Periode</th>
                <th className="p-3 border-b border-slate-800">Jumlah</th>
                <th className="p-3 border-b border-slate-800">Status Bayar</th>
                <th className="p-3 border-b border-slate-800 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTagihan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold text-purple-700">{item.nomorRumah}</td>
                  <td className="p-3 font-semibold text-slate-900">{item.wargaNama}</td>
                  <td className="p-3 text-slate-800 font-medium">{item.jenisIuran}</td>
                  <td className="p-3 text-slate-600 font-mono text-[11px]">{item.bulanTahun}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    Rp {item.jumlah.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3">
                    {item.status === 'LUNAS' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> LUNAS
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> BELUM LUNAS
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    {item.status === 'BELUM_LUNAS' ? (
                      <>
                        <button
                          onClick={() => setQrisTagihan(item)}
                          className="bg-purple-700 hover:bg-purple-800 text-white text-[11px] px-2.5 py-1 rounded font-medium inline-flex items-center gap-1 shadow-2xs"
                        >
                          <QrCode className="w-3 h-3" /> QRIS
                        </button>
                        <button
                          onClick={() => onToggleStatusIuran(item.id, 'LUNAS')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1 rounded font-medium shadow-2xs"
                        >
                          Tandai Lunas
                        </button>
                        <button
                          onClick={() => setWaModalTagihan(item)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] px-2 py-1 rounded"
                          title="Kirim Reminder WA"
                        >
                          <MessageSquare className="w-3 h-3 text-green-600" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setKwitansiTagihan(item)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] px-2.5 py-1 rounded font-medium inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3 text-slate-600" /> Kwitansi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QRIS MODAL GENERATOR */}
      {qrisTagihan && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-sm w-full p-5 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-purple-700" /> Kode QRIS Pembayaran Resmi
              </span>
              <button onClick={() => setQrisTagihan(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-48 h-48 bg-slate-900 mx-auto rounded p-3 flex flex-col items-center justify-center text-white border-4 border-slate-900">
                <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-white rounded">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-slate-100'
                      } rounded-xs`}
                    />
                  ))}
                </div>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                QRIS RT 01 GRAHA WARGA
              </p>
              <p className="text-xs font-mono font-bold text-emerald-700">
                Rp {qrisTagihan.jumlah.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-slate-500">
                Dapat discan menggunakan GoPay, OVO, Dana, ShopeePay, BCA, BSI, Mandiri, dll.
              </p>
            </div>

            <button
              onClick={() => {
                onToggleStatusIuran(qrisTagihan.id, 'LUNAS');
                setQrisTagihan(null);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded font-semibold shadow-xs"
            >
              Konfirmasi Pembayaran QRIS Sukses
            </button>
          </div>
        </div>
      )}

      {/* WHATSAPP REMINDER DRAFT MODAL */}
      {waModalTagihan && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-green-600" /> Draft Pesan Pengingat WhatsApp
              </span>
              <button onClick={() => setWaModalTagihan(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-100 rounded border border-slate-300 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {`Yth. Bpk/Ibu ${waModalTagihan.wargaNama} (${waModalTagihan.nomorRumah}),

Diberitahukan bahwa Tagihan ${waModalTagihan.jenisIuran} periode ${waModalTagihan.bulanTahun} sebesar Rp ${waModalTagihan.jumlah.toLocaleString('id-ID')} belum tercatat lunas.

Pembayaran dapat ditransfer via QRIS RT 01 atau diserahkan secara tunai kepada Bendahara RT.

Terima kasih atas partisipasi Bpk/Ibu demi kenyamanan lingkungan bersama.
- Pengurus RT 01 / RW 05`}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setWaModalTagihan(null)}
                className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded font-medium"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Yth. Bpk/Ibu ${waModalTagihan.wargaNama} (${waModalTagihan.nomorRumah}), Tagihan ${waModalTagihan.jenisIuran} sebesar Rp ${waModalTagihan.jumlah.toLocaleString('id-ID')} belum lunas.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3.5 py-1.5 rounded font-semibold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Buka WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PRINT KWITANSI MODAL */}
      {kwitansiTagihan && (
        <PrintKwitansiModal tagihan={kwitansiTagihan} onClose={() => setKwitansiTagihan(null)} />
      )}
    </div>
  );
};

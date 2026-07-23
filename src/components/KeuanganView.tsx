import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  X,
  Upload,
} from 'lucide-react';
import { TransaksiKas, UnitCategory } from '../types';

interface KeuanganViewProps {
  kasList: TransaksiKas[];
  onAddKas: (kas: TransaksiKas) => void;
  onApproveKas: (id: string) => void;
}

export const KeuanganView: React.FC<KeuanganViewProps> = ({ kasList = [], onAddKas, onApproveKas }) => {
  const [activeUnit, setActiveUnit] = useState<UnitCategory>('RT');
  const [searchTerm, setSearchTerm] = useState('');
  const [jenisFilter, setJenisFilter] = useState<'ALL' | 'PEMASUKAN' | 'PENGELUARAN'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenis, setJenis] = useState<'PEMASUKAN' | 'PENGELUARAN'>('PEMASUKAN');
  const [kategori, setKategori] = useState('Iuran Rutin');
  const [jumlah, setJumlah] = useState<number>(100000);
  const [keterangan, setKeterangan] = useState('');

  const unitKasData = kasList.filter((k) => k.unitKas === activeUnit);

  const filteredKas = unitKasData.filter((k) => {
    const matchesSearch =
      k.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.keterangan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJenis = jenisFilter === 'ALL' || k.jenis === jenisFilter;
    return matchesSearch && matchesJenis;
  });

  const totalPemasukan = unitKasData
    .filter((k) => k.jenis === 'PEMASUKAN' && k.statusApproval === 'APPROVED')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalPengeluaran = unitKasData
    .filter((k) => k.jenis === 'PENGELUARAN' && k.statusApproval === 'APPROVED')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const saldoNetto = totalPemasukan - totalPengeluaran;

  const handleCreateKas = (e: React.FormEvent) => {
    e.preventDefault();
    const newKas: TransaksiKas = {
      id: 'kas-' + Date.now(),
      unitKas: activeUnit,
      jenis,
      kategori: kategori || 'Operasional',
      jumlah: Number(jumlah) || 0,
      tanggal: new Date().toISOString().slice(0, 10),
      keterangan: keterangan || 'Pencatatan kas resmi',
      statusApproval: 'APPROVED',
      createdBy: `Bendahara ${activeUnit}`,
    };
    onAddKas(newKas);
    setIsModalOpen(false);
    setKeterangan('');
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Unit Selector */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" /> Modul Keuangan & Kas Multi-Organisasi
            </h2>
            <p className="text-xs text-slate-500">
              Pengelolaan Arus Kas Terbuka & Transparan untuk RT, RW, PKK, Posyandu, Karang Taruna, dan Bank Sampah.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer border border-slate-700"
            >
              <Printer className="w-4 h-4 text-emerald-400" /> Cetak Laporan Kas (Print)
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Catat Transaksi Kas
            </button>
          </div>
        </div>

        {/* Unit Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
          {[
            { id: 'RT' as UnitCategory, label: 'Kas RT 01' },
            { id: 'RW' as UnitCategory, label: 'Kas RW 05' },
            { id: 'PKK' as UnitCategory, label: 'Kas PKK' },
            { id: 'POSYANDU' as UnitCategory, label: 'Kas Posyandu' },
            { id: 'KARANG_TARUNA' as UnitCategory, label: 'Karang Taruna' },
            { id: 'BANK_SAMPAH' as UnitCategory, label: 'Bank Sampah' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveUnit(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeUnit === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Pemasukan ({activeUnit})</span>
          <div className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            Rp {totalPemasukan.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Pengeluaran ({activeUnit})</span>
          <div className="text-xl font-bold text-rose-600 mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-5 h-5 text-rose-600" />
            Rp {totalPengeluaran.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Saldo Bersih ({activeUnit})</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            Rp {saldoNetto.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Kategori atau Keterangan Kas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Jenis:</span>
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700"
          >
            <option value="ALL">Semua Transaksi</option>
            <option value="PEMASUKAN">Pemasukan Only</option>
            <option value="PENGELUARAN">Pengeluaran Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-3 border-b border-slate-800">Tanggal</th>
                <th className="p-3 border-b border-slate-800">Jenis</th>
                <th className="p-3 border-b border-slate-800">Kategori</th>
                <th className="p-3 border-b border-slate-800">Keterangan</th>
                <th className="p-3 border-b border-slate-800 text-right">Jumlah (Rp)</th>
                <th className="p-3 border-b border-slate-800 text-right">Pencatat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKas.map((kas) => (
                <tr key={kas.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono text-slate-600">{kas.tanggal}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        kas.jenis === 'PEMASUKAN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {kas.jenis}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">{kas.kategori}</td>
                  <td className="p-3 text-slate-700 max-w-sm">{kas.keterangan}</td>
                  <td
                    className={`p-3 text-right font-mono font-bold ${
                      kas.jenis === 'PEMASUKAN' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {kas.jenis === 'PEMASUKAN' ? '+' : '-'} Rp {kas.jumlah.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-right text-slate-500 text-[11px]">{kas.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE KAS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Catat Transaksi ({activeUnit})</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKas} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jenis Transaksi *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setJenis('PEMASUKAN')}
                    className={`py-2 rounded font-bold text-xs border ${
                      jenis === 'PEMASUKAN'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    PEMASUKAN (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setJenis('PENGELUARAN')}
                    className={`py-2 rounded font-bold text-xs border ${
                      jenis === 'PENGELUARAN'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    PENGELUARAN (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kategori Kas</label>
                <input
                  type="text"
                  required
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                  placeholder="Iuran Warga / Operasional / Pembelian Alat"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nominal (Rp) *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={jumlah}
                  onChange={(e) => setJumlah(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan Transaksi</label>
                <textarea
                  rows={2}
                  required
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                  placeholder="Rincian penggunaan atau penerimaan dana"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded font-semibold shadow-xs"
                >
                  Simpan Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

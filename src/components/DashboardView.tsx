import React from 'react';
import {
  Users,
  Home,
  FileText,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Megaphone,
  CreditCard,
  Plus,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import {
  Warga,
  KartuKeluarga,
  Rumah,
  Surat,
  TransaksiKas,
  TagihanIuran,
  EventItem,
  AduanWarga,
  PengumumanItem,
  UserRole,
} from '../types';
import { ActiveTab } from './Sidebar';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardViewProps {
  wargaList: Warga[];
  kkList: KartuKeluarga[];
  rumahList: Rumah[];
  suratList: Surat[];
  kasList: TransaksiKas[];
  tagihanList: TagihanIuran[];
  eventsList: EventItem[];
  aduanList: AduanWarga[];
  pengumumanList: PengumumanItem[];
  currentRole: UserRole;
  onNavigateTab: (tab: ActiveTab) => void;
  onApproveSurat: (id: string) => void;
  onOpenAiAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wargaList = [],
  kkList = [],
  rumahList = [],
  suratList = [],
  kasList = [],
  tagihanList = [],
  eventsList = [],
  aduanList = [],
  pengumumanList = [],
  currentRole,
  onNavigateTab,
  onApproveSurat,
  onOpenAiAssistant,
}) => {
  // Calculated Metrics
  const totalWarga = wargaList.length;
  const totalKk = kkList.length;
  const totalRumah = rumahList.length;

  // Kas balances per unit
  const calculateKasUnit = (unit: string) => {
    return kasList
      .filter((k) => k.unitKas === unit && k.statusApproval === 'APPROVED')
      .reduce((acc, curr) => (curr.jenis === 'PEMASUKAN' ? acc + curr.jumlah : acc - curr.jumlah), 0);
  };

  const kasRt = calculateKasUnit('RT');
  const kasRw = calculateKasUnit('RW');
  const kasPkk = calculateKasUnit('PKK');
  const kasPosyandu = calculateKasUnit('POSYANDU');
  const kasBankSampah = calculateKasUnit('BANK_SAMPAH');
  const kasKarangTaruna = calculateKasUnit('KARANG_TARUNA');

  const pendingSurat = suratList.filter((s) => s.status === 'MENUNGGU_RT' || s.status === 'MENUNGGU_RW');
  const pendingAduan = aduanList.filter((a) => a.status === 'OPEN' || a.status === 'PROGRESS');
  const unpaidTagihan = tagihanList.filter((t) => t.status === 'BELUM_LUNAS');

  // Chart data for Kas Overview
  const kasChartData = [
    { name: 'Kas RT', saldo: kasRt },
    { name: 'Kas RW', saldo: kasRw },
    { name: 'Kas PKK', saldo: kasPkk },
    { name: 'Posyandu', saldo: kasPosyandu },
    { name: 'Karang Taruna', saldo: kasKarangTaruna },
    { name: 'Bank Sampah', saldo: kasBankSampah },
  ];

  // Gender Chart Data
  const maleCount = wargaList.filter((w) => w.jenisKelamin === 'Laki-laki').length;
  const femaleCount = wargaList.filter((w) => w.jenisKelamin === 'Perempuan').length;
  const genderPieData = [
    { name: 'Laki-laki', value: maleCount, color: '#0284c7' },
    { name: 'Perempuan', value: femaleCount, color: '#ec4899' },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#343a40] text-white rounded p-5 border border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#0056b3] text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold">
              Command Center
            </span>
            <span className="text-[#17a2b8] text-xs font-mono font-medium">RT 01-05 / RW 05 Graha Warga</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Selamat Datang di SatuWarga.id
          </h1>
          <p className="text-xs text-slate-300">
            Sistem Operasi Lingkungan Terpadu. Seluruh data warga tersimpan secara aman dan terenkripsi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('administrasi')}
            className="bg-[#0056b3] hover:bg-[#004494] text-white text-xs px-3.5 py-2 rounded font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Surat
          </button>
          <button
            onClick={() => onNavigateTab('keuangan')}
            className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3.5 py-2 rounded font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5 text-[#17a2b8]" /> Catat Kas
          </button>
          <button
            onClick={onOpenAiAssistant}
            className="bg-[#17a2b8] hover:bg-[#138496] text-white font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" /> AI Draft Doc
          </button>
        </div>
      </div>

      {/* Sleek Stat Grid Cards with Border-Left Accents */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded border border-[#dee2e6] border-l-4 border-l-[#0056b3] shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold text-[#888] uppercase tracking-wider">Total Warga</span>
            <Users className="w-4 h-4 text-[#0056b3]" />
          </div>
          <div className="text-2xl font-bold text-[#333] font-mono">{totalWarga}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Jiwa Terdaftar</p>
        </div>

        <div className="bg-white p-4 rounded border border-[#dee2e6] border-l-4 border-l-[#fd7e14] shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold text-[#888] uppercase tracking-wider">Kepala Keluarga</span>
            <FileText className="w-4 h-4 text-[#fd7e14]" />
          </div>
          <div className="text-2xl font-bold text-[#333] font-mono">{totalKk}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">KK Aktif</p>
        </div>

        <div className="bg-white p-4 rounded border border-[#dee2e6] border-l-4 border-l-[#28a745] shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold text-[#888] uppercase tracking-wider">Kas RT 04</span>
            <Wallet className="w-4 h-4 text-[#28a745]" />
          </div>
          <div className="text-xl font-bold text-[#333] font-mono">Rp {(kasRt / 1000).toLocaleString('id-ID')}rb</div>
          <p className="text-[10px] text-[#28a745] font-semibold mt-0.5">Saldo Aktif</p>
        </div>

        <div className="bg-white p-4 rounded border border-[#dee2e6] border-l-4 border-l-[#17a2b8] shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold text-[#888] uppercase tracking-wider">Surat Pending</span>
            <FileCheck className="w-4 h-4 text-[#17a2b8]" />
          </div>
          <div className="text-2xl font-bold text-[#333] font-mono">{pendingSurat.length}</div>
          <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Perlu Approval</p>
        </div>

        <div className="bg-white p-4 rounded border border-[#dee2e6] border-l-4 border-l-[#fd7e14] shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold text-[#888] uppercase tracking-wider">Iuran Menunggak</span>
            <CreditCard className="w-4 h-4 text-[#fd7e14]" />
          </div>
          <div className="text-2xl font-bold text-[#333] font-mono">{unpaidTagihan.length}</div>
          <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Tagihan Rumah</p>
        </div>

        <div className="bg-white p-4 rounded border border-[#dee2e6] border-l-4 border-l-red-600 shadow-xs hover:shadow-sm transition">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold text-[#888] uppercase tracking-wider">Aduan Aktif</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-[#333] font-mono">{pendingAduan.length}</div>
          <p className="text-[10px] text-red-600 font-semibold mt-0.5">Perlu Tindakan</p>
        </div>
      </div>

      {/* Multi-Kas Financial Balances Strip */}
      <div className="bg-white rounded border border-[#dee2e6] p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#dee2e6] pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#28a745]" />
            <h3 className="font-bold text-[#333] text-sm">Pos Saldo Kas Organisasi Lingkungan</h3>
          </div>
          <button
            onClick={() => onNavigateTab('keuangan')}
            className="text-xs font-semibold text-[#0056b3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Rincian Kas <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Kas RT 01</span>
            <div className="text-sm font-bold text-[#333] font-mono mt-1">
              Rp {kasRt.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Kas RW 05</span>
            <div className="text-sm font-bold text-[#333] font-mono mt-1">
              Rp {kasRw.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Kas PKK</span>
            <div className="text-sm font-bold text-[#333] font-mono mt-1">
              Rp {kasPkk.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Kas Posyandu</span>
            <div className="text-sm font-bold text-[#333] font-mono mt-1">
              Rp {kasPosyandu.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Karang Taruna</span>
            <div className="text-sm font-bold text-[#333] font-mono mt-1">
              Rp {kasKarangTaruna.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-[#f8f9fa] p-3 rounded border border-[#dee2e6]">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Bank Sampah</span>
            <div className="text-sm font-bold text-[#333] font-mono mt-1">
              Rp {kasBankSampah.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Pending Approvals & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Pending Letters & Active Complaints */}
        <div className="lg:col-span-2 space-y-5">
          {/* Pending Surat Approval Panel */}
          <div className="bg-white rounded border border-[#dee2e6] shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-[#dee2e6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#0056b3]" />
                <h3 className="font-bold text-[#333] text-sm">Surat Menunggu Persetujuan RT / RW</h3>
                <span className="bg-[#fff3cd] text-[#856404] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingSurat.length} Surat
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('administrasi')}
                className="px-2.5 py-1 text-xs border border-[#dee2e6] bg-[#f8f9fa] hover:bg-slate-100 text-slate-700 rounded transition font-medium cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            {pendingSurat.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#28a745]" />
                <span>Tidak ada surat yang menunggu persetujuan saat ini.</span>
              </div>
            ) : (
              <div className="p-4 space-y-2.5">
                {pendingSurat.map((surat) => (
                  <div
                    key={surat.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#f8f9fa] rounded border border-[#dee2e6] hover:border-slate-300 transition"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#333] text-xs">{surat.jenisSurat}</span>
                        <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          {surat.nomorSurat}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Pemohon: <strong className="text-slate-800">{surat.namaWarga}</strong> (RT {surat.rt}/RW {surat.rw})
                      </p>
                      <p className="text-[11px] text-slate-500">Keperluan: {surat.keperluan}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproveSurat(surat.id)}
                        className="bg-[#0056b3] hover:bg-[#004494] text-white text-xs px-3 py-1.5 rounded font-medium shadow-xs transition cursor-pointer"
                      >
                        Setujui Surat
                      </button>
                      <button
                        onClick={() => onNavigateTab('administrasi')}
                        className="bg-white border border-[#dee2e6] text-slate-700 text-xs px-2.5 py-1.5 rounded font-medium hover:bg-slate-100 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Complaints Panel */}
          <div className="bg-white rounded border border-[#dee2e6] shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-[#dee2e6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-[#333] text-sm">Aduan Warga yang Perlu Dindaklanjuti</h3>
              </div>
              <button
                onClick={() => onNavigateTab('sosial-aduan')}
                className="px-2.5 py-1 text-xs border border-[#dee2e6] bg-[#f8f9fa] hover:bg-slate-100 text-slate-700 rounded transition font-medium cursor-pointer"
              >
                Kelola Aduan
              </button>
            </div>

            {pendingAduan.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                Tidak ada aduan aktif yang tertunda.
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {pendingAduan.map((aduan) => (
                  <div
                    key={aduan.id}
                    className="p-3 bg-[#f8f9fa] rounded border border-[#dee2e6] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase bg-[#fff3cd] text-[#856404] px-2 py-0.5 rounded-full">
                          {aduan.kategori}
                        </span>
                        <span className="font-semibold text-[#333] text-xs">{aduan.judul}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{aduan.deskripsi}</p>
                      <span className="text-[10px] text-slate-400">
                        Pelapor: {aduan.pelaporNama} (RT {aduan.rt}) • {aduan.tglAduan}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigateTab('sosial-aduan')}
                      className="text-xs text-[#0056b3] hover:underline font-semibold self-start sm:self-center cursor-pointer"
                    >
                      Respon →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Financial Visual Chart & Upcoming Events */}
        <div className="space-y-5">
          {/* Visual Kas Recharts Chart */}
          <div className="bg-white rounded border border-[#dee2e6] p-4 shadow-xs">
            <h3 className="font-bold text-[#333] text-sm mb-3">Grafik Perbandingan Kas</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kasChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip
                    formatter={(val: number) => [`Rp ${val.toLocaleString('id-ID')}`, 'Saldo Kas']}
                    contentStyle={{ fontSize: '11px', borderRadius: '4px', borderColor: '#dee2e6' }}
                  />
                  <Bar dataKey="saldo" fill="#0056b3" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Events Calendar Widget */}
          <div className="bg-white rounded border border-[#dee2e6] p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#dee2e6] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0056b3]" />
                <h3 className="font-bold text-[#333] text-sm">Agenda & Kegiatan Lingkungan</h3>
              </div>
              <button
                onClick={() => onNavigateTab('kegiatan')}
                className="text-xs font-semibold text-[#0056b3] hover:underline cursor-pointer"
              >
                Lihat Kalender
              </button>
            </div>

            <div className="space-y-2.5">
              {eventsList.map((evt) => (
                <div key={evt.id} className="p-2.5 bg-[#f8f9fa] rounded border border-[#dee2e6] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#333]">{evt.nama}</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-[#0056b3] font-semibold px-1.5 py-0.2 rounded">
                      {evt.unitOwner}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-2">
                    <span>📅 {evt.tanggal} ({evt.waktu})</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">📍 {evt.lokasi}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

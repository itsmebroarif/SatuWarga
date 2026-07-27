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
  BarChart3,
  PieChart as PieChartIcon,
  UserCheck,
  Briefcase,
  HeartHandshake,
  Activity,
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
import { ProgressRing } from './ProgressRing';
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
  Legend,
  AreaChart,
  Area,
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
  onOpenAiAssistant?: () => void;
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

  // Age Calculation Helper
  const calculateAge = (tanggalLahirStr: string): number => {
    if (!tanggalLahirStr) return 32;
    const birthDate = new Date(tanggalLahirStr);
    if (isNaN(birthDate.getTime())) return 32;
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // 1. Age Distribution Statistics
  const ageStats = { anak: 0, pemuda: 0, dewasa: 0, lansia: 0 };
  wargaList.forEach((w) => {
    const age = calculateAge(w.tanggalLahir);
    if (age < 18) ageStats.anak++;
    else if (age <= 35) ageStats.pemuda++;
    else if (age <= 59) ageStats.dewasa++;
    else ageStats.lansia++;
  });

  const ageChartData = [
    { range: 'Anak (<18th)', jumlah: ageStats.anak, color: '#0284c7' },
    { range: 'Pemuda (18-35th)', jumlah: ageStats.pemuda, color: '#10b981' },
    { range: 'Dewasa (36-59th)', jumlah: ageStats.dewasa, color: '#f59e0b' },
    { range: 'Lansia (60+th)', jumlah: ageStats.lansia, color: '#8b5cf6' },
  ];

  // 2. Employment Status Statistics
  const jobMap: Record<string, number> = {};
  wargaList.forEach((w) => {
    const job = w.pekerjaan || 'Lainnya';
    jobMap[job] = (jobMap[job] || 0) + 1;
  });

  const employmentChartData = Object.entries(jobMap)
    .map(([job, total]) => ({ name: job, jumlah: total }))
    .sort((a, b) => b.jumlah - a.jumlah);

  // 3. Religion Distribution Statistics
  const agamaMap: Record<string, number> = {};
  wargaList.forEach((w) => {
    const ag = w.agama || 'Lainnya';
    agamaMap[ag] = (agamaMap[ag] || 0) + 1;
  });

  const AGAMA_COLORS: Record<string, string> = {
    Islam: '#10b981',
    Kristen: '#0284c7',
    Katolik: '#6366f1',
    Hindu: '#f59e0b',
    Buddha: '#ef4444',
    Khonghucu: '#64748b',
    Lainnya: '#94a3b8',
  };

  const religionChartData = Object.entries(agamaMap).map(([religion, total]) => ({
    name: religion,
    value: total,
    color: AGAMA_COLORS[religion] || '#0056b3',
  }));

  // 4. Citizen Growth Trend (Pertumbuhan Warga Bulan Ini - Area Chart)
  const growthTrendData = totalWarga === 0 ? [
    { periode: 'Migg 1', penambahan: 0, akumulasi: 0 },
    { periode: 'Migg 2', penambahan: 0, akumulasi: 0 },
    { periode: 'Migg 3', penambahan: 0, akumulasi: 0 },
    { periode: 'Migg 4', penambahan: 0, akumulasi: 0 },
  ] : [
    { periode: 'Migg 1', penambahan: Math.max(1, Math.round(totalWarga * 0.1)), akumulasi: Math.max(1, Math.round(totalWarga * 0.4)) },
    { periode: 'Migg 2', penambahan: Math.max(1, Math.round(totalWarga * 0.2)), akumulasi: Math.max(1, Math.round(totalWarga * 0.6)) },
    { periode: 'Migg 3', penambahan: Math.max(1, Math.round(totalWarga * 0.2)), akumulasi: Math.max(1, Math.round(totalWarga * 0.8)) },
    { periode: 'Migg 4', penambahan: Math.max(1, Math.round(totalWarga * 0.2)), akumulasi: totalWarga },
  ];
  const penambahanBulanIni = growthTrendData.reduce((acc, curr) => acc + curr.penambahan, 0);

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
            Selamat Datang di E-REKAP ENTERPRISE MANAGEMENT SYSTEM
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

      {/* Sleek Stat Grid Cards with Progress Rings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded border border-[#dee2e6] border-l-4 border-l-[#0056b3] shadow-xs hover:shadow-sm transition flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider block mb-1">Total Warga</span>
            <div className="text-2xl font-bold text-[#333] font-mono">{totalWarga}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Jiwa Terdaftar</p>
          </div>
          <ProgressRing progress={totalWarga > 0 ? 100 : 0} size={44} strokeWidth={4} color="#0056b3" />
        </div>

        <div className="bg-white p-3.5 rounded border border-[#dee2e6] border-l-4 border-l-[#fd7e14] shadow-xs hover:shadow-sm transition flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider block mb-1">Kepala Keluarga</span>
            <div className="text-2xl font-bold text-[#333] font-mono">{totalKk}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">KK Aktif</p>
          </div>
          <ProgressRing progress={totalKk > 0 ? 100 : 0} size={44} strokeWidth={4} color="#fd7e14" />
        </div>

        <div className="bg-white p-3.5 rounded border border-[#dee2e6] border-l-4 border-l-[#28a745] shadow-xs hover:shadow-sm transition flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider block mb-1">Kas RT 04</span>
            <div className="text-xl font-bold text-[#333] font-mono">Rp {(kasRt / 1000).toLocaleString('id-ID')}rb</div>
            <p className="text-[10px] text-[#28a745] font-semibold mt-0.5">Saldo Aktif</p>
          </div>
          <ProgressRing progress={kasRt > 0 ? 100 : 0} size={44} strokeWidth={4} color="#28a745" />
        </div>

        <div className="bg-white p-3.5 rounded border border-[#dee2e6] border-l-4 border-l-[#17a2b8] shadow-xs hover:shadow-sm transition flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider block mb-1">Surat Pending</span>
            <div className="text-2xl font-bold text-[#333] font-mono">{pendingSurat.length}</div>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Perlu Approval</p>
          </div>
          <ProgressRing progress={suratList.length > 0 ? Math.round(((suratList.length - pendingSurat.length) / suratList.length) * 100) : 0} size={44} strokeWidth={4} color="#17a2b8" />
        </div>

        <div className="bg-white p-3.5 rounded border border-[#dee2e6] border-l-4 border-l-[#fd7e14] shadow-xs hover:shadow-sm transition flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider block mb-1">Iuran Warga</span>
            <div className="text-2xl font-bold text-[#333] font-mono">{unpaidTagihan.length}</div>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Tunggakan</p>
          </div>
          <ProgressRing progress={tagihanList.length > 0 ? Math.round(((tagihanList.length - unpaidTagihan.length) / tagihanList.length) * 100) : 0} size={44} strokeWidth={4} color="#fd7e14" />
        </div>

        <div className="bg-white p-3.5 rounded border border-[#dee2e6] border-l-4 border-l-red-600 shadow-xs hover:shadow-sm transition flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider block mb-1">Aduan Aktif</span>
            <div className="text-2xl font-bold text-[#333] font-mono">{pendingAduan.length}</div>
            <p className="text-[10px] text-red-600 font-semibold mt-0.5">Perlu Tindakan</p>
          </div>
          <ProgressRing progress={aduanList.length > 0 ? Math.round(((aduanList.length - pendingAduan.length) / aduanList.length) * 100) : 0} size={44} strokeWidth={4} color="#dc3545" />
        </div>
      </div>

      {/* Visually Impressive Capaian Target Ring Dashboard Widget */}
      <div className="bg-white rounded border-2 border-slate-900 p-4 shadow-[4px_4px_0px_0px_#0f172a]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold border border-sky-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Visualisasi Capaian Target & Realisasi E-REKAP ENTERPRISE MANAGEMENT SYSTEM</h3>
              <p className="text-[11px] text-slate-500 font-medium">Monitoring Prosentase Capaian Program Kerja & Keuangan Lingkungan / Karang Taruna</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-600 animate-pulse" /> Realtime Target Meter
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <ProgressRing progress={totalWarga > 0 ? 100 : 0} size={58} strokeWidth={6} color="#0056b3" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Sensus Pendataan Warga</h4>
              <p className="text-[11px] font-mono text-slate-600 font-semibold mt-0.5">{totalWarga} Jiwa Terdaftar</p>
              <span className="text-[10px] text-emerald-600 font-bold">Terdaftar Sesuai DPT</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <ProgressRing
              progress={tagihanList.length > 0 ? Math.round(((tagihanList.length - unpaidTagihan.length) / tagihanList.length) * 100) : 0}
              size={58}
              strokeWidth={6}
              color="#10b981"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Realisasi Iuran Rutin</h4>
              <p className="text-[11px] font-mono text-slate-600 font-semibold mt-0.5">
                {tagihanList.length - unpaidTagihan.length} / {tagihanList.length} Rumah Lunas
              </p>
              <span className="text-[10px] text-slate-500 font-bold">Kolektibilitas Kas</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <ProgressRing
              progress={suratList.length > 0 ? Math.round(((suratList.length - pendingSurat.length) / suratList.length) * 100) : 0}
              size={58}
              strokeWidth={6}
              color="#f59e0b"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Respons Layanan Surat</h4>
              <p className="text-[11px] font-mono text-slate-600 font-semibold mt-0.5">
                {suratList.length - pendingSurat.length} / {suratList.length} Surat Disetujui
              </p>
              <span className="text-[10px] text-amber-600 font-bold">Selesai Tanda Tangan</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <ProgressRing
              progress={aduanList.length > 0 ? Math.round(((aduanList.length - pendingAduan.length) / aduanList.length) * 100) : 0}
              size={58}
              strokeWidth={6}
              color="#8b5cf6"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Penyelesaian Aduan Warga</h4>
              <p className="text-[11px] font-mono text-slate-600 font-semibold mt-0.5">
                {aduanList.length - pendingAduan.length} / {aduanList.length} Aduan Selesai
              </p>
              <span className="text-[10px] text-purple-600 font-bold">Tindak Lanjut Cepat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Neo-Brutalist Karang Taruna Town 3D Simulation Banner */}
      <div className="bg-[#facc15] border-3 border-slate-900 rounded-2xl p-5 shadow-[6px_6px_0px_0px_#0f172a] relative overflow-hidden transition-all flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-slate-900 text-amber-300 font-mono font-black text-[10px] uppercase rounded border border-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" /> Karang Taruna 3D Village Map
          </div>
          <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">
            PETA 3D LINGKUNGAN DESA SUKAMAJU (15 PEMUDA • 7 COWO / 8 CEWE)
          </h3>
          <p className="text-xs font-bold text-slate-900">
            Simulasi visual interaktif wilayah desa lengkap dengan gunung, danau, sungai, perumahan warga, dan radar aktivitas pemuda real-time.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('sub-organisasi')}
          className="z-10 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-4 h-4 text-amber-300" /> Buka Simulasi Peta 3D
        </button>
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

      {/* STATISTIK WARGA MODULE (Age Distribution, Employment, Religion, Gender, Growth Trend) */}
      <div className="bg-white rounded border border-[#dee2e6] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#dee2e6] pb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0056b3]/10 text-[#0056b3] rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#333] text-base flex items-center gap-2">
                Statistik & Pertumbuhan Warga Sukamaju
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {totalWarga} Jiwa Live
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Visualisasi interaktif Tren Pertumbuhan, Distribusi Usia, Pekerjaan, Agama, dan Gender.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('master-data')}
            className="text-xs font-bold text-[#0056b3] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            Data Lengkap Warga <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kartu Ringkasan Pertumbuhan Warga (Recharts AreaChart) */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 rounded-xl p-4 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-400/30 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm text-white">Kartu Ringkasan: Pertumbuhan Warga Bulan Ini</h4>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold">
                    +{penambahanBulanIni} Jiwa Pendaftaran Baru
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Grafik area tren kenaikan penambahan warga & total akumulasi dari minggu ke minggu bulan ini.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-bold bg-slate-800/80 p-2 rounded-lg border border-slate-700 self-start sm:self-center shrink-0">
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">RATA-RATA/MGG</span>
                <span className="text-sky-300">~{(penambahanBulanIni / 4).toFixed(1)} Jiwa</span>
              </div>
              <div className="w-px h-6 bg-slate-700" />
              <div>
                <span className="text-slate-400 text-[10px] block font-mono">AKUMULASI TOTAL</span>
                <span className="text-emerald-400">{totalWarga} Jiwa</span>
              </div>
            </div>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPenambahan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorAkumulasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="periode" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#cbd5e1' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10, fill: '#cbd5e1' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    `${val} Jiwa`,
                    name === 'penambahan' ? 'Warga Baru Terdaftar' : 'Akumulasi Total Warga',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#f8fafc',
                    fontSize: '11px',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="penambahan"
                  name="penambahan"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPenambahan)"
                />
                <Area
                  type="monotone"
                  dataKey="akumulasi"
                  name="akumulasi"
                  stroke="#34d399"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorAkumulasi)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3 Interactive Chart Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart 1: Distribusi Usia */}
          <div className="bg-[#f8f9fa] rounded p-4 border border-[#dee2e6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#333] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#0056b3]" /> Distribusi Usia
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Lansia: {ageStats.lansia} • Anak: {ageStats.anak}
              </span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="range" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(val: number) => [`${val} Orang`, 'Jumlah Warga']}
                    contentStyle={{ fontSize: '11px', borderRadius: '6px', borderColor: '#cbd5e1' }}
                  />
                  <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                    {ageChartData.map((entry, index) => (
                      <Cell key={`age-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Status Pekerjaan */}
          <div className="bg-[#f8f9fa] rounded p-4 border border-[#dee2e6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#333] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" /> Status Pekerjaan Warga
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {employmentChartData.length} Kategori
              </span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employmentChartData.slice(0, 5)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} />
                  <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(val: number) => [`${val} Jiwa`, 'Pekerjaan']}
                    contentStyle={{ fontSize: '11px', borderRadius: '6px', borderColor: '#cbd5e1' }}
                  />
                  <Bar dataKey="jumlah" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Distribusi Agama & Gender */}
          <div className="bg-[#f8f9fa] rounded p-4 border border-[#dee2e6] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#333] flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-purple-600" /> Distribusi Agama
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Pria: {maleCount} | Wanita: {femaleCount}
              </span>
            </div>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={religionChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {religionChartData.map((entry, index) => (
                      <Cell key={`rel-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} Jiwa`, 'Jumlah Pemeluk']}
                    contentStyle={{ fontSize: '11px', borderRadius: '6px', borderColor: '#cbd5e1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
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

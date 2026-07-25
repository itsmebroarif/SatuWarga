import React, { useState } from 'react';
import {
  Users,
  Compass,
  MapPin,
  Sparkles,
  Award,
  Calendar,
  Wallet,
  Zap,
  Activity,
  Heart,
  Eye,
  CheckCircle2,
  Phone,
  Flame,
  Shield,
  Layers,
  Search,
  Filter,
} from 'lucide-react';

export interface PemudaWarga {
  id: string;
  nama: string;
  gender: 'L' | 'P'; // L = Cowo (7), P = Cewe (8)
  genderLabel: 'Cowo' | 'Cewe';
  umur: number;
  rt: string;
  jabatan: string;
  divisi: string;
  noHp: string;
  hobi: string;
  statusAktivitas: string;
  posX: number; // percentage on isometric canvas
  posY: number; // percentage on isometric canvas
  avatarBg: string;
}

export const LIST_15_PEMUDA: PemudaWarga[] = [
  // 7 Cowo (Males)
  {
    id: 'pmd-01',
    nama: 'Aris Pratama',
    gender: 'L',
    genderLabel: 'Cowo',
    umur: 24,
    rt: 'RT 01',
    jabatan: 'Ketua Karang Taruna',
    divisi: 'Pengurus Inti',
    noHp: '0812-3344-5566',
    hobi: 'Futsal & Social Work',
    statusAktivitas: 'Mengarahkan Rapat Turnamen Futsal',
    posX: 48,
    posY: 52,
    avatarBg: 'bg-amber-400 text-slate-950',
  },
  {
    id: 'pmd-02',
    nama: 'Budi Santoso',
    gender: 'L',
    genderLabel: 'Cowo',
    umur: 23,
    rt: 'RT 01',
    jabatan: 'Sekretaris Pemuda',
    divisi: 'Pengurus Inti',
    noHp: '0813-8899-1122',
    hobi: 'Desain Grafis',
    statusAktivitas: 'Menyusun Proposal 17 Agustus',
    posX: 38,
    posY: 60,
    avatarBg: 'bg-sky-400 text-slate-950',
  },
  {
    id: 'pmd-03',
    nama: 'Dimas Saputra',
    gender: 'L',
    genderLabel: 'Cowo',
    umur: 22,
    rt: 'RT 02',
    jabatan: 'Koordinator Olahraga',
    divisi: 'Divisi Olahraga',
    noHp: '0857-1122-3344',
    hobi: 'Bulu Tangkis & Sepakbola',
    statusAktivitas: 'Menyiapkan Lapangan Voli Desa',
    posX: 65,
    posY: 45,
    avatarBg: 'bg-emerald-400 text-slate-950',
  },
  {
    id: 'pmd-04',
    nama: 'Eko Wijaya',
    gender: 'L',
    genderLabel: 'Cowo',
    umur: 25,
    rt: 'RT 02',
    jabatan: 'Anggota Keamanan',
    divisi: 'Divisi Linmas Muda',
    noHp: '0821-4455-6677',
    hobi: 'Pencak Silat',
    statusAktivitas: 'Patroli Pos Ronda Pemuda',
    posX: 78,
    posY: 68,
    avatarBg: 'bg-rose-400 text-slate-950',
  },
  {
    id: 'pmd-05',
    nama: 'Farhan Ramadhan',
    gender: 'L',
    genderLabel: 'Cowo',
    umur: 21,
    rt: 'RT 03',
    jabatan: 'Kreatif & Multimedia',
    divisi: 'Divisi Media & Komunikasi',
    noHp: '0896-7788-9900',
    hobi: 'Videografi & Drone',
    statusAktivitas: 'Mengambil Foto Pemandangan Danau',
    posX: 25,
    posY: 38,
    avatarBg: 'bg-[#a855f7] text-white',
  },
  {
    id: 'pmd-06',
    nama: 'Gilang Permana',
    gender: 'L',
    genderLabel: 'Cowo',
    umur: 23,
    rt: 'RT 03',
    jabatan: 'Logistik & Peralatan',
    divisi: 'Divisi Perlengkapan',
    noHp: '0815-6677-8899',
    hobi: 'Otomotif & Otot',
    statusAktivitas: 'Check-in Sound System Balai',
    posX: 32,
    posY: 75,
    avatarBg: 'bg-[#f97316] text-slate-950',
  },
  {
    id: 'pmd-07',
    nama: 'Hendra Kurniawan',
    gender: 'L',
    genderLabel: 'Cowo',
    umur: 24,
    rt: 'RT 04',
    jabatan: 'Pengelola Event Desa',
    divisi: 'Divisi Acara',
    noHp: '0812-9900-1122',
    hobi: 'Musik Akustik',
    statusAktivitas: 'Latihan Panggung Pesisir Sungai',
    posX: 82,
    posY: 35,
    avatarBg: 'bg-yellow-300 text-slate-950',
  },

  // 8 Cewe (Females)
  {
    id: 'pmd-08',
    nama: 'Annisa Rahma',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 23,
    rt: 'RT 01',
    jabatan: 'Bendahara Karang Taruna',
    divisi: 'Pengurus Inti',
    noHp: '0812-1111-2222',
    hobi: 'Akuntansi & Memasak',
    statusAktivitas: 'Merekap Iuran Kas Pemuda',
    posX: 42,
    posY: 48,
    avatarBg: 'bg-[#ec4899] text-white',
  },
  {
    id: 'pmd-09',
    nama: 'Bella Citra',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 22,
    rt: 'RT 01',
    jabatan: 'Wakil Ketua Pemuda',
    divisi: 'Pengurus Inti',
    noHp: '0852-3333-4444',
    hobi: 'Public Speaking & Debate',
    statusAktivitas: 'Rapat Koordinasi dengan Karang Taruna Kota',
    posX: 52,
    posY: 42,
    avatarBg: 'bg-teal-400 text-slate-950',
  },
  {
    id: 'pmd-10',
    nama: 'Citra Dewi',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 20,
    rt: 'RT 02',
    jabatan: 'Koord. Seni & Tari',
    divisi: 'Divisi Kesenian',
    noHp: '0878-5555-6666',
    hobi: 'Tari Tradisional & Modern',
    statusAktivitas: 'Gladi Bersih Pentas Seni Tradisional',
    posX: 60,
    posY: 58,
    avatarBg: 'bg-[#06b6d4] text-slate-950',
  },
  {
    id: 'pmd-11',
    nama: 'Diana Putri',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 21,
    rt: 'RT 02',
    jabatan: 'Koord. UMKM Pemudi',
    divisi: 'Divisi Ekonomi Kreatif',
    noHp: '0819-7777-8888',
    hobi: 'Baking & Stand-up Bazaar',
    statusAktivitas: 'Membuka Stand Kue Karang Taruna',
    posX: 70,
    posY: 62,
    avatarBg: 'bg-lime-400 text-slate-950',
  },
  {
    id: 'pmd-12',
    nama: 'Eva Lestari',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 22,
    rt: 'RT 03',
    jabatan: 'Kader Kesehatan Muda',
    divisi: 'Divisi Kesehatan & Posyandu',
    noHp: '0822-9999-0000',
    hobi: 'Yoga & Palang Merah',
    statusAktivitas: 'Pemeriksaan Tensi Gratis Warga',
    posX: 22,
    posY: 50,
    avatarBg: 'bg-rose-300 text-slate-950',
  },
  {
    id: 'pmd-13',
    nama: 'Fitri Handayani',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 21,
    rt: 'RT 03',
    jabatan: 'Divisi Edukasi & Bimbingan',
    divisi: 'Divisi Pendidikan',
    noHp: '0813-2233-4455',
    hobi: 'Membaca & Mengajar Les',
    statusAktivitas: 'Mengajar Bimbel Gratis Anak-anak',
    posX: 28,
    posY: 65,
    avatarBg: 'bg-indigo-400 text-white',
  },
  {
    id: 'pmd-14',
    nama: 'Gita Nurhaliza',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 23,
    rt: 'RT 04',
    jabatan: 'Sekretariat & Dokumen',
    divisi: 'Divisi Administrasi',
    noHp: '0856-4455-6677',
    hobi: 'Jurnalistik & Blog',
    statusAktivitas: 'Dokumentasi Notulen Kegiatan Pemuda',
    posX: 85,
    posY: 48,
    avatarBg: 'bg-fuchsia-400 text-slate-950',
  },
  {
    id: 'pmd-15',
    nama: 'Hani Saputri',
    gender: 'P',
    genderLabel: 'Cewe',
    umur: 20,
    rt: 'RT 04',
    jabatan: 'Koord. Daur Ulang Muda',
    divisi: 'Divisi Lingkungan Hidup',
    noHp: '0812-6677-8899',
    hobi: 'Hydroponics & Crafting',
    statusAktivitas: 'Monitoring Bersih-Bersih Pinggir Sungai',
    posX: 58,
    posY: 78,
    avatarBg: 'bg-emerald-300 text-slate-950',
  },
];

export const KarangTarunaTown3D: React.FC = () => {
  const [selectedPemuda, setSelectedPemuda] = useState<PemudaWarga>(LIST_15_PEMUDA[0]);
  const [filterGender, setFilterGender] = useState<'ALL' | 'L' | 'P'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'MAP' | 'LIST' | 'PROGRAM' | 'STAT'>('MAP');

  const filteredList = LIST_15_PEMUDA.filter((p) => {
    const matchGender = filterGender === 'ALL' || p.gender === filterGender;
    const matchSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGender && matchSearch;
  });

  const countCowo = LIST_15_PEMUDA.filter((p) => p.gender === 'L').length; // 7
  const countCewe = LIST_15_PEMUDA.filter((p) => p.gender === 'P').length; // 8

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* NEO-BRUTALISM HERO HEADER */}
      <div className="bg-[#facc15] border-3 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden transition-all">
        {/* Animated Background Decorative Elements */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#ec4899] rounded-full border-3 border-slate-900 opacity-80 animate-pulse pointer-events-none" />
        <div className="absolute right-32 -bottom-10 w-28 h-28 bg-[#38bdf8] border-3 border-slate-900 rotate-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-amber-300 font-mono font-black text-xs uppercase tracking-wider rounded-lg border-2 border-slate-900 mb-3 shadow-[2px_2px_0px_0px_#ffffff]">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              Karang Taruna Tunas Muda Sukamaju (ERP Edition)
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight leading-none mb-3 drop-shadow-sm">
              TOWN MAP 3D PEMUDA & SIMULASI LINGKUNGAN
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed bg-white/80 backdrop-blur-xs p-3 rounded-xl border-2 border-slate-900">
              Sensasi interaktif peta 3D lingkungan Sukamaju dilengkapi gunung, sungai, danau, perumahan warga, serta status real-time 15 pemuda terdaftar (7 Cowo & 8 Cewe).
            </p>
          </div>

          {/* Stat Pill Badges */}
          <div className="flex flex-wrap lg:flex-col gap-2.5">
            <div className="bg-white border-3 border-slate-900 p-3 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0056b3] text-white flex items-center justify-center font-black text-lg border-2 border-slate-900">
                15
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">Total Pemuda Aktif</span>
                <span className="text-xs font-black text-slate-900">7 Cowo ♂ • 8 Cewe ♀</span>
              </div>
            </div>

            <div className="bg-[#a855f7] text-white border-3 border-slate-900 p-3 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-300 text-slate-950 flex items-center justify-center font-black text-lg border-2 border-slate-900">
                4
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-amber-200 uppercase block">Program Kerja Utama</span>
                <span className="text-xs font-black">Voli, Futsal, Seni, Bazaar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS (NEO-BRUTALISM SEGMENTED) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'MAP', label: '🗺️ Peta 3D Town & Simulasi', color: 'bg-sky-400' },
            { id: 'LIST', label: '👥 15 Data Pemuda (7 ♂ / 8 ♀)', color: 'bg-emerald-400' },
            { id: 'PROGRAM', label: '⚡ Agenda & Proker', color: 'bg-amber-400' },
            { id: 'STAT', label: '📊 Kas & Keuangan Muda', color: 'bg-fuchsia-400' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide border-2 border-slate-900 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? `${tab.color} text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] -translate-y-0.5`
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Filter gender toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border-2 border-slate-900">
          <span className="text-[10px] font-black uppercase text-slate-600 px-2 font-mono">Filter:</span>
          <button
            onClick={() => setFilterGender('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
              filterGender === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            Semua (15)
          </button>
          <button
            onClick={() => setFilterGender('L')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
              filterGender === 'L'
                ? 'bg-[#0056b3] text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            ♂ Cowo ({countCowo})
          </button>
          <button
            onClick={() => setFilterGender('P')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
              filterGender === 'P'
                ? 'bg-[#ec4899] text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            ♀ Cewe ({countCewe})
          </button>
        </div>
      </div>

      {/* TAB 1: 3D ISOMETRIC TOWN MAP SIMULATOR */}
      {activeTab === 'MAP' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* THE 3D MAP CANVAS CONTAINER */}
          <div className="lg:col-span-2 bg-[#0284c7] border-4 border-slate-900 rounded-3xl p-4 sm:p-6 shadow-[10px_10px_0px_0px_#0f172a] relative overflow-hidden min-h-[520px] flex flex-col justify-between">
            {/* Top Info Ribbon */}
            <div className="flex items-center justify-between gap-2 z-20">
              <div className="bg-white border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0056b3] animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  ISOMETRIC TOWN MAP 3D - VILLAGE SIMULATOR
                </span>
              </div>
              <div className="bg-amber-300 border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_#0f172a] text-[10px] font-black uppercase text-slate-950 font-mono">
                Peta Warga Sukamaju 3D
              </div>
            </div>

            {/* HIGH-QUALITY CUSTOM ISOMETRIC CANVAS DRAWING (BACKGROUND ARTWORK) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-90 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="none">
                {/* 1. MOUNTAINS IN BACKGROUND */}
                <polygon points="50,180 200,40 380,180" fill="#15803d" stroke="#0f172a" strokeWidth="4" />
                <polygon points="180,40 200,40 220,80" fill="#f8fafc" opacity="0.9" />
                <polygon points="280,200 450,30 620,200" fill="#166534" stroke="#0f172a" strokeWidth="4" />
                <polygon points="430,30 450,30 470,75" fill="#f8fafc" opacity="0.9" />
                <polygon points="550,220 720,60 880,220" fill="#14532d" stroke="#0f172a" strokeWidth="4" />

                {/* 2. SKY CLOUDS */}
                <ellipse cx="150" cy="50" rx="40" ry="18" fill="#ffffff" opacity="0.8" />
                <ellipse cx="680" cy="40" rx="55" ry="22" fill="#ffffff" opacity="0.8" />

                {/* 3. TERRAIN / GREEN LANDSCAPE */}
                <polygon points="0,180 1000,180 1000,700 0,700" fill="#22c55e" />
                <polygon points="0,180 1000,180 1000,210 0,210" fill="#16a34a" />

                {/* 4. LAKE (DANAU SUKAMAJU) */}
                <path
                  d="M 120,240 C 220,220 320,280 280,380 C 240,460 120,420 80,340 Z"
                  fill="#0ea5e9"
                  stroke="#0f172a"
                  strokeWidth="4"
                />
                <ellipse cx="180" cy="330" rx="60" ry="30" fill="#38bdf8" opacity="0.7" />
                {/* Sailboat on Lake */}
                <polygon points="175,320 175,300 190,315" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                <polygon points="165,320 185,320 175,325" fill="#f97316" stroke="#0f172a" strokeWidth="2" />

                {/* 5. WINDING RIVER (SUNGAI DESA) */}
                <path
                  d="M 280,380 Q 420,400 500,320 T 750,380 T 1000,340 L 1000,410 Q 750,450 500,390 T 260,430 Z"
                  fill="#0284c7"
                  stroke="#0f172a"
                  strokeWidth="4"
                />
                {/* River Waves */}
                <path d="M 320,390 Q 360,385 400,390" stroke="#7dd3fc" strokeWidth="3" fill="none" />
                <path d="M 600,360 Q 640,355 680,360" stroke="#7dd3fc" strokeWidth="3" fill="none" />

                {/* 6. BRIDGES OVER RIVER */}
                <rect
                  x="480"
                  y="335"
                  width="35"
                  height="65"
                  rx="6"
                  fill="#b45309"
                  stroke="#0f172a"
                  strokeWidth="3"
                  transform="rotate(15, 480, 335)"
                />
                <rect
                  x="740"
                  y="360"
                  width="35"
                  height="65"
                  rx="6"
                  fill="#b45309"
                  stroke="#0f172a"
                  strokeWidth="3"
                  transform="rotate(-10, 740, 360)"
                />

                {/* 7. ROADS & PAVEMENT */}
                <path
                  d="M 400,700 L 480,400 L 520,400 L 580,700 Z"
                  fill="#64748b"
                  stroke="#0f172a"
                  strokeWidth="3"
                />
                <path d="M 0,550 L 1000,550" stroke="#475569" strokeWidth="32" />
                <path d="M 0,550 L 1000,550" stroke="#f8fafc" strokeWidth="3" strokeDasharray="15 15" />

                {/* 8. HOUSES & BUILDINGS (ISOMETRIC HOUSES) */}
                {/* House RT 01 */}
                <g transform="translate(350, 430)">
                  <rect x="0" y="20" width="60" height="40" fill="#f1f5f9" stroke="#0f172a" strokeWidth="3" />
                  <polygon points="-10,20 30,-10 70,20" fill="#ef4444" stroke="#0f172a" strokeWidth="3" />
                  <rect x="22" y="38" width="16" height="22" fill="#78350f" />
                </g>

                {/* House RT 02 */}
                <g transform="translate(620, 420)">
                  <rect x="0" y="20" width="65" height="42" fill="#f1f5f9" stroke="#0f172a" strokeWidth="3" />
                  <polygon points="-10,20 32.5,-12 75,20" fill="#3b82f6" stroke="#0f172a" strokeWidth="3" />
                  <rect x="24" y="38" width="16" height="24" fill="#78350f" />
                </g>

                {/* House RT 03 */}
                <g transform="translate(180, 560)">
                  <rect x="0" y="20" width="70" height="45" fill="#f1f5f9" stroke="#0f172a" strokeWidth="3" />
                  <polygon points="-10,20 35,-15 80,20" fill="#10b981" stroke="#0f172a" strokeWidth="3" />
                  <rect x="26" y="40" width="18" height="25" fill="#78350f" />
                </g>

                {/* House RT 04 & Balai Desa */}
                <g transform="translate(750, 240)">
                  <rect x="0" y="25" width="90" height="50" fill="#fef08a" stroke="#0f172a" strokeWidth="4" />
                  <polygon points="-15,25 45,-20 105,25" fill="#a855f7" stroke="#0f172a" strokeWidth="4" />
                  <rect x="35" y="45" width="20" height="30" fill="#0f172a" />
                </g>
              </svg>
            </div>

            {/* INTERACTIVE 15 VILLAGER AVATAR PIN MARKERS OVER THE 3D MAP */}
            <div className="relative z-10 w-full h-[400px]">
              {filteredList.map((p) => {
                const isSelected = selectedPemuda.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPemuda(p)}
                    style={{ left: `${p.posX}%`, top: `${p.posY}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'
                    }`}
                  >
                    {/* Speech Bubble on Selected */}
                    {isSelected && (
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white border-2 border-slate-900 rounded-xl px-2.5 py-1 shadow-[3px_3px_0px_0px_#0f172a] whitespace-nowrap animate-bounce pointer-events-none">
                        <span className="text-[10px] font-black text-slate-950 block">
                          {p.nama} ({p.genderLabel})
                        </span>
                        <span className="text-[8px] font-bold text-slate-600 block">{p.statusAktivitas}</span>
                      </div>
                    )}

                    {/* Avatar Marker Pill */}
                    <div
                      className={`w-9 h-9 rounded-full border-3 border-slate-900 flex items-center justify-center font-black text-xs shadow-[3px_3px_0px_0px_#0f172a] ${
                        p.avatarBg
                      } ${isSelected ? 'ring-4 ring-amber-300 animate-pulse' : ''}`}
                    >
                      {p.gender === 'L' ? '♂' : '♀'}
                    </div>

                    {/* Label Badge below pin */}
                    <div className="mt-1 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-slate-900 text-center shadow-xs truncate max-w-[80px]">
                      {p.nama.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Legend Ribbon */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md border-3 border-slate-900 p-3 rounded-2xl shadow-[5px_5px_0px_0px_#0f172a] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-800">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-slate-900" />
                  Gunung & Hutan
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-sky-500 border border-slate-900" />
                  Danau & Sungai
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-slate-900" />
                  Balai Pemuda RT/RW
                </span>
              </div>
              <div className="text-[11px] font-mono font-black text-slate-900 bg-amber-300 px-2.5 py-0.5 rounded border border-slate-900">
                Klik Pin Karakter Warga Untuk Detail!
              </div>
            </div>
          </div>

          {/* SELECTED PEMUDA DETAIL CARD (NEO-BRUTALISM PROFILE) */}
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-5 shadow-[8px_8px_0px_0px_#0f172a] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b-3 border-slate-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl border-3 border-slate-900 flex items-center justify-center text-xl font-black shadow-[3px_3px_0px_0px_#0f172a] ${selectedPemuda.avatarBg}`}
                  >
                    {selectedPemuda.gender === 'L' ? '♂' : '♀'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base leading-tight">{selectedPemuda.nama}</h3>
                    <span className="text-[10px] font-mono font-black uppercase text-slate-500">
                      {selectedPemuda.rt} • {selectedPemuda.umur} Tahun • {selectedPemuda.genderLabel}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black border-2 border-slate-900 shadow-xs ${
                    selectedPemuda.gender === 'L' ? 'bg-sky-200 text-sky-900' : 'bg-pink-200 text-pink-900'
                  }`}
                >
                  {selectedPemuda.genderLabel}
                </span>
              </div>

              {/* Jabatan & Divisi Info */}
              <div className="space-y-3">
                <div className="p-3 bg-amber-100 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                  <span className="text-[10px] font-mono font-black text-amber-900 uppercase block">Jabatan Karang Taruna</span>
                  <div className="text-sm font-extrabold text-slate-950">{selectedPemuda.jabatan}</div>
                  <span className="text-[11px] font-bold text-amber-800">{selectedPemuda.divisi}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-900 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp:
                    </span>
                    <span className="font-mono text-slate-900">{selectedPemuda.noHp}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-600" /> Minat / Hobi:
                    </span>
                    <span className="text-slate-900">{selectedPemuda.hobi}</span>
                  </div>
                </div>

                {/* Status Aktivitas Terkini */}
                <div className="p-3 bg-sky-50 rounded-2xl border-2 border-slate-900 space-y-1">
                  <span className="text-[10px] font-mono font-black text-sky-800 uppercase flex items-center gap-1">
                    <Activity className="w-3 h-3 text-sky-600 animate-pulse" /> Aktivitas Saat Ini di Desa:
                  </span>
                  <p className="text-xs font-black text-slate-900 italic">"{selectedPemuda.statusAktivitas}"</p>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 border-t-2 border-slate-900">
              <a
                href={`https://wa.me/${selectedPemuda.noHp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-emerald-600 text-slate-950 font-black text-xs py-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-current" /> Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIST 15 PEMUDA (GRID 7 COWO & 8 CEWE) */}
      {activeTab === 'LIST' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama pemuda, hobi, atau jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0056b3]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-900 border-2 border-slate-900 font-mono">
                ♂ 7 Cowo (Laki-laki)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-pink-100 text-pink-900 border-2 border-slate-900 font-mono">
                ♀ 8 Cewe (Perempuan)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredList.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPemuda(p);
                  setActiveTab('MAP');
                }}
                className={`bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-[5px_5px_0px_0px_#0f172a] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedPemuda.id === p.id ? 'ring-4 ring-amber-400 bg-amber-50/50' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-black border border-slate-900 ${
                        p.gender === 'L' ? 'bg-sky-200 text-sky-950' : 'bg-pink-200 text-pink-950'
                      }`}
                    >
                      {p.genderLabel} • {p.rt}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{p.umur} thn</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl border-2 border-slate-900 flex items-center justify-center text-sm font-black shadow-xs ${p.avatarBg}`}
                    >
                      {p.gender === 'L' ? '♂' : '♀'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-xs leading-tight">{p.nama}</h4>
                      <p className="text-[10px] text-slate-600 font-bold">{p.jabatan}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-medium italic line-clamp-2">"{p.statusAktivitas}"</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-[#0056b3]">
                  <span>Hobi: {p.hobi.split('&')[0]}</span>
                  <Eye className="w-3.5 h-3.5 text-slate-900" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AGENDA & PROGRAM KERJA KARANG TARUNA */}
      {activeTab === 'PROGRAM' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
            <h3 className="font-black text-slate-950 text-base flex items-center gap-2 border-b-2 border-slate-900 pb-3">
              <Flame className="w-5 h-5 text-amber-500" /> Agenda Kegiatan Pemuda Terdekat
            </h3>

            <div className="space-y-3">
              {[
                {
                  title: 'Turnamen Futsal Cup Pemuda RT 01-04',
                  tgl: '15 Agustus 2026',
                  lokasi: 'Lapangan Serbaguna Balai Warga',
                  penanggung: 'Dimas Saputra & Aris Pratama',
                  status: 'Pendaftaran Buka',
                  badgeBg: 'bg-emerald-300 text-emerald-950',
                },
                {
                  title: 'Pentas Seni & Malam Akustik 17-an',
                  tgl: '17 Agustus 2026',
                  lokasi: 'Panggung Utama Tepian Sungai',
                  penanggung: 'Citra Dewi & Hendra Kurniawan',
                  status: 'Latihan Rutin',
                  badgeBg: 'bg-sky-300 text-sky-950',
                },
                {
                  title: 'Bazaar Ekonomi Kreatif Pemudi',
                  tgl: '22 Agustus 2026',
                  lokasi: 'Bazaar Pesisir Danau Sukamaju',
                  penanggung: 'Diana Putri & Annisa Rahma',
                  status: 'Persiapan Stand',
                  badgeBg: 'bg-pink-300 text-pink-950',
                },
              ].map((prog, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border border-slate-900 ${prog.badgeBg}`}>
                      {prog.status}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-600">{prog.tgl}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-950 text-sm">{prog.title}</h4>
                  <div className="text-[11px] text-slate-600 font-semibold space-y-0.5">
                    <p>📍 Lokasi: {prog.lokasi}</p>
                    <p>👤 PIC: {prog.penanggung}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#a855f7] text-white border-3 border-slate-900 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#0f172a] space-y-4">
            <h3 className="font-black text-white text-base flex items-center gap-2 border-b-2 border-slate-900 pb-3">
              <Zap className="w-5 h-5 text-amber-300" /> Visi & Misi Pemuda Karang Taruna
            </h3>

            <div className="space-y-3 text-xs font-bold">
              <div className="p-3.5 bg-white text-slate-950 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                <strong className="block text-purple-700 uppercase font-mono text-[10px] mb-1">Misi 1: Solidaritas Warga Muda</strong>
                Mewadahi kreatifitas seluruh 15 warga muda lintas RT secara inklusif tanpa membedakan latar belakang.
              </div>

              <div className="p-3.5 bg-white text-slate-950 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                <strong className="block text-purple-700 uppercase font-mono text-[10px] mb-1">Misi 2: Konservasi Danau & Sungai</strong>
                Rutin mengadakan aksi pembersihan area sungai dan danau desa setiap akhir bulan.
              </div>

              <div className="p-3.5 bg-white text-slate-950 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                <strong className="block text-purple-700 uppercase font-mono text-[10px] mb-1">Misi 3: Kemandirian Ekonomi</strong>
                Mengembangkan dana usaha mandiri lewat jualan kue bazaar, jasa foto, dan pengelolaan sampah plastik.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KAS & KEUANGAN KARANG TARUNA */}
      {activeTab === 'STAT' && (
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#0f172a] space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-3 border-slate-900 pb-4">
            <div>
              <h3 className="font-black text-slate-950 text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" /> Buku Kas & Dana Usaha Karang Taruna
              </h3>
              <p className="text-xs text-slate-600 font-bold">Laporan Realtime Kas Pemuda Terkelola oleh Annisa Rahma (Bendahara)</p>
            </div>
            <div className="bg-emerald-300 text-emerald-950 border-2 border-slate-900 px-4 py-2 rounded-2xl font-mono font-black text-sm shadow-[3px_3px_0px_0px_#0f172a]">
              Saldo Kas: Rp 4.850.000
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border-2 border-slate-900 rounded-2xl">
              <span className="text-[10px] font-mono font-black text-emerald-800 uppercase block">Total Pemasukan Iuran</span>
              <div className="text-xl font-black text-slate-950 font-mono">Rp 6.200.000</div>
              <span className="text-[10px] text-emerald-700 font-bold">15 Pemuda Lunas 100%</span>
            </div>

            <div className="p-4 bg-rose-50 border-2 border-slate-900 rounded-2xl">
              <span className="text-[10px] font-mono font-black text-rose-800 uppercase block">Total Pengeluaran Proker</span>
              <div className="text-xl font-black text-slate-950 font-mono">Rp 1.350.000</div>
              <span className="text-[10px] text-rose-700 font-bold">DP Sewa Sound & Bola Voli</span>
            </div>

            <div className="p-4 bg-sky-50 border-2 border-slate-900 rounded-2xl">
              <span className="text-[10px] font-mono font-black text-sky-800 uppercase block">Proyeksi Dana Bazaar</span>
              <div className="text-xl font-black text-slate-950 font-mono">Rp 2.500.000</div>
              <span className="text-[10px] text-sky-700 font-bold">Target Profit 17-an</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

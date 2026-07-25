import React, { useState } from 'react';
import {
  FolderArchive,
  FileText,
  Search,
  Download,
  Upload,
  Printer,
  Copy,
  Check,
  Zap,
  BarChart3,
  Users,
  Home,
  PieChart,
  Layers,
  Award,
} from 'lucide-react';
import { ArsipDokumen, Warga } from '../types';
import { PrintReportHeader } from './PrintReportHeader';

interface ArsipProposalViewProps {
  arsipList: ArsipDokumen[];
  wargaList?: Warga[];
  onAddArsip: (a: ArsipDokumen) => void;
}

const TEMPLATES = [
  {
    id: 'hut-ri',
    name: 'HUT RI / Peringatan 17 Agustus',
    penyelenggara: 'Karang Taruna Karya Muda',
    targetAnggaran: 12500000,
    tujuan: 'Meningkatkan jiwa kebangsaan, tali silaturahmi antar warga RT 01-05, serta menyelenggarakan lomba anak-anak dan jalan sehat warga.',
  },
  {
    id: 'kerja-bakti',
    name: 'Kerja Bakti & Saluran Air Lingkungan',
    penyelenggara: 'Pengurus RT 01 / RW 05',
    targetAnggaran: 3500000,
    tujuan: 'Pembersihan got, pangkas dahan pohon, perbaikan jalan fasilitas umum, dan penyemprotan desinfektan lingkungan mencegah DBD.',
  },
  {
    id: 'posyandu',
    name: 'Posyandu Balita & Lansia Rutin Bulanan',
    penyelenggara: 'Kader Posyandu Mawar RW 05',
    targetAnggaran: 4200000,
    tujuan: 'Pemberian Makanan Tambahan (PMT) bergizi untuk balita, pemeriksaan gula darah & tensi lansia, serta penyuluhan kesehatan keluarga.',
  },
  {
    id: 'pos-ronda',
    name: 'Renovasi & Perlengkapan Pos Ronda',
    penyelenggara: 'Tim Linmas & Keamanan RT 01',
    targetAnggaran: 6800000,
    tujuan: 'Pengadaan HT komunikasi siskamling, pengecatan ulang pos ronda, instalasi lampu LED hemat energi, dan pembelian HT security.',
  },
];

export const ArsipProposalView: React.FC<ArsipProposalViewProps> = ({
  arsipList = [],
  wargaList = [],
  onAddArsip,
}) => {
  const [activeTab, setActiveTab] = useState<'ARSIP' | 'PROPOSAL' | 'STATISTIK'>('ARSIP');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Proposal Form State
  const [judulKegiatan, setJudulKegiatan] = useState('Peringatan HUT RI ke-81 RW 05 Padamukti');
  const [unitPenyelenggara, setUnitPenyelenggara] = useState('Karang Taruna Karya Muda');
  const [targetAnggaran, setTargetAnggaran] = useState(12500000);
  const [tujuanSingkat, setTujuanSingkat] = useState(
    'Meningkatkan kebersamaan warga, keakraban antar RT 01-05, dan menyelenggarakan perlombaan edukatif.'
  );

  const filteredArsip = arsipList.filter(
    (a) =>
      a.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setJudulKegiatan(tmpl.name);
    setUnitPenyelenggara(tmpl.penyelenggara);
    setTargetAnggaran(tmpl.targetAnggaran);
    setTujuanSingkat(tmpl.tujuan);
  };

  const generatedProposalText = `PROPOSAL KEGIATAN LINGKUNGAN RT/RW
NOMOR: PROP-05/RW.05/${new Date().getFullYear()}

I. JUDUL KEGIATAN
${judulKegiatan.toUpperCase()}

II. PENYELENGGARA & PENANGGUNG JAWAB
Unit Pelaksana: ${unitPenyelenggara}
Wilayah: Lingkungan RT 01-05 / RW 05 Padamukti

III. MAKSUD DAN TUJUAN
${tujuanSingkat}

IV. RINCIAN RENCANA ANGGARAN BIAYA (RAB)
1. Perlengkapan & Konsumsi Acara       : Rp ${(targetAnggaran * 0.45).toLocaleString('id-ID')}
2. Hadiah, Bantuan & Sembako           : Rp ${(targetAnggaran * 0.35).toLocaleString('id-ID')}
3. Publikasi, Keamanan & Kebersihan   : Rp ${(targetAnggaran * 0.15).toLocaleString('id-ID')}
4. Dana Darurat & Biaya Tak Terduga   : Rp ${(targetAnggaran * 0.05).toLocaleString('id-ID')}
------------------------------------------------------------------
TOTAL ESTIMASI KEBUTUHAN DANA       : Rp ${targetAnggaran.toLocaleString('id-ID')}

V. LEMBAR PENGESAHAN & PERSETUJUAN
Dibuat oleh,                    Disetujui oleh,

( ${unitPenyelenggara} )        ( Ketua RW 05 Padamukti )`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Print Header for Browser PDF / Printing */}
      <PrintReportHeader
        title="LAPORAN ARSIP DOKUMEN & PROPOSAL RESMI ORGANISASI"
        unitName="SatuWarga ERP - Sekretariat Dokumentasi & Arsip Sukamaju"
        subtitle="Inventarisasi Arsip Digital, Proposal Kegiatan, & Laporan Statistik"
      />

      {/* Header Panel */}
      <div className="neo-card p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[#0056b3] text-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <FolderArchive className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900">Pusat Dokumen, Proposal & Statistik</h2>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Penyimpanan arsip digital, penyusun proposal naskah dinas, serta analisis statistik demografi warga.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="neo-btn-secondary text-xs px-3.5 py-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-900" /> Cetak Laporan PDF
          </button>

          <div className="cupertino-segmented flex items-center bg-slate-100 p-1 rounded-xl border-2 border-slate-900">
            <button
              onClick={() => setActiveTab('ARSIP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'ARSIP'
                  ? 'bg-[#0056b3] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Arsip Dokumen ({arsipList.length})
            </button>
            <button
              onClick={() => setActiveTab('PROPOSAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'PROPOSAL'
                  ? 'bg-[#0056b3] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Generator Proposal
            </button>
            <button
              onClick={() => setActiveTab('STATISTIK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'STATISTIK'
                  ? 'bg-[#0056b3] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Statistik Demografi
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ARSIP DOKUMEN */}
      {activeTab === 'ARSIP' && (
        <div className="space-y-4">
          <div className="neo-card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari Judul Dokumen, Nomor SK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neo-input w-full pl-9"
              />
            </div>

            <button
              onClick={() => {
                const newArsip: ArsipDokumen = {
                  id: 'doc-' + Date.now(),
                  judul: 'Peraturan Tata Tertib Warga RW 05 Tahun 2026',
                  kategori: 'Peraturan RW',
                  nomorDokumen: 'SK-005/RW.05/2026',
                  tanggal: new Date().toISOString().slice(0, 10),
                  fileSize: '1.2 MB',
                  fileUrl: '#',
                  keterangan: 'Dokumen Peraturan Warga Resmi Disahkan',
                };
                onAddArsip(newArsip);
              }}
              className="neo-btn text-xs px-4 py-2"
            >
              <Upload className="w-4 h-4" /> Upload Dokumen Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArsip.map((doc) => (
              <div key={doc.id} className="neo-card p-4 bg-white space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="cupertino-pill bg-amber-200 text-slate-900 px-2.5 py-0.5 font-extrabold text-[10px]">
                      {doc.kategori}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{doc.tanggal}</span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{doc.judul}</h4>
                  <p className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 p-1.5 rounded-lg border border-slate-300">
                    {doc.nomorDokumen}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">{doc.keterangan}</p>
                </div>

                <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-500 font-bold">{doc.fileSize}</span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Mendownload dokumen PDF: ${doc.judul}`);
                    }}
                    className="text-[#0056b3] font-black hover:underline flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" /> Unduh PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROPOSAL GENERATOR TEMPLATE */}
      {activeTab === 'PROPOSAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Side */}
          <div className="neo-card p-5 bg-white space-y-4">
            <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Form Parameter Proposal
              </h3>
              <span className="text-[10px] bg-slate-100 border border-slate-900 font-bold px-2 py-0.5 rounded-full">
                Otomatis Sync
              </span>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                Pilih Template Praktis RT/RW:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="text-left p-2.5 bg-slate-50 hover:bg-amber-100 border-2 border-slate-900 rounded-xl transition text-[11px] font-bold text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-extrabold text-slate-900 mb-1">Judul Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={judulKegiatan}
                  onChange={(e) => setJudulKegiatan(e.target.value)}
                  className="neo-input w-full"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-900 mb-1">Unit Penyelenggara</label>
                <input
                  type="text"
                  value={unitPenyelenggara}
                  onChange={(e) => setUnitPenyelenggara(e.target.value)}
                  className="neo-input w-full"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-900 mb-1">Target Anggaran (Rp)</label>
                <input
                  type="number"
                  value={targetAnggaran}
                  onChange={(e) => setTargetAnggaran(Number(e.target.value))}
                  className="neo-input w-full font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-900 mb-1">Maksud & Tujuan Kegiatan</label>
                <textarea
                  rows={3}
                  value={tujuanSingkat}
                  onChange={(e) => setTujuanSingkat(e.target.value)}
                  className="neo-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Preview Output Side */}
          <div className="neo-card p-5 bg-slate-950 text-slate-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-3">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5 text-xs">
                  <FileText className="w-4 h-4" /> Draft Proposal Siap Cetak
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin' : 'Salin Teks'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 bg-[#0056b3] hover:bg-blue-600 text-white rounded-lg border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto text-slate-200">
                {generatedProposalText}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-sans border-t border-slate-800 pt-2 font-medium">
              Format naskah dinas resmi sesuai standar administrasi tata kelola wilayah RT/RW.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: STATISTIK DEMOGRAFI */}
      {activeTab === 'STATISTIK' && (
        <div className="space-y-6">
          {/* Top KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
                <span>Total Jiwa Terdaftar</span>
                <Users className="w-4 h-4 text-[#0056b3]" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {wargaList.length} Jiwa
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">Tercatat di Wilayah RT 01-10 Sukamaju</p>
            </div>

            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
                <span>Rasio Gender</span>
                <PieChart className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {wargaList.filter((w) => w.jenisKelamin === 'L').length} L /{' '}
                {wargaList.filter((w) => w.jenisKelamin === 'P').length} P
              </div>
              <p className="text-[10px] text-emerald-700 font-bold">Laki-laki & Perempuan</p>
            </div>

            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
                <span>Status Domisili</span>
                <Home className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {wargaList.filter((w) => w.statusWarga === 'TETAP' || w.statusTinggal === 'Tetap').length} Tetap
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                {wargaList.filter((w) => w.statusWarga === 'KONTRAK' || w.statusTinggal === 'Kontrak').length} Kontrak / Sewa
              </p>
            </div>

            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
                <span>Kelompok Usia Produktif</span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">68.4%</div>
              <p className="text-[10px] text-slate-500 font-semibold">Rentang Usia 18 - 59 Tahun</p>
            </div>
          </div>

          {/* Demographic Breakdown Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Age Distribution Table */}
            <div className="bg-white border-2 border-slate-900 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                <BarChart3 className="w-4 h-4 text-[#0056b3]" /> Distribusi Kelompok Usia Warga
              </h3>
              <div className="space-y-3 text-xs font-semibold">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Balita & Batita (0-5 Thn)</span>
                    <span className="font-mono">18 Jiwa (7.3%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-900">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '7.3%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Anak-Anak & Pelajar (6-17 Thn)</span>
                    <span className="font-mono">42 Jiwa (17.1%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-900">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '17.1%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Usia Produktif (18-59 Thn)</span>
                    <span className="font-mono">152 Jiwa (62.0%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-900">
                    <div className="bg-[#0056b3] h-2.5 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Lansia (60+ Thn)</span>
                    <span className="font-mono">33 Jiwa (13.6%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-900">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '13.6%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Breakdown */}
            <div className="bg-white border-2 border-slate-900 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                <Layers className="w-4 h-4 text-purple-600" /> Mata Pencaharian Utama
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">Pegawai Swasta</span>
                  <span className="text-slate-900 font-extrabold font-mono text-sm">84 Orang (34%)</span>
                </div>
                <div className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">Wiraswasta / UMKM</span>
                  <span className="text-slate-900 font-extrabold font-mono text-sm">52 Orang (21%)</span>
                </div>
                <div className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">PNS / TNI / Polri</span>
                  <span className="text-slate-900 font-extrabold font-mono text-sm">28 Orang (11%)</span>
                </div>
                <div className="p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl">
                  <span className="text-slate-500 text-[10px] block">Pelajar / Mahasiswa</span>
                  <span className="text-slate-900 font-extrabold font-mono text-sm">45 Orang (18%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  Eye,
  ShieldCheck,
  X,
  FileText,
  BookOpen,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Surat, Warga } from '../types';
import { PrintSuratModal } from './PrintSuratModal';
import { PrintReportHeader } from './PrintReportHeader';

interface AdministrasiViewProps {
  suratList: Surat[];
  wargaList: Warga[];
  onAddSurat: (surat: Surat) => void;
  onApproveSurat: (id: string) => void;
  onRejectSurat: (id: string) => void;
}

const SURAT_TEMPLATES = [
  {
    title: 'Surat Pengantar RT/RW',
    code: 'SP-RTRW',
    description:
      'Surat ini berfungsi sebagai dokumen pengantar resmi dari pengurus lingkungan setempat untuk menyatakan bahwa pemohon adalah warga setempat yang bermaksud mengurus keperluan administrasi tertentu di tingkat kelurahan atau kecamatan.',
    defaultKeperluan: 'Pengurusan administrasi kependudukan di Kelurahan / Kecamatan',
    category: 'Pengantar Umum',
  },
  {
    title: 'Surat Keterangan Domisili (SKD)',
    code: 'SKD',
    description:
      'Surat resmi ini digunakan untuk membuktikan atau menerangkan tempat tinggal legal seseorang saat ini, baik untuk warga asli maupun pendatang yang sedang merantau untuk keperluan pekerjaan, sekolah, atau bisnis.',
    defaultKeperluan: 'Persyaratan domisili tempat tinggal legal untuk pekerjaan / perbankan / sekolah',
    category: 'Kependudukan',
  },
  {
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    code: 'SKTM',
    description:
      'Surat keterangan ini diterbitkan untuk menyatakan bahwa suatu keluarga atau individu berada dalam kondisi ekonomi kurang mampu, yang biasanya digunakan sebagai syarat mendapat bantuan sosial, beasiswa, atau keringanan biaya medis.',
    defaultKeperluan: 'Pengajuan keringanan biaya pengobatan RS / beasiswa pendidikan / bantuan sosial',
    category: 'Sosial & Keringanan',
  },
  {
    title: 'Surat Keterangan Usaha (SKU)',
    code: 'SKU',
    description:
      'Surat ini dibuat untuk melegalkan atau menerangkan status kepemilikan sebuah usaha mikro atau kecil di wilayah tersebut, yang biasanya diperlukan warga sebagai syarat pengajuan pinjaman modal ke bank.',
    defaultKeperluan: 'Persyaratan pengajuan pinjaman modal usaha KUR Bank / legalitas usaha mikro',
    category: 'Perekonomian',
  },
  {
    title: 'Surat Pengantar Pindah Domisili',
    code: 'SPPD',
    description:
      'Surat resmi ini diajukan oleh warga yang berencana pindah alamat rumah ke luar wilayah RT/RW atau luar kota, yang berfungsi untuk memperbarui data kependudukan pada Kartu Keluarga (KK) dan KTP baru.',
    defaultKeperluan: 'Permohonan penerbitan SKPWNI / pembaruan Kartu Keluarga & KTP alamat baru',
    category: 'Kependudukan',
  },
  {
    title: 'Surat Keterangan Kematian',
    code: 'SK-MATI',
    description:
      'Surat ini diterbitkan sebagai bukti formal bahwa seorang warga telah meninggal dunia di wilayah tersebut, yang nantinya digunakan oleh pihak keluarga untuk mengurus akta kematian, asuransi, hingga pembatalan BPJS.',
    defaultKeperluan: 'Pengurusan Akta Kematian di Disdukcapil / Klaim Asuransi / Penutupan Rekening',
    category: 'Legalitas & Peristiwa',
  },
  {
    title: 'Surat Keterangan Belum Menikah',
    code: 'SKBM',
    description:
      'Surat pernyataan resmi ini digunakan untuk menerangkan bahwa status sipil seorang warga hingga saat ini adalah lajang atau belum pernah menikah, yang umumnya menjadi syarat mutlak pendaftaran pernikahan di KUA/Pencatatan Sipil atau seleksi kerja tertentu.',
    defaultKeperluan: 'Persyaratan pendaftaran pernikahan di KUA / Pencatatan Sipil / Seleksi Kedinasan',
    category: 'Status Sipil',
  },
  {
    title: 'Surat Izin Keramaian',
    code: 'SIK',
    description:
      'Surat pengantar ini diajukan oleh warga yang ingin mengadakan acara besar di lingkungan rumah, seperti resepsi pernikahan atau festival, guna mendapatkan izin keramaian resmi dan jaminan keamanan dari pihak kepolisian setempat.',
    defaultKeperluan: 'Pengajuan Izin Keramaian Resepsi Pernikahan / Acara Festival ke Polsek setempat',
    category: 'Ketertiban & Acara',
  },
  {
    title: 'Surat Keterangan Berkelakuan Baik',
    code: 'SKBB',
    description:
      'Surat pengantar dari lingkungan ini menerangkan bahwa warga yang bersangkutan memiliki rekam jejak sosial yang baik dan tidak pernah membuat kerusuhan, biasanya sebagai dokumen awal untuk mengurus SKCK di kepolisian.',
    defaultKeperluan: 'Persyaratan awal penerbitan SKCK di Kepolisian / Melamar Pekerjaan',
    category: 'Rekomendasi',
  },
  {
    title: 'Surat Kuasa Ahli Waris',
    code: 'SKAW',
    description:
      'Surat resmi ini dibuat secara bersama oleh para ahli waris sah untuk memberikan wewenang kepada salah satu anggota keluarga dalam mengurus pembagian harta peninggalan, pencairan tabungan, atau balik nama sertifikat tanah almarhum.',
    defaultKeperluan: 'Pengurusan pembagian harta warisan / balik nama sertifikat / pencairan tabungan bank',
    category: 'Hukum & Waris',
  },
];

export const AdministrasiView: React.FC<AdministrasiViewProps> = ({
  suratList = [],
  wargaList = [],
  onAddSurat,
  onApproveSurat,
  onRejectSurat,
}) => {
  const [activeSubView, setActiveSubView] = useState<'DAFTAR' | 'KATALOG_TEMPLATE'>('DAFTAR');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // New Surat Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWargaId, setSelectedWargaId] = useState('');
  const [jenisSurat, setJenisSurat] = useState<string>('Surat Pengantar RT/RW');
  const [keperluan, setKeperluan] = useState('');

  // AI Assistant Drafting inside modal
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDraftResult, setAiDraftResult] = useState<string | null>(null);

  // Printing modal
  const [printingSurat, setPrintingSurat] = useState<Surat | null>(null);

  const filteredSurat = suratList.filter((s) => {
    const matchesSearch =
      s.namaWarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jenisSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSurat = (e: React.FormEvent) => {
    e.preventDefault();
    const wargaObj = wargaList.find((w) => w.id === selectedWargaId) || wargaList[0];

    const newSurat: Surat = {
      id: 'srt-' + Date.now(),
      nomorSurat: `0${suratList.length + 15}/ADM-RTRW/VII/2026`,
      jenisSurat: jenisSurat,
      wargaId: wargaObj?.id || 'w-001',
      namaWarga: wargaObj?.nama || 'Warga Terdaftar',
      nik: wargaObj?.nik || '3275011205820001',
      alamatWarga: wargaObj ? `${wargaObj.alamat}, RT ${wargaObj.rt}/RW ${wargaObj.rw}` : 'Wilayah Sukamaju',
      rt: wargaObj?.rt || 'Wilayah',
      rw: wargaObj?.rw || 'Sukamaju',
      keperluan: keperluan || 'Persyaratan Administrasi Resmi',
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
      status: 'MENUNGGU_RT',
      qrCodeHash: `EREKAP-EMS-${jenisSurat.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-VERIFIED`,
    };

    onAddSurat(newSurat);
    setIsModalOpen(false);
    setKeperluan('');
    setAiDraftResult(null);
  };

  const openModalWithTemplate = (tmpl: typeof SURAT_TEMPLATES[0]) => {
    setJenisSurat(tmpl.title);
    setKeperluan(tmpl.defaultKeperluan);
    if (wargaList.length > 0) setSelectedWargaId(wargaList[0].id);
    setIsModalOpen(true);
  };

  const handleAiDraftSurat = async () => {
    const wargaObj = wargaList.find((w) => w.id === selectedWargaId) || wargaList[0];
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/draft-surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenisSurat,
          namaWarga: wargaObj?.nama || 'Bambang Supriadi',
          nik: wargaObj?.nik || '3275011205820001',
          keperluan: keperluan || 'Keperluan Administrasi Perbankan / Kedinasan',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setAiDraftResult(
          `Perihal: ${data.result.perihal}\n\nIsi: ${data.result.isiRingkas}\n\nRekomendasi Pengurus: ${data.result.rekomendasiPengurus}`
        );
      }
    } catch (err) {
      console.error('AI Draft Error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Print Header for Browser PDF / Printing */}
      <PrintReportHeader
        title="LAPORAN REKAPITULASI PERSURATAN & ADMINISTRASI"
        unitName="E-REKAP ENTERPRISE MANAGEMENT SYSTEM - Sekretariat Administrasi"
        subtitle="Laporan Pengajuan Surat Keterangan, Pengantar RT/RW, & Verifikasi Administrasi"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" /> Modul Administrasi & Surat Menyurat
          </h2>
          <p className="text-xs text-slate-500">
            Layanan Surat Keterangan / Pengantar RT/RW dengan Penomoran Otomatis & Verifikasi QR Code.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" /> Cetak Laporan PDF
          </button>
          <button
            onClick={() => {
              if (wargaList.length > 0) setSelectedWargaId(wargaList[0].id);
              setIsModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded font-medium flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ajukan Surat Baru
          </button>
        </div>
      </div>

      {/* Sub-tab Switcher: Daftar Pengajuan vs List Template Surat Warga */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubView('DAFTAR')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeSubView === 'DAFTAR'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Daftar Pengajuan Surat ({suratList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubView('KATALOG_TEMPLATE')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeSubView === 'KATALOG_TEMPLATE'
              ? 'bg-amber-500 text-slate-950 shadow-xs border-2 border-slate-900'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-900" />
          <span>List Template Surat Warga (10 Template Resmi)</span>
        </button>
      </div>

      {/* Sub-View: Katalog Template Surat */}
      {activeSubView === 'KATALOG_TEMPLATE' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-xs text-amber-950">Katalog Template Surat Resmi Lingkungan</h3>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Pilih salah satu dari 10 template surat di bawah ini untuk membuka formulir permohonan dengan isi dan kriteria otomatis yang telah disesuaikan dengan standar administrasi RT/RW & Kelurahan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SURAT_TEMPLATES.map((tmpl, idx) => (
              <div
                key={tmpl.code}
                className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 font-mono text-[10px] font-black uppercase">
                      {idx + 1}. {tmpl.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                      {tmpl.category}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition">
                    {tmpl.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {tmpl.description}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 italic">
                    Keperluan: {tmpl.defaultKeperluan.slice(0, 35)}...
                  </span>
                  <button
                    onClick={() => openModalWithTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs border border-slate-900 shadow-xs flex items-center gap-1 cursor-pointer transition active:translate-y-0.5"
                  >
                    <span>Gunakan Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-View: Daftar Pengajuan Surat */}
      {activeSubView === 'DAFTAR' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari Pemohon, Jenis Surat, No. Surat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="MENUNGGU_RT">Menunggu Approval RT</option>
                <option value="MENUNGGU_RW">Menunggu Approval RW</option>
                <option value="DISETUJUI">Disetujui (Siap Cetak)</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Surat Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="p-3 border-b border-slate-800">No. Surat</th>
                    <th className="p-3 border-b border-slate-800">Jenis Surat</th>
                    <th className="p-3 border-b border-slate-800">Nama Pemohon</th>
                    <th className="p-3 border-b border-slate-800">Keperluan</th>
                    <th className="p-3 border-b border-slate-800">Tgl Pengajuan</th>
                    <th className="p-3 border-b border-slate-800">Status</th>
                    <th className="p-3 border-b border-slate-800 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSurat.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700 text-sm">Belum ada pengajuan surat</p>
                        <p className="text-xs text-slate-500 mt-0.5">Klik "+ Buat Pengajuan Surat" untuk membuat pengajuan baru.</p>
                      </td>
                    </tr>
                  )}
                  {filteredSurat.map((surat) => {
                    let statusBadge = (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> {surat.status}
                      </span>
                    );
                    if (surat.status === 'DISETUJUI') {
                      statusBadge = (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Disetujui
                        </span>
                      );
                    } else if (surat.status === 'DITOLAK') {
                      statusBadge = (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          Ditolak
                        </span>
                      );
                    }

                    return (
                      <tr key={surat.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-semibold text-slate-800">{surat.nomorSurat}</td>
                        <td className="p-3 font-bold text-slate-900">{surat.jenisSurat}</td>
                        <td className="p-3 text-slate-800">
                          <div>{surat.namaWarga}</div>
                          <div className="text-[10px] text-slate-500 font-mono">RT {surat.rt}/RW {surat.rw}</div>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs">{surat.keperluan}</td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">{surat.tanggalPengajuan}</td>
                        <td className="p-3">{statusBadge}</td>
                        <td className="p-3 text-right space-x-1.5">
                          {surat.status !== 'DISETUJUI' && (
                            <button
                              onClick={() => onApproveSurat(surat.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1 rounded font-medium shadow-2xs"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => setPrintingSurat(surat)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] px-2.5 py-1 rounded font-medium inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" /> Cetak Kop
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NEW SURAT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Permohonan Surat Keterangan Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSurat} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pilih Warga Pemohon *</label>
                <select
                  value={selectedWargaId}
                  onChange={(e) => setSelectedWargaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {wargaList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nama} (NIK: {w.nik}) - RT {w.rt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jenis Surat Keterangan *</label>
                <select
                  value={jenisSurat}
                  onChange={(e) => setJenisSurat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {SURAT_TEMPLATES.map((t) => (
                    <option key={t.code} value={t.title}>
                      {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Maksud & Keperluan *</label>
                <textarea
                  rows={3}
                  required
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Persyaratan pembukaan KUR Bank BSI / Pendaftaran sekolah anak"
                />
              </div>

              {/* AI Draft Button */}
              <div className="p-3 bg-amber-50 rounded border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-900 font-semibold text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Bantuan AI Draft Surat Resmi
                  </span>
                  <button
                    type="button"
                    onClick={handleAiDraftSurat}
                    disabled={isAiLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] px-2.5 py-1 rounded font-bold"
                  >
                    {isAiLoading ? 'Menyusun...' : 'Gunakan Gemini AI'}
                  </button>
                </div>

                {aiDraftResult && (
                  <div className="p-2 bg-white rounded border border-amber-300 text-[10px] text-slate-800 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {aiDraftResult}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded font-semibold text-xs shadow-xs"
                >
                  Kirim Permohonan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT SURAT KOP MODAL */}
      {printingSurat && (
        <PrintSuratModal surat={printingSurat} onClose={() => setPrintingSurat(null)} />
      )}
    </div>
  );
};

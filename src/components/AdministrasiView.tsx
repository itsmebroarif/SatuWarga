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
  Edit3,
  Layers,
  Zap,
} from 'lucide-react';
import { Surat, Warga, SuratCategory } from '../types';
import { PrintSuratModal } from './PrintSuratModal';
import { PrintReportHeader } from './PrintReportHeader';
import { A4SuratEditorModal } from './A4SuratEditorModal';
import { ALL_SURAT_TEMPLATES, SURAT_CATEGORIES, SuratTemplate } from '../data/suratTemplates';

interface AdministrasiViewProps {
  suratList: Surat[];
  wargaList: Warga[];
  onAddSurat: (surat: Surat) => void;
  onApproveSurat: (id: string) => void;
  onRejectSurat: (id: string) => void;
}

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
  const [categoryFilter, setCategoryFilter] = useState<SuratCategory | 'ALL'>('ALL');

  // A4 Live Editor Modal state
  const [isA4EditorOpen, setIsA4EditorOpen] = useState(false);
  const [editingA4Surat, setEditingA4Surat] = useState<Surat | null>(null);

  // New Quick Surat Modal
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

  const filteredTemplates = ALL_SURAT_TEMPLATES.filter((t) => {
    return categoryFilter === 'ALL' || t.category === categoryFilter;
  });

  const handleCreateSurat = (e: React.FormEvent) => {
    e.preventDefault();
    const wargaObj = wargaList.find((w) => w.id === selectedWargaId) || wargaList[0];

    const newSurat: Surat = {
      id: 'srt-' + Date.now(),
      nomorSurat: `0${suratList.length + 15}/ADM-EEMS/VII/2026`,
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

  const openA4EditorWithTemplate = (tmpl: SuratTemplate) => {
    const matchedWarga = wargaList.length > 0 ? wargaList[0] : null;
    const initialSuratObj: Surat = {
      id: 'srt-' + Date.now(),
      nomorSurat: `0${suratList.length + 15}/ADM-EEMS/VII/2026`,
      jenisSurat: tmpl.title,
      category: tmpl.category,
      wargaId: matchedWarga?.id || 'w-001',
      namaWarga: matchedWarga?.nama || 'Bambang Supriadi',
      nik: matchedWarga?.nik || '3275011205820001',
      alamatWarga: matchedWarga ? `${matchedWarga.alamat}, RT ${matchedWarga.rt}/RW ${matchedWarga.rw}` : 'Jl. Graha Warga Utama No. 12',
      rt: matchedWarga?.rt || '003',
      rw: matchedWarga?.rw || '012',
      keperluan: tmpl.defaultKeperluan,
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
      status: 'MENUNGGU_RT',
      qrCodeHash: `EEMS-${tmpl.code}-${Date.now().toString().slice(-4)}-VERIFIED`,
      perihal: tmpl.perihal,
      lampiran: tmpl.lampiran,
      sifat: tmpl.sifat,
      tempatSurat: 'Sukamaju',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      kop: tmpl.kop,
      paragrafPembuka: tmpl.paragrafPembuka,
      paragrafIsiUtama: tmpl.paragrafIsiUtama,
      paragrafPenutup: tmpl.paragrafPenutup,
      signatures: tmpl.defaultSignatures,
    };

    setEditingA4Surat(initialSuratObj);
    setIsA4EditorOpen(true);
  };

  const handleSaveA4Surat = (savedSurat: Surat) => {
    onAddSurat(savedSurat);
    setIsA4EditorOpen(false);
    setEditingA4Surat(null);
  };

  const openModalWithTemplate = (tmpl: SuratTemplate) => {
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
            onClick={() => {
              const tmpl = ALL_SURAT_TEMPLATES[0];
              openA4EditorWithTemplate(tmpl);
            }}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-950" /> Buka Live A4 Editor
          </button>
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
          <span>Katalog 18+ Template Surat Resmi</span>
        </button>
      </div>

      {/* Sub-View: Katalog Template Surat */}
      {activeSubView === 'KATALOG_TEMPLATE' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-xs text-amber-950">
                  Katalog 18+ Template Surat Resmi & Editor A4 Interactive
                </h3>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Gunakan pembatas kategori di bawah untuk memfilter template khusus RT, RW, PKK, Karang Taruna, Posyandu, DKM, Linmas, atau Warga. Klik "Buka di A4 Editor" untuk mengedit Kop, Isi, dan Spot Tanda Tangan secara langsung!
                </p>
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Pembatas Based on Category) */}
          <div className="bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-900 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> Pembatas Kategori Surat (18 Template)
              </span>
              <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                {filteredTemplates.length} Ditemukan
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SURAT_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategoryFilter(cat.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer border-2 ${
                    categoryFilter === cat.key
                      ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((tmpl, idx) => (
              <div
                key={tmpl.id}
                className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 font-mono text-[10px] font-black uppercase">
                      {idx + 1}. {tmpl.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${tmpl.badgeBg} ${tmpl.badgeText}`}>
                      {tmpl.categoryLabel}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition">
                    {tmpl.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {tmpl.description}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-slate-500 italic max-w-[180px] truncate">
                    Perihal: {tmpl.perihal}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openA4EditorWithTemplate(tmpl)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border border-slate-900 shadow-xs flex items-center gap-1 cursor-pointer transition active:translate-y-0.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Buka di Editor A4</span>
                    </button>
                  </div>
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
                        <p className="text-xs text-slate-500 mt-0.5">Klik "+ Ajukan Surat Baru" atau pilih dari Katalog Template.</p>
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
                            onClick={() => {
                              setEditingA4Surat(surat);
                              setIsA4EditorOpen(true);
                            }}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border border-slate-900 text-[11px] px-2.5 py-1 rounded inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Edit / Preview A4
                          </button>
                          <button
                            onClick={() => setPrintingSurat(surat)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] px-2.5 py-1 rounded font-medium inline-flex items-center gap-1 cursor-pointer"
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
                  {ALL_SURAT_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title} ({t.categoryLabel})
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

      {/* LIVE A4 EDITOR & PREVIEW MODAL */}
      <A4SuratEditorModal
        isOpen={isA4EditorOpen}
        onClose={() => setIsA4EditorOpen(false)}
        initialSurat={editingA4Surat}
        wargaList={wargaList}
        onSave={handleSaveA4Surat}
      />

      {/* PRINT SURAT KOP MODAL */}
      {printingSurat && (
        <PrintSuratModal surat={printingSurat} onClose={() => setPrintingSurat(null)} />
      )}
    </div>
  );
};

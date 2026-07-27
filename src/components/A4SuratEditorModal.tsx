import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Sparkles,
  Save,
  FileText,
  CheckCircle,
  ShieldCheck,
  Building2,
  User,
  PenTool,
  Sliders,
  Plus,
  Trash2,
  Zap,
  Home,
  Users,
  Heart,
  BookOpen,
  Shield,
  Layers,
  ArrowRight,
  Eye,
  Edit3,
} from 'lucide-react';
import { Surat, Warga, KopSuratConfig, SignatureSpot, SuratCategory } from '../types';
import { ALL_SURAT_TEMPLATES, SURAT_CATEGORIES, SuratTemplate } from '../data/suratTemplates';

interface A4SuratEditorModalProps {
  initialSurat?: Surat | null;
  wargaList: Warga[];
  onClose: () => void;
  onSaveSurat: (surat: Surat) => void;
}

export const A4SuratEditorModal: React.FC<A4SuratEditorModalProps> = ({
  initialSurat,
  wargaList,
  onClose,
  onSaveSurat,
}) => {
  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<SuratCategory | 'ALL'>('ALL');
  
  // Selected Template
  const [selectedTemplateCode, setSelectedTemplateCode] = useState<string>(
    initialSurat?.category ? initialSurat.jenisSurat : 'SP-RTRW'
  );

  // Layout View Mode: 'SPLIT' (Side-by-Side Editor + A4 Preview), 'A4_FULL' (Full A4 Preview), 'EDITOR_ONLY' (Mobile friendly editor)
  const [viewMode, setViewMode] = useState<'SPLIT' | 'A4_FULL' | 'EDITOR_ONLY'>('SPLIT');

  // Active Editor Sub-tab
  const [editorTab, setEditorTab] = useState<'KOP' | 'PEMOHON' | 'ISI' | 'SIGNATURES' | 'AI'>('PEMOHON');

  // Selected Warga
  const [selectedWargaId, setSelectedWargaId] = useState<string>(
    initialSurat?.wargaId || (wargaList.length > 0 ? wargaList[0].id : '')
  );

  // Form State
  const [jenisSurat, setJenisSurat] = useState<string>(
    initialSurat?.jenisSurat || 'Surat Pengantar RT/RW'
  );
  const [nomorSurat, setNomorSurat] = useState<string>(
    initialSurat?.nomorSurat || `0${Math.floor(Math.random() * 80) + 10}/ADM-EEMS/${new Date().getFullYear()}`
  );
  const [perihal, setPerihal] = useState<string>(initialSurat?.perihal || 'Surat Pengantar Administrasi Lingkungan');
  const [lampiran, setLampiran] = useState<string>(initialSurat?.lampiran || '-');
  const [sifat, setSifat] = useState<string>(initialSurat?.sifat || 'Biasa');
  const [tempatSurat, setTempatSurat] = useState<string>(initialSurat?.tempatSurat || 'Sukamaju');
  const [tanggalSurat, setTanggalSurat] = useState<string>(
    initialSurat?.tanggalSurat ||
      new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  );

  // Pemohon Details
  const [namaWarga, setNamaWarga] = useState<string>(initialSurat?.namaWarga || 'Bambang Supriadi');
  const [nikWarga, setNikWarga] = useState<string>(initialSurat?.nik || '3275011205820001');
  const [alamatWarga, setAlamatWarga] = useState<string>(initialSurat?.alamatWarga || 'Jl. Graha Warga Utama No. 12, RT 003/RW 012');
  const [rtWarga, setRtWarga] = useState<string>(initialSurat?.rt || '003');
  const [rwWarga, setRwWarga] = useState<string>(initialSurat?.rw || '012');
  const [tempatLahirWarga, setTempatLahirWarga] = useState<string>(initialSurat?.tempatLahirWarga || 'Depok');
  const [tanggalLahirWarga, setTanggalLahirWarga] = useState<string>(initialSurat?.tanggalLahirWarga || '12 Mei 1982');
  const [jenisKelaminWarga, setJenisKelaminWarga] = useState<string>(initialSurat?.jenisKelaminWarga || 'Laki-laki');
  const [pekerjaanWarga, setPekerjaanWarga] = useState<string>(initialSurat?.pekerjaanWarga || 'Karyawan Swasta');
  const [keperluan, setKeperluan] = useState<string>(
    initialSurat?.keperluan || 'Persyaratan pengurusan Administrasi Kependudukan di Kelurahan / Kecamatan'
  );

  // Kop Configuration
  const [kop, setKop] = useState<KopSuratConfig>(
    initialSurat?.kop || {
      headerLine1: 'RUKUN TETANGGA 003 / RUKUN WARGA 012',
      headerLine2: 'DESA / KELURAHAN SUKAMAJU - KECAMATAN TAPOS',
      headerLine3: 'KOTA DEPOK - PROVINSI JAWA BARAT',
      alamatContact: 'Sekretariat: Jl. Graha Warga Utama No. 12, Telp/WA: 0812-9876-5432, Kode Pos 16455',
      logoIcon: 'RTRW',
      borderStyle: 'DOUBLE',
    }
  );

  // Body Content Paragraphs
  const [paragrafPembuka, setParagrafPembuka] = useState<string>(
    initialSurat?.paragrafPembuka ||
      'Yang bertanda tangan di bawah ini Pengurus RT 003 / RW 012 Kelurahan Sukamaju, dengan ini menerangkan bahwa:'
  );
  const [paragrafIsiUtama, setParagrafIsiUtama] = useState<string>(
    initialSurat?.paragrafIsiUtama ||
      'Bahwa orang tersebut diatas adalah benar warga menetap yang berdomisili di lingkungan kami dan memiliki kelakuan baik. Surat Pengantar ini dibuat khusus untuk keperluan:'
  );
  const [paragrafPenutup, setParagrafPenutup] = useState<string>(
    initialSurat?.paragrafPenutup ||
      'Demikian Surat Pengantar ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.'
  );

  // Signatures
  const [signatures, setSignatures] = useState<SignatureSpot[]>(
    initialSurat?.signatures || [
      { id: 'sig-1', jabatan: 'Ketua RT 003', nama: 'Bambang Supriadi', nikNip: 'NIK. 3275011205820001', showStempel: true, stempelLabel: 'STEMPEL RT 003', showQrVerify: true },
      { id: 'sig-2', jabatan: 'Ketua RW 012', nama: 'H. Suryadi, S.E.', nikNip: 'NIK. 3275010904710003', showStempel: true, stempelLabel: 'STEMPEL RW 012', showQrVerify: true },
    ]
  );

  // AI Loading & Result State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  // Handle template selection change
  const applyTemplate = (tmpl: SuratTemplate) => {
    setSelectedTemplateCode(tmpl.code);
    setJenisSurat(tmpl.title);
    setPerihal(tmpl.perihal);
    setLampiran(tmpl.lampiran);
    setSifat(tmpl.sifat);
    setKop(tmpl.kop);
    setParagrafPembuka(tmpl.paragrafPembuka);
    setParagrafIsiUtama(tmpl.paragrafIsiUtama);
    setParagrafPenutup(tmpl.paragrafPenutup);
    setKeperluan(tmpl.defaultKeperluan);
    setSignatures(tmpl.defaultSignatures);
  };

  // Sync Warga Selection
  useEffect(() => {
    if (selectedWargaId) {
      const w = wargaList.find((item) => item.id === selectedWargaId);
      if (w) {
        setNamaWarga(w.nama);
        setNikWarga(w.nik);
        setAlamatWarga(`${w.alamat}, RT ${w.rt}/RW ${w.rw}`);
        setRtWarga(w.rt);
        setRwWarga(w.rw);
        setTempatLahirWarga(w.tempatLahir || 'Depok');
        setTanggalLahirWarga(w.tanggalLahir || '1990-01-01');
        setJenisKelaminWarga(w.jenisKelamin || 'Laki-laki');
        setPekerjaanWarga(w.pekerjaan || 'Wiraswasta');
      }
    }
  }, [selectedWargaId, wargaList]);

  // Filter Templates
  const filteredTemplates = ALL_SURAT_TEMPLATES.filter((t) => {
    return activeCategory === 'ALL' || t.category === activeCategory;
  });

  // Handle Add Signature
  const handleAddSignature = () => {
    if (signatures.length >= 3) return;
    const newSig: SignatureSpot = {
      id: 'sig-' + Date.now(),
      jabatan: signatures.length === 0 ? 'Pemohon' : signatures.length === 1 ? 'Ketua RT 003' : 'Ketua RW 012',
      nama: signatures.length === 0 ? namaWarga : 'Nama Pejabat Penandatangan',
      showStempel: true,
      stempelLabel: 'STEMPEL STAMP',
      showQrVerify: true,
    };
    setSignatures([...signatures, newSig]);
  };

  // Handle Remove Signature
  const handleRemoveSignature = (id: string) => {
    setSignatures(signatures.filter((s) => s.id !== id));
  };

  // Handle Signature Change
  const updateSignature = (id: string, field: keyof SignatureSpot, value: any) => {
    setSignatures(
      signatures.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Save Surat Handler
  const handleSave = () => {
    const savedSurat: Surat = {
      id: initialSurat?.id || 'srt-' + Date.now(),
      nomorSurat,
      jenisSurat,
      category: activeCategory === 'ALL' ? 'RT_RW' : activeCategory,
      wargaId: selectedWargaId || 'w-001',
      namaWarga,
      nik: nikWarga,
      alamatWarga,
      rt: rtWarga,
      rw: rwWarga,
      keperluan,
      tanggalPengajuan: initialSurat?.tanggalPengajuan || new Date().toISOString().slice(0, 10),
      status: initialSurat?.status || 'MENUNGGU_RT',
      qrCodeHash: initialSurat?.qrCodeHash || `EEMS-${jenisSurat.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-VERIFIED`,
      perihal,
      lampiran,
      sifat,
      tempatSurat,
      tanggalSurat,
      kop,
      tempatLahirWarga,
      tanggalLahirWarga,
      jenisKelaminWarga,
      pekerjaanWarga,
      paragrafPembuka,
      paragrafIsiUtama,
      paragrafPenutup,
      signatures,
    };

    onSaveSurat(savedSurat);
  };

  // AI Assistant Drafting
  const handleAiRefine = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/draft-surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenisSurat,
          namaWarga,
          nik: nikWarga,
          keperluan: aiPrompt || keperluan,
        }),
      });
      const data = await res.json();
      if (data.result) {
        if (data.result.perihal) setPerihal(data.result.perihal);
        if (data.result.isiRingkas) setParagrafIsiUtama(data.result.isiRingkas);
        if (data.result.rekomendasiPengurus) setParagrafPenutup(data.result.rekomendasiPengurus);
      }
    } catch (err) {
      console.error('AI Draft Error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Icon Helper for Logo
  const renderKopLogo = (logoIcon: string) => {
    switch (logoIcon) {
      case 'PKK':
        return <Users className="w-12 h-12 text-pink-700" />;
      case 'KARANG_TARUNA':
        return <Zap className="w-12 h-12 text-amber-600" />;
      case 'POSYANDU':
        return <Heart className="w-12 h-12 text-purple-700" />;
      case 'DKM':
        return <BookOpen className="w-12 h-12 text-teal-700" />;
      case 'LINMAS':
        return <Shield className="w-12 h-12 text-slate-800" />;
      case 'GARUDA':
        return <Building2 className="w-12 h-12 text-amber-700" />;
      default:
        return <Home className="w-12 h-12 text-emerald-700" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 text-white p-3 px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_#ffffff]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                A4 Live Editor & Preview Surat Menyurat
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                E-REKAP EMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              18+ Template Resmi • Kategori Pembatas (RT, RW, PKK, Katar, Posyandu, DKM, Linmas, Warga)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('SPLIT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'SPLIT' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('A4_FULL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'A4_FULL' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Full A4 Paper
            </button>
            <button
              onClick={() => setViewMode('EDITOR_ONLY')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'EDITOR_ONLY' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Editor Only
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 border border-emerald-400 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak A4 / PDF
          </button>

          <button
            onClick={handleSave}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_0px_#ffffff] transition cursor-pointer"
          >
            <Save className="w-4 h-4" /> Simpan Surat
          </button>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-950">
        
        {/* LEFT / TOP CONTROL PANEL (EDITOR & TEMPLATES) */}
        <div
          className={`overflow-y-auto border-r border-slate-800 bg-slate-900 text-slate-100 p-4 space-y-4 ${
            viewMode === 'A4_FULL' ? 'hidden' : viewMode === 'EDITOR_ONLY' ? 'w-full' : 'w-full md:w-1/2 lg:w-5/12'
          }`}
        >
          {/* SECTION 1: CATEGORY PEMBATAS & TEMPLATE PICKER */}
          <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> Category Pembatas & Template
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                18 Template
              </span>
            </div>

            {/* Category Filter Pills (Pembatas Based On Category) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SURAT_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key as any)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition cursor-pointer border ${
                    activeCategory === cat.key
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Template Selector Dropdown / Cards */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Pilih Template Surat ({filteredTemplates.length} Tersedia):
              </label>
              <select
                value={selectedTemplateCode}
                onChange={(e) => {
                  const tmpl = ALL_SURAT_TEMPLATES.find((t) => t.code === e.target.value);
                  if (tmpl) applyTemplate(tmpl);
                }}
                className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
              >
                {filteredTemplates.map((t) => (
                  <option key={t.code} value={t.code}>
                    [{t.code}] {t.title} ({t.categoryLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 2: EDITOR SUB-TABS */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setEditorTab('PEMOHON')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center gap-1 ${
                editorTab === 'PEMOHON' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Pemohon
            </button>
            <button
              onClick={() => setEditorTab('KOP')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center gap-1 ${
                editorTab === 'KOP' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Kop Surat
            </button>
            <button
              onClick={() => setEditorTab('ISI')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center gap-1 ${
                editorTab === 'ISI' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Isi Surat
            </button>
            <button
              onClick={() => setEditorTab('SIGNATURES')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center gap-1 ${
                editorTab === 'SIGNATURES' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" /> Tanda Tangan
            </button>
            <button
              onClick={() => setEditorTab('AI')}
              className={`py-1.5 px-2 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center gap-1 ${
                editorTab === 'AI' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-amber-400 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI
            </button>
          </div>

          {/* SUB-TAB 1: DATA PEMOHON */}
          {editorTab === 'PEMOHON' && (
            <div className="space-y-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200">Pilih Warga Terdaftar / Input Manual</span>
                <span className="text-[10px] text-slate-400">{wargaList.length} Warga</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Dari Master Data Warga:</label>
                <select
                  value={selectedWargaId}
                  onChange={(e) => setSelectedWargaId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="">-- Mode Input Manual --</option>
                  {wargaList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nama} (NIK: {w.nik}) - RT {w.rt}/RW {w.rw}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nama Lengkap Warga</label>
                  <input
                    type="text"
                    value={namaWarga}
                    onChange={(e) => setNamaWarga(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">NIK Warga (16 Digit)</label>
                  <input
                    type="text"
                    value={nikWarga}
                    onChange={(e) => setNikWarga(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={tempatLahirWarga}
                    onChange={(e) => setTempatLahirWarga(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={tanggalLahirWarga}
                    onChange={(e) => setTanggalLahirWarga(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={pekerjaanWarga}
                    onChange={(e) => setPekerjaanWarga(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Jenis Kelamin</label>
                  <select
                    value={jenisKelaminWarga}
                    onChange={(e) => setJenisKelaminWarga(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Alamat Domisili Lengkap</label>
                <textarea
                  rows={2}
                  value={alamatWarga}
                  onChange={(e) => setAlamatWarga(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* SUB-TAB 2: KOP SURAT EDITOR */}
          {editorTab === 'KOP' && (
            <div className="space-y-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Pengaturan Kop Surat (Header)</span>
                <span className="text-[10px] text-amber-400 font-mono">Resmi Indonesia</span>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Pilih Logo / Icon Kop Surat:</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[
                    { id: 'RTRW', label: 'RT/RW' },
                    { id: 'PKK', label: 'PKK' },
                    { id: 'KARANG_TARUNA', label: 'Katar' },
                    { id: 'POSYANDU', label: 'Posyandu' },
                    { id: 'DKM', label: 'DKM' },
                    { id: 'LINMAS', label: 'Linmas' },
                    { id: 'GARUDA', label: 'Garuda' },
                  ].map((lg) => (
                    <button
                      key={lg.id}
                      type="button"
                      onClick={() => setKop({ ...kop, logoIcon: lg.id as any })}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition text-center cursor-pointer ${
                        kop.logoIcon === lg.id
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {lg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Baris 1 (Instansi/Organisasi Utama)</label>
                <input
                  type="text"
                  value={kop.headerLine1}
                  onChange={(e) => setKop({ ...kop, headerLine1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Baris 2 (Kelurahan / Kecamatan / Sub-Unit)</label>
                <input
                  type="text"
                  value={kop.headerLine2}
                  onChange={(e) => setKop({ ...kop, headerLine2: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Baris 3 (Kota / Kabupaten / Provinsi)</label>
                <input
                  type="text"
                  value={kop.headerLine3}
                  onChange={(e) => setKop({ ...kop, headerLine3: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Alamat Kontak & Kode Pos Footer Kop</label>
                <textarea
                  rows={2}
                  value={kop.alamatContact}
                  onChange={(e) => setKop({ ...kop, alamatContact: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Garis Pembatas Kop (Border Line)</label>
                <select
                  value={kop.borderStyle}
                  onChange={(e) => setKop({ ...kop, borderStyle: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="DOUBLE">Garis Ganda Tebal (Double Lines - Standar Resmi)</option>
                  <option value="SINGLE">Garis Tunggal Solid (Single Line)</option>
                  <option value="THICK">Garis Hitam Sangat Tebal (Thick Line)</option>
                </select>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: ISI SURAT & METADATA */}
          {editorTab === 'ISI' && (
            <div className="space-y-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="font-bold text-slate-200 border-b border-slate-800 pb-2">
                Isi Paragraf & Judul Surat A4
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Judul / Jenis Surat</label>
                  <input
                    type="text"
                    value={jenisSurat}
                    onChange={(e) => setJenisSurat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Nomor Surat Resmi</label>
                  <input
                    type="text"
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Perihal</label>
                  <input
                    type="text"
                    value={perihal}
                    onChange={(e) => setPerihal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tempat & Tanggal Penerbitan</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempatSurat}
                      onChange={(e) => setTempatSurat(e.target.value)}
                      placeholder="Tempat"
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200"
                    />
                    <input
                      type="text"
                      value={tanggalSurat}
                      onChange={(e) => setTanggalSurat(e.target.value)}
                      placeholder="Tanggal"
                      className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Keperluan Utama Surat</label>
                <textarea
                  rows={2}
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Paragraf Pembuka</label>
                <textarea
                  rows={2}
                  value={paragrafPembuka}
                  onChange={(e) => setParagrafPembuka(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Paragraf Isi Utama</label>
                <textarea
                  rows={3}
                  value={paragrafIsiUtama}
                  onChange={(e) => setParagrafIsiUtama(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Paragraf Penutup</label>
                <textarea
                  rows={2}
                  value={paragrafPenutup}
                  onChange={(e) => setParagrafPenutup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* SUB-TAB 4: SPOT TANDA TANGAN */}
          {editorTab === 'SIGNATURES' && (
            <div className="space-y-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200">Spot Penandatangan & Stempel ({signatures.length}/3)</span>
                {signatures.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddSignature}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah Penandatangan
                  </button>
                )}
              </div>

              {signatures.map((sig, index) => (
                <div key={sig.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">
                      Penandatangan #{index + 1}
                    </span>
                    {signatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSignature(sig.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Jabatan / Peran</label>
                      <input
                        type="text"
                        value={sig.jabatan}
                        onChange={(e) => updateSignature(sig.id, 'jabatan', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Nama Lengkap Pejabat</label>
                      <input
                        type="text"
                        value={sig.nama}
                        onChange={(e) => updateSignature(sig.id, 'nama', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sig.showStempel}
                        onChange={(e) => updateSignature(sig.id, 'showStempel', e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      <span>Tampilkan Stempel Digital</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sig.showQrVerify}
                        onChange={(e) => updateSignature(sig.id, 'showQrVerify', e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      <span>Tampilkan QR E-Signature</span>
                    </label>
                  </div>

                  {sig.showStempel && (
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Teks Stempel Digital</label>
                      <input
                        type="text"
                        value={sig.stempelLabel || 'STEMPEL RESMI'}
                        onChange={(e) => updateSignature(sig.id, 'stempelLabel', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-emerald-400 font-mono text-[10px]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 5: GEMINI AI ASSISTANT */}
          {editorTab === 'AI' && (
            <div className="space-y-3 bg-amber-950/30 p-3.5 rounded-2xl border border-amber-900/50 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold border-b border-amber-900/40 pb-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Bantuan Penyusunan Kata Gemini AI
              </div>

              <p className="text-amber-200/80 text-[11px] leading-relaxed">
                Ketik instruksi khusus jika Anda ingin AI menyempurnakan kalimat perihal, paragraf isi, atau rekomendasi pada surat ini.
              </p>

              <div>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Contoh: Buatkan permohonan rekomendasi bantuan sosial untuk keluarga beranggota 5 orang..."
                  className="w-full bg-slate-950 border border-amber-900/80 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                onClick={handleAiRefine}
                disabled={isAiLoading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2 rounded-xl border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                {isAiLoading ? 'Menyusun Surat dengan Gemini AI...' : 'Susun & Rapikan Kalimat dengan AI'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT / BOTTOM DISPLAY PANEL: REAL A4 SHEET PREVIEW */}
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/90 ${
            viewMode === 'EDITOR_ONLY' ? 'hidden' : 'block'
          }`}
        >
          {/* EXACT A4 PAPER CANVAS (210mm x 297mm Proportion Sheet) */}
          <div
            id="surat-a4-printable"
            className="bg-white text-slate-950 w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xs font-serif space-y-6 print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-none transition-all my-auto"
          >
            {/* 1. KOP SURAT HEADER */}
            <div className="relative border-b-4 border-double border-slate-950 pb-4 flex items-center justify-between gap-4">
              <div className="shrink-0 p-1">{renderKopLogo(kop.logoIcon)}</div>

              <div className="text-center flex-1 space-y-1">
                <h3 className="font-extrabold text-base sm:text-lg tracking-widest uppercase text-slate-950 leading-tight">
                  {kop.headerLine1}
                </h3>
                <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase text-slate-800 leading-tight">
                  {kop.headerLine2}
                </h4>
                {kop.headerLine3 && (
                  <p className="text-xs font-bold tracking-wide uppercase text-slate-700">
                    {kop.headerLine3}
                  </p>
                )}
                <p className="text-[11px] font-sans text-slate-600 italic leading-snug pt-0.5">
                  {kop.alamatContact}
                </p>
              </div>

              <div className="shrink-0 p-1 opacity-0 pointer-events-none hidden sm:block">
                {renderKopLogo(kop.logoIcon)}
              </div>
            </div>

            {/* 2. SURAT TITLE & NUMBER */}
            <div className="text-center space-y-1 pt-1">
              <h2 className="font-extrabold text-base sm:text-lg uppercase underline tracking-wider text-slate-950">
                {jenisSurat}
              </h2>
              <p className="font-mono text-xs text-slate-800 font-bold">Nomor: {nomorSurat}</p>
            </div>

            {/* 3. PERIHAL & LAMPIRAN META */}
            <div className="flex justify-between text-xs font-sans text-slate-800 border-b border-slate-200 pb-2">
              <div className="space-y-0.5">
                <div><span className="inline-block w-20 font-semibold">Perihal</span>: <span className="font-bold">{perihal}</span></div>
                <div><span className="inline-block w-20 font-semibold">Lampiran</span>: {lampiran}</div>
              </div>
              <div className="text-right space-y-0.5">
                <div><span className="font-semibold">Sifat</span>: {sifat}</div>
                <div>{tempatSurat}, {tanggalSurat}</div>
              </div>
            </div>

            {/* 4. BODY CONTENT & TABLE DATA PEMOHON */}
            <div className="text-xs sm:text-sm text-slate-900 space-y-4 leading-relaxed font-sans">
              <p className="text-justify">{paragrafPembuka}</p>

              {/* Data Table */}
              <div className="pl-4 pr-2 my-3">
                <table className="w-full text-xs sm:text-sm font-sans border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="w-36 py-1.5 font-semibold text-slate-700">Nama Lengkap</td>
                      <td className="w-4 py-1.5">:</td>
                      <td className="py-1.5 font-bold text-slate-950">{namaWarga}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-semibold text-slate-700">NIK / Nomor Identitas</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 font-mono font-bold text-slate-900">{nikWarga}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-semibold text-slate-700">Tempat, Tgl Lahir</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5">{tempatLahirWarga}, {tanggalLahirWarga}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-semibold text-slate-700">Jenis Kelamin / Pekerjaan</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5">{jenisKelaminWarga} / {pekerjaanWarga}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 font-semibold text-slate-700">Alamat Domisili</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5">{alamatWarga}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-semibold text-slate-700">Maksud / Keperluan</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 font-extrabold text-slate-950 bg-amber-50/50 p-1 rounded border border-amber-200">
                        {keperluan}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-justify">{paragrafIsiUtama}</p>

              <p className="text-justify">{paragrafPenutup}</p>
            </div>

            {/* 5. SIGNATURE SPOTS */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 text-center text-xs font-sans gap-4 items-end">
              {signatures.map((sig, idx) => (
                <div key={sig.id} className="space-y-1">
                  <p className="text-slate-600 text-[11px]">
                    {idx === signatures.length - 1 ? `${tempatSurat}, ${tanggalSurat}` : 'Mengetahui,'}
                  </p>
                  <p className="font-extrabold text-slate-950 uppercase">{sig.jabatan}</p>

                  {/* Stamp / Verification Spot */}
                  <div className="h-20 flex items-center justify-center my-1">
                    {sig.showStempel ? (
                      <div className="w-20 h-20 border-2 border-dashed border-emerald-600 rounded-full flex flex-col items-center justify-center p-1 text-emerald-700 text-[8px] font-black rotate-[-6deg] bg-emerald-50/30">
                        <span>{sig.stempelLabel || 'STEMPEL RESMI'}</span>
                        <CheckCircle className="w-4 h-4 text-emerald-600 my-0.5" />
                        <span>VERIFIED</span>
                      </div>
                    ) : sig.showQrVerify ? (
                      <div className="border border-slate-300 p-1.5 rounded bg-slate-50 flex items-center gap-1.5">
                        <div className="w-9 h-9 bg-slate-900 text-amber-300 font-mono font-bold text-[7px] flex items-center justify-center p-0.5 text-center">
                          E-SIGN
                        </div>
                        <div className="text-[7px] text-left font-mono">
                          <p className="font-bold text-emerald-700">VERIFIED</p>
                          <p>HASH-VALID</p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-12 border-b border-slate-300 w-28 mx-auto" />
                    )}
                  </div>

                  <p className="font-extrabold underline text-slate-950 uppercase">{sig.nama}</p>
                  {sig.nikNip && <p className="text-[10px] text-slate-600 font-mono">{sig.nikNip}</p>}
                </div>
              ))}
            </div>

            {/* 6. FOOTER SECURITY & VALIDATION */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-sans mt-auto">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Digital Document Validated by E-REKAP ENTERPRISE MANAGEMENT SYSTEM
              </span>
              <span className="font-mono text-[9px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                A4 Official Standard
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

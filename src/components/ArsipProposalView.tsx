import React, { useState } from 'react';
import {
  FolderArchive,
  FileText,
  Sparkles,
  Search,
  Download,
  Plus,
  Upload,
  Printer,
  X,
  FileCheck,
} from 'lucide-react';
import { ArsipDokumen } from '../types';

interface ArsipProposalViewProps {
  arsipList: ArsipDokumen[];
  onAddArsip: (a: ArsipDokumen) => void;
}

export const ArsipProposalView: React.FC<ArsipProposalViewProps> = ({
  arsipList = [],
  onAddArsip,
}) => {
  const [activeTab, setActiveTab] = useState<'ARSIP' | 'PROPOSAL'>('ARSIP');
  const [searchTerm, setSearchTerm] = useState('');

  // AI Proposal Form State
  const [judulKegiatan, setJudulKegiatan] = useState('Peringatan HUT RI ke-81 RW 05');
  const [unitPenyelenggara, setUnitPenyelenggara] = useState('Karang Taruna');
  const [targetAnggaran, setTargetAnggaran] = useState(15000000);
  const [tujuanSingkat, setTujuanSingkat] = useState(
    'Meningkatkan rasa nasionalisme, kebersamaan warga, dan kompetisi olahraga antar RT 01-05.'
  );

  const [aiProposalResult, setAiProposalResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredArsip = arsipList.filter(
    (a) =>
      a.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateProposal = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judulKegiatan,
          unitPenyelenggara,
          targetAnggaran,
          tujuanSingkat,
        }),
      });
      const data = await res.json();
      if (data.proposal) {
        setAiProposalResult(
          `# ${data.proposal.judul}\n\n## 1. Pendahuluan & Latar Belakang\n${data.proposal.latarBelakang}\n\n## 2. Rincian Estimasi Anggaran\n${data.proposal.rincianAnggaran}\n\n## 3. Penutup\n${data.proposal.penutup}`
        );
      }
    } catch (e) {
      console.error('Proposal Gen Error:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-emerald-600" /> Modul Arsip Digital & Generator Proposal
          </h2>
          <p className="text-xs text-slate-500">
            Penyimpanan Dokumen Resmi Organisasi & Pembuatan Proposal Kegiatan Berbasis Gemini AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer border border-slate-700"
          >
            <Printer className="w-4 h-4 text-emerald-400" /> Cetak Laporan Arsip (Print)
          </button>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('ARSIP')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'ARSIP'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Arsip Dokumen ({arsipList.length})
            </button>
            <button
              onClick={() => setActiveTab('PROPOSAL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'PROPOSAL'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-300" /> AI Generator Proposal
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ARSIP DOKUMEN */}
      {activeTab === 'ARSIP' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari Judul Dokumen, SK, Kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
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
                  keterangan: 'Dokumen Peraturan Warga Resmi',
                };
                onAddArsip(newArsip);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-1.5 rounded font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Dokumen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArsip.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {doc.kategori}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{doc.tanggal}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">{doc.judul}</h4>
                <p className="font-mono text-[11px] text-slate-500">{doc.nomorDokumen}</p>
                <p className="text-xs text-slate-600">{doc.keterangan}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-400">{doc.fileSize}</span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Mendownload dokumen ${doc.judul}`);
                    }}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI PROPOSAL GENERATOR */}
      {activeTab === 'PROPOSAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Parameter Proposal Kegiatan AI
            </h3>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Judul Kegiatan *</label>
              <input
                type="text"
                required
                value={judulKegiatan}
                onChange={(e) => setJudulKegiatan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Unit Penyelenggara</label>
              <select
                value={unitPenyelenggara}
                onChange={(e) => setUnitPenyelenggara(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-medium"
              >
                <option value="Karang Taruna">Karang Taruna Karya Muda</option>
                <option value="Pengurus RT 01">Pengurus RT 01</option>
                <option value="Pengurus RW 05">Pengurus RW 05</option>
                <option value="PKK RW 05">PKK RW 05</option>
                <option value="DKM Al-Ikhlas">DKM Masjid Al-Ikhlas</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Estimasi Target Anggaran (Rp)</label>
              <input
                type="number"
                value={targetAnggaran}
                onChange={(e) => setTargetAnggaran(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tujuan & Maksud Kegiatan</label>
              <textarea
                rows={3}
                value={tujuanSingkat}
                onChange={(e) => setTujuanSingkat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
              />
            </div>

            <button
              onClick={handleGenerateProposal}
              disabled={isAiLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-bold shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isAiLoading ? 'Gemini AI Sedang Menyusun Proposal...' : 'Generate Proposal Otomatis'}
            </button>
          </div>

          {/* Result Output Preview */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-lg border border-slate-800 shadow-xs space-y-3 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Hasil Draft Proposal Resmi
                </span>
                {aiProposalResult && (
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-2.5 py-1 rounded font-sans flex items-center gap-1 border border-slate-700"
                  >
                    <Printer className="w-3 h-3" /> Print Proposal
                  </button>
                )}
              </div>

              {aiProposalResult ? (
                <div className="whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto text-slate-200">
                  {aiProposalResult}
                </div>
              ) : (
                <div className="text-slate-500 text-center py-20 italic">
                  Klik "Generate Proposal Otomatis" untuk menyusun struktur proposal lengkap dengan Gemini AI.
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 font-sans">
              Format proposal sesuai standar tata naskah dinas organisasi RT/RW.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

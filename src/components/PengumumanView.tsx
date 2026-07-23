import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  FileCode,
  Download,
  AlertCircle,
  X,
  Share2,
  Calendar,
  User,
  Megaphone,
} from 'lucide-react';
import { PengumumanItem, UnitCategory } from '../types';

interface PengumumanViewProps {
  pengumumanList: PengumumanItem[];
  onAddPengumuman: (item: PengumumanItem) => void;
  currentRole?: string;
}

export const PengumumanView: React.FC<PengumumanViewProps> = ({
  pengumumanList = [],
  onAddPengumuman,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('SEMUA');
  const [selectedTipe, setSelectedTipe] = useState<string>('SEMUA');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [unitIssuer, setUnitIssuer] = useState<UnitCategory>('RW');
  const [kategori, setKategori] = useState<'PENTING' | 'KEGIATAN' | 'INFORMASI' | 'HIMBAUAN'>('INFORMASI');
  const [tipe, setTipe] = useState<'BANNER' | 'POSTER' | 'ARTICLE' | 'PDF'>('BANNER');
  const [penulis, setPenulis] = useState('Pengurus RT/RW');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Selected Detail Modal State
  const [activeDetail, setActiveDetail] = useState<PengumumanItem | null>(null);

  const filteredList = pengumumanList.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKategori = selectedKategori === 'SEMUA' || item.kategori === selectedKategori;
    const matchesTipe = selectedTipe === 'SEMUA' || (item.tipe || 'ARTICLE') === selectedTipe;
    return matchesSearch && matchesKategori && matchesTipe;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;

    const newItem: PengumumanItem = {
      id: 'pgm-' + Date.now(),
      judul,
      isi,
      unitIssuer,
      tanggal: new Date().toISOString().slice(0, 10),
      kategori,
      tipe,
      penulis: penulis || 'Pengurus RT/RW',
      mediaUrl: mediaUrl || (tipe === 'BANNER' || tipe === 'POSTER' ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80' : undefined),
      isUrgent,
    };

    onAddPengumuman(newItem);
    setIsModalOpen(false);
    setJudul('');
    setIsi('');
    setMediaUrl('');
  };

  const getTypeBadge = (t?: string) => {
    switch (t) {
      case 'BANNER':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Banner</span>;
      case 'POSTER':
        return <span className="bg-pink-100 text-pink-800 border border-pink-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Poster Graphic</span>;
      case 'PDF':
        return <span className="bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><FileCode className="w-3 h-3" /> Dokumen PDF</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><FileText className="w-3 h-3" /> Artikel</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Header - Material Styled */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#0056b3] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold tracking-wider">
              Papan Informasi Resmi
            </span>
            <span className="text-slate-500 text-xs font-medium">Informasi & Edaran Warga</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#0056b3]" /> Pengumuman Lingkungan
          </h2>
          <p className="text-xs text-slate-600">
            Pusat publikasi banner, poster kegiatan, artikel edukasi, dan edaran PDF resmi RT/RW.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0056b3] hover:bg-[#004494] active:scale-[0.98] text-white text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Buat Pengumuman Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari judul atau isi pengumuman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold">Tipe:</span>
            <select
              value={selectedTipe}
              onChange={(e) => setSelectedTipe(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
            >
              <option value="SEMUA">Semua Tipe</option>
              <option value="BANNER">Banner</option>
              <option value="POSTER">Poster</option>
              <option value="ARTICLE">Artikel</option>
              <option value="PDF">PDF / Edaran</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold">Kategori:</span>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
            >
              <option value="SEMUA">Semua Kategori</option>
              <option value="PENTING">Penting / Darurat</option>
              <option value="KEGIATAN">Kegiatan Warga</option>
              <option value="INFORMASI">Informasi Umum</option>
              <option value="HIMBAUAN">Himbauan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display of Cards */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-semibold">Belum ada pengumuman yang sesuai dengan filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const itemTipe = item.tipe || 'ARTICLE';
            return (
              <div
                key={item.id}
                onClick={() => setActiveDetail(item)}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col cursor-pointer group"
              >
                {/* Visual Header / Cover for Banner & Poster */}
                {(itemTipe === 'BANNER' || itemTipe === 'POSTER') && item.mediaUrl ? (
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.mediaUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      {getTypeBadge(itemTipe)}
                      {item.isUrgent && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                      {item.unitIssuer}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(itemTipe)}
                      {item.isUrgent && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          URGENT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/80 px-2 py-0.5 rounded">
                      {item.unitIssuer}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0056b3] transition line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.isi}
                    </p>
                  </div>

                  {itemTipe === 'PDF' && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-medium overflow-hidden">
                        <FileCode className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="truncate">{item.mediaUrl || 'Lampiran_Resmi.pdf'}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#0056b3] shrink-0">Download</span>
                    </div>
                  )}

                  {/* Card Footer Meta */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.penulis || 'Pengurus'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PENGUMUMAN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#0056b3]" /> Buat Pengumuman Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kerja Bakti Masal Bersama Warga RT/RW..."
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056b3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipe Media *</label>
                  <select
                    value={tipe}
                    onChange={(e) => setTipe(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="BANNER">Banner Visual</option>
                    <option value="POSTER">Poster Grafis</option>
                    <option value="ARTICLE">Artikel Teks</option>
                    <option value="PDF">Dokumen PDF Edaran</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori *</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="PENTING">Penting / Darurat</option>
                    <option value="KEGIATAN">Kegiatan Warga</option>
                    <option value="INFORMASI">Informasi Umum</option>
                    <option value="HIMBAUAN">Himbauan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Penerbit *</label>
                  <select
                    value={unitIssuer}
                    onChange={(e) => setUnitIssuer(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="RT">Pengurus RT</option>
                    <option value="RW">Pengurus RW</option>
                    <option value="POSYANDU">Kader Posyandu</option>
                    <option value="PKK">Ibu PKK</option>
                    <option value="KARANG_TARUNA">Karang Taruna</option>
                    <option value="BANK_SAMPAH">Bank Sampah</option>
                    <option value="LINMAS">Linmas Keamanan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Penulis / Penanggungjawab</label>
                  <input
                    type="text"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  URL Gambar / File Attachment (Opsional)
                </label>
                <input
                  type="text"
                  placeholder={tipe === 'PDF' ? 'Contoh: Surat_Edaran_RT.pdf' : 'https://images.unsplash.com/...'}
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Isi Pengumuman Lengkap *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tulis rincian pengumuman, tempat, tanggal, serta pesan yang disampaikan..."
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056b3]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-[#0056b3] focus:ring-0 w-4 h-4"
                />
                <label htmlFor="urgentCheck" className="text-xs font-semibold text-slate-800">
                  Tandai sebagai Pengumuman Mendasak (Urgent Badge)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0056b3] hover:bg-[#004494] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Publikasikan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      {activeDetail && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                {getTypeBadge(activeDetail.tipe)}
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {activeDetail.unitIssuer}
                </span>
              </div>
              <button
                onClick={() => setActiveDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeDetail.mediaUrl && (activeDetail.tipe === 'BANNER' || activeDetail.tipe === 'POSTER') && (
              <div className="rounded-xl overflow-hidden max-h-60 w-full bg-slate-100">
                <img src={activeDetail.mediaUrl} alt={activeDetail.judul} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">{activeDetail.judul}</h2>
              <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>Tanggal: <strong>{activeDetail.tanggal}</strong></span>
                <span>Penerbit: <strong>{activeDetail.penulis || activeDetail.unitIssuer}</strong></span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {activeDetail.isi}
            </p>

            {activeDetail.tipe === 'PDF' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <FileCode className="w-5 h-5 text-red-600" />
                  <span>{activeDetail.mediaUrl || 'Lampiran_Dokumen_Resmi.pdf'}</span>
                </div>
                <button
                  onClick={() => alert(`Mengunduh dokumen edaran ${activeDetail.judul}...`)}
                  className="bg-[#0056b3] hover:bg-[#004494] text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tautan pengumuman berhasil disalin ke clipboard!');
                }}
                className="text-xs text-[#0056b3] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Bagikan Pengumuman
              </button>
              <button
                onClick={() => setActiveDetail(null)}
                className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

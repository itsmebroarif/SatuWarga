import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Home,
  MessageSquare,
  ShieldAlert,
  X,
  FileImage,
  Send,
  Sparkles,
} from 'lucide-react';
import { AduanWarga } from '../types';

interface AduanWargaViewProps {
  aduanList: AduanWarga[];
  onAddAduan: (aduan: AduanWarga) => void;
  onUpdateStatusAduan: (
    id: string,
    status: 'OPEN' | 'PROGRESS' | 'PENDING' | 'DONE',
    balasanAdmin?: string,
    petugasNama?: string
  ) => void;
  currentRole?: string;
}

export const AduanWargaView: React.FC<AduanWargaViewProps> = ({
  aduanList = [],
  onAddAduan,
  onUpdateStatusAduan,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('SEMUA');
  const [filterKategori, setFilterKategori] = useState<string>('SEMUA');

  // Submit Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [pelaporNama, setPelaporNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [rt, setRt] = useState('01');
  const [kategori, setKategori] = useState<
    'Jalan Rusak' | 'Lampu Mati' | 'Banjir' | 'Kebersihan' | 'Keamanan' | 'Sosial/Lainnya'
  >('Lampu Mati');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  // Response Modal State (Admin / RT)
  const [selectedAduan, setSelectedAduan] = useState<AduanWarga | null>(null);
  const [newStatus, setNewStatus] = useState<'OPEN' | 'PROGRESS' | 'PENDING' | 'DONE'>('PROGRESS');
  const [balasanAdmin, setBalasanAdmin] = useState('');
  const [petugasNama, setPetugasNama] = useState('');

  const filteredAduan = aduanList.filter((a) => {
    const matchesSearch =
      a.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pelaporNama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'SEMUA' || a.status === filterStatus;
    const matchesKategori = filterKategori === 'SEMUA' || a.kategori === filterKategori;
    return matchesSearch && matchesStatus && matchesKategori;
  });

  const handleCreateAduan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pelaporNama.trim() || !judul.trim() || !deskripsi.trim()) return;

    const newAduan: AduanWarga = {
      id: 'adn-' + Date.now(),
      pelaporNama,
      noHp: noHp || '081234567890',
      rt,
      kategori,
      judul,
      deskripsi,
      fotoUrl: fotoUrl || undefined,
      status: 'OPEN',
      tglAduan: new Date().toISOString().slice(0, 10),
    };

    onAddAduan(newAduan);
    setIsSubmitModalOpen(false);
    setJudul('');
    setDeskripsi('');
    setFotoUrl('');
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAduan) return;

    onUpdateStatusAduan(selectedAduan.id, newStatus, balasanAdmin, petugasNama);
    setSelectedAduan(null);
  };

  const openAdminResponse = (aduan: AduanWarga) => {
    setSelectedAduan(aduan);
    setNewStatus(aduan.status);
    setBalasanAdmin(aduan.balasanAdmin || '');
    setPetugasNama(aduan.petugasNama || 'Tim Operasional RT/RW');
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'OPEN':
        return (
          <span className="bg-[#fff3cd] text-[#856404] border border-amber-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
            ● Baru (OPEN)
          </span>
        );
      case 'PROGRESS':
        return (
          <span className="bg-blue-100 text-[#0056b3] border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
            ● Diproses (PROGRESS)
          </span>
        );
      case 'PENDING':
        return (
          <span className="bg-orange-100 text-orange-800 border border-orange-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
            ● Menunggu Material
          </span>
        );
      case 'DONE':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
            ✓ Selesai (DONE)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold tracking-wider">
              Layanan Tanggap Warga
            </span>
            <span className="text-slate-500 text-xs font-medium">Laporan & Keluhan Lingkungan</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" /> Aduan & Aspirasi Warga RT/RW
          </h2>
          <p className="text-xs text-slate-600">
            Sistem penerimaan, pelacakan status, dan tindak lanjut aduan prasarana umum, kebersihan, serta keamanan.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Buat Laporan Aduan Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Judul, Pelapor, atau Rincian Aduan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#0056b3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
            >
              <option value="SEMUA">Semua Status</option>
              <option value="OPEN">Baru (OPEN)</option>
              <option value="PROGRESS">Sedang Diproses</option>
              <option value="PENDING">Pending Material</option>
              <option value="DONE">Selesai (DONE)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold">Kategori:</span>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
            >
              <option value="SEMUA">Semua Kategori</option>
              <option value="Jalan Rusak">Jalan Rusak</option>
              <option value="Lampu Mati">Lampu Mati</option>
              <option value="Banjir">Banjir & Selokan</option>
              <option value="Kebersihan">Kebersihan Sampah</option>
              <option value="Keamanan">Keamanan Ronda</option>
              <option value="Sosial/Lainnya">Sosial / Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* List of Complaints */}
      {filteredAduan.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="font-semibold">Tidak ada aduan warga dalam filter ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAduan.map((aduan) => (
            <div
              key={aduan.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(aduan.status)}
                  <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                    {aduan.kategori}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Tgl: {aduan.tglAduan} • RT {aduan.rt}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{aduan.judul}</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {aduan.deskripsi}
                </p>

                {/* Pelapor Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Pelapor: <strong>{aduan.pelaporNama}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {aduan.noHp}
                  </span>
                </div>

                {/* Response Box if exists */}
                {aduan.balasanAdmin && (
                  <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#0056b3]">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Tanggapan Pengurus / Petugas ({aduan.petugasNama || 'RT/RW'})
                      </span>
                      {aduan.tglSelesai && <span className="font-mono text-slate-500">Selesai: {aduan.tglSelesai}</span>}
                    </div>
                    <p className="text-xs text-slate-800 font-medium">{aduan.balasanAdmin}</p>
                  </div>
                )}
              </div>

              {/* Action Side */}
              <div className="flex flex-col items-end gap-2 shrink-0 self-end md:self-start">
                <button
                  onClick={() => openAdminResponse(aduan)}
                  className="bg-[#0056b3] hover:bg-[#004494] text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Tindak Lanjuti / Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMIT COMPLAINT MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" /> Buat Laporan Aduan Baru
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAduan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Pelapor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap..."
                    value={pelaporNama}
                    onChange={(e) => setPelaporNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="0812xxxxxxxx"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RT Pelapor *</label>
                  <select
                    value={rt}
                    onChange={(e) => setRt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="01">RT 01</option>
                    <option value="02">RT 02</option>
                    <option value="03">RT 03</option>
                    <option value="04">RT 04</option>
                    <option value="05">RT 05</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori Masalah *</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="Lampu Mati">Lampu PJU / Mati</option>
                    <option value="Jalan Rusak">Jalan Rusak / Lubang</option>
                    <option value="Banjir">Banjir & Drainase Selokan</option>
                    <option value="Kebersihan">Kebersihan Sampah</option>
                    <option value="Keamanan">Keamanan & Pos Ronda</option>
                    <option value="Sosial/Lainnya">Sosial / Keharmonisasi Warga</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Ringkas Aduan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lampu PJU Gang C3 Mati Sudah 3 Hari..."
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lokasi & Deskripsi Detail *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan titik lokasi secara mendetail dan dampak yang dialami warga..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Foto Bukti Kejadian (Opsional URL)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Kirim Laporan Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL (ADMIN / RT) */}
      {selectedAduan && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Tindak Lanjut Aduan: {selectedAduan.judul}
              </h3>
              <button
                onClick={() => setSelectedAduan(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Update Status *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'OPEN', label: 'BARU (OPEN)' },
                    { id: 'PROGRESS', label: 'SEDANG DIPROSES' },
                    { id: 'PENDING', label: 'PENDING MATERIAL' },
                    { id: 'DONE', label: 'SELESAI (DONE)' },
                  ].map((st) => (
                    <button
                      type="button"
                      key={st.id}
                      onClick={() => setNewStatus(st.id as any)}
                      className={`p-2 rounded-lg font-bold text-xs border cursor-pointer ${
                        newStatus === st.id
                          ? 'bg-[#0056b3] text-white border-[#0056b3]'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Petugas / Sie Penanggungjawab</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Supri (Sie Pembangunan RT 01)"
                  value={petugasNama}
                  onChange={(e) => setPetugasNama(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tanggapan & Catatan Tindak Lanjut *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan tindakan yang dilakukan, estimasi selesai, atau penjelasan resmi..."
                  value={balasanAdmin}
                  onChange={(e) => setBalasanAdmin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAduan(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0056b3] hover:bg-[#004494] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Simpan Perubahan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

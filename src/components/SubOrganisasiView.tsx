import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Recycle,
  HeartPulse,
  Award,
  BookOpen,
  Plus,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { SubOrgUnit, SetoranSampah, BarangInventaris, PeminjamanBarang } from '../types';

interface SubOrganisasiViewProps {
  setoranSampahList: SetoranSampah[];
  onAddSetoranSampah: (s: SetoranSampah) => void;
  barangList?: BarangInventaris[];
  peminjamanList?: PeminjamanBarang[];
  onAddBarang?: (b: BarangInventaris) => void;
  onAddPeminjaman?: (p: PeminjamanBarang) => void;
  initialUnit?: SubOrgUnit;
}

export const SubOrganisasiView: React.FC<SubOrganisasiViewProps> = ({
  setoranSampahList = [],
  onAddSetoranSampah,
  barangList = [],
  peminjamanList = [],
  onAddBarang,
  onAddPeminjaman,
  initialUnit = 'PKK',
}) => {
  const [activeUnit, setActiveUnit] = useState<SubOrgUnit>(initialUnit);

  // Bank Sampah Form State
  const [wargaNama, setWargaNama] = useState('');
  const [nomorRumah, setNomorRumah] = useState('');
  const [jenisSampah, setJenisSampah] = useState('Plastik / Botol PET');
  const [beratKg, setBeratKg] = useState<number>(0);
  const [hargaPerKg, setHargaPerKg] = useState<number>(3000);

  // Inventaris Form State
  const [isAddBarangModalOpen, setIsAddBarangModalOpen] = useState(false);
  const [namaBarang, setNamaBarang] = useState('');
  const [kodeBarang, setKodeBarang] = useState('');
  const [jumlahTotal, setJumlahTotal] = useState<number>(1);
  const [lokasiPenyimpanan, setLokasiPenyimpanan] = useState('Gudang Balai Warga');

  // Peminjaman Modal State
  const [isPinjamModalOpen, setIsPinjamModalOpen] = useState(false);
  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [peminjamNama, setPeminjamNama] = useState('');
  const [peminjamHp, setPeminjamHp] = useState('');
  const [jumlahPinjam, setJumlahPinjam] = useState<number>(1);
  const [tglPinjam, setTglPinjam] = useState(new Date().toISOString().slice(0, 10));
  const [tglRencanaKembali, setTglRencanaKembali] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
  );

  const handleAddSetoran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wargaNama || beratKg <= 0) return;
    const total = beratKg * hargaPerKg;
    const newSetoran: SetoranSampah = {
      id: 'sampah-' + Date.now(),
      wargaNama,
      nomorRumah: nomorRumah || 'RT 01',
      jenisSampah,
      beratKg,
      hargaPerKg,
      totalRupiah: total,
      tanggal: new Date().toISOString().slice(0, 10),
    };
    onAddSetoranSampah(newSetoran);
    setWargaNama('');
    setNomorRumah('');
    setBeratKg(0);
  };

  const handleCreateBarang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang || !onAddBarang) return;
    const newB: BarangInventaris = {
      id: 'brg-' + Date.now(),
      unitOwner: 'RW',
      namaBarang,
      kodeBarang: kodeBarang || 'INV-' + Math.floor(100 + Math.random() * 900),
      jumlahTotal: Number(jumlahTotal) || 1,
      jumlahBaik: Number(jumlahTotal) || 1,
      jumlahDipinjam: 0,
      jumlahRusak: 0,
      lokasiPenyimpanan: lokasiPenyimpanan || 'Gudang RW',
    };
    onAddBarang(newB);
    setIsAddBarangModalOpen(false);
    setNamaBarang('');
    setKodeBarang('');
    setJumlahTotal(1);
  };

  const handleCreatePeminjaman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peminjamNama || !onAddPeminjaman) return;
    const targetBarang = barangList.find((b) => b.id === selectedBarangId);
    const newP: PeminjamanBarang = {
      id: 'pinjam-' + Date.now(),
      barangId: selectedBarangId,
      namaBarang: targetBarang?.namaBarang || 'Barang Inventaris',
      peminjamNama,
      noHp: peminjamHp,
      tglPinjam,
      tglRencanaKembali,
      jumlah: Number(jumlahPinjam) || 1,
      status: 'DIPINJAM',
    };
    onAddPeminjaman(newP);
    setIsPinjamModalOpen(false);
    setPeminjamNama('');
    setPeminjamHp('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Unit Selector */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0056b3]" /> Ekosistem Sub-Organisasi & Inventarisasi
          </h2>
          <p className="text-xs text-slate-500">
            Digitalisasi Terintegrasi Inventarisasi Barang, Bank Sampah, PKK, Posyandu, Linmas, Karang Taruna, dan DKM.
          </p>
        </div>

        {/* Sub Org Unit Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
          {[
            { id: 'INVENTARIS' as SubOrgUnit, label: 'Inventarisasi Barang', icon: Package },
            { id: 'BANK_SAMPAH' as SubOrgUnit, label: 'Bank Sampah', icon: Recycle },
            { id: 'PKK' as SubOrgUnit, label: 'PKK', icon: Users },
            { id: 'KARANG_TARUNA' as SubOrgUnit, label: 'Karang Taruna', icon: Award },
            { id: 'POSYANDU' as SubOrgUnit, label: 'Posyandu (KMS)', icon: HeartPulse },
            { id: 'LINMAS' as SubOrgUnit, label: 'Linmas & Ronda', icon: ShieldAlert },
            { id: 'DKM' as SubOrgUnit, label: 'DKM Al-Ikhlas', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveUnit(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeUnit === tab.id
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. TAB INVENTARISASI BARANG */}
      {activeUnit === 'INVENTARIS' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0056b3]" /> Inventarisasi Aset & Logistik Lingkungan
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan aset barang (Tenda, Kursi, Sound System, HT) & Layanan Peminjaman Warga.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddBarangModalOpen(true)}
                className="bg-[#0056b3] hover:bg-blue-700 text-white text-xs px-3.5 py-2 rounded font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah Barang Baru
              </button>

              <button
                onClick={() => setIsPinjamModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Catat Peminjaman
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-500">Total Jenis Barang Terdaftar:</span>
              <div className="text-xl font-bold text-slate-900 font-mono">{barangList.length} Item</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-500">Total Unit Barang:</span>
              <div className="text-xl font-bold text-[#0056b3] font-mono">
                {barangList.reduce((acc, curr) => acc + (curr.jumlahTotal || 0), 0)} Unit
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-500">Barang Sedang Dipinjam:</span>
              <div className="text-xl font-bold text-amber-600 font-mono">{peminjamanList.length} Transaksi</div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Barang List */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Master Barang Inventaris ({barangList.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase border-b border-slate-200">
                      <th className="p-2.5">Kode</th>
                      <th className="p-2.5">Nama Barang</th>
                      <th className="p-2.5">Total / Baik</th>
                      <th className="p-2.5">Lokasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {barangList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                          Belum ada barang inventaris terdaftar. Klik "Tambah Barang Baru" untuk menambahkan dari 0.
                        </td>
                      </tr>
                    ) : (
                      barangList.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-600 font-bold">{b.kodeBarang}</td>
                          <td className="p-2.5 font-bold text-slate-900">{b.namaBarang}</td>
                          <td className="p-2.5 font-mono">
                            <span className="text-emerald-700 font-bold">{b.jumlahBaik}</span> / {b.jumlahTotal}
                          </td>
                          <td className="p-2.5 text-slate-600">{b.lokasiPenyimpanan}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Peminjaman List */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Riwayat Peminjaman Barang ({peminjamanList.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase border-b border-slate-200">
                      <th className="p-2.5">Peminjam</th>
                      <th className="p-2.5">Barang</th>
                      <th className="p-2.5">Jml</th>
                      <th className="p-2.5">Tgl Pinjam / Kembali</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {peminjamanList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                          Belum ada riwayat peminjaman barang.
                        </td>
                      </tr>
                    ) : (
                      peminjamanList.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">
                            {p.peminjamNama}
                            <span className="block text-[10px] font-mono text-slate-500">{p.noHp}</span>
                          </td>
                          <td className="p-2.5 text-slate-800 font-semibold">{p.namaBarang}</td>
                          <td className="p-2.5 font-mono font-bold text-[#0056b3]">{p.jumlah}</td>
                          <td className="p-2.5 text-[11px] font-mono text-slate-600">
                            {p.tglPinjam} s/d {p.tglRencanaKembali}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BANK SAMPAH */}
      {activeUnit === 'BANK_SAMPAH' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-600" /> Tabungan Bank Sampah Lingkungan
              </h3>
              <p className="text-xs text-slate-500">Pencatatan Penimbangan Sampah Anorganik Warga & Konversi Rupiah.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input Form */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
                Input Setoran Sampah Warga
              </h4>
              <form onSubmit={handleAddSetoran} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Warga *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Warga"
                    value={wargaNama}
                    onChange={(e) => setWargaNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RT / Rumah</label>
                  <input
                    type="text"
                    placeholder="Contoh: RT 02 / A-05"
                    value={nomorRumah}
                    onChange={(e) => setNomorRumah(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Sampah *</label>
                  <select
                    value={jenisSampah}
                    onChange={(e) => setJenisSampah(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium"
                  >
                    <option value="Plastik / Botol PET">Plastik / Botol PET (Rp 3.000/kg)</option>
                    <option value="Kardus & Kertas">Kardus & Kertas Bekas (Rp 2.000/kg)</option>
                    <option value="Besi / Kaleng">Besi / Kaleng Alumunium (Rp 5.000/kg)</option>
                    <option value="Minyak Jelantah">Minyak Jelantah (Rp 6.000/liter)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Berat (Kg)</label>
                    <input
                      type="number"
                      step={0.5}
                      required
                      value={beratKg || ''}
                      onChange={(e) => setBeratKg(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Harga / Kg</label>
                    <input
                      type="number"
                      required
                      value={hargaPerKg}
                      onChange={(e) => setHargaPerKg(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                    />
                  </div>
                </div>

                <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-center font-bold text-emerald-800 text-xs">
                  Total Rupiah: Rp {(beratKg * hargaPerKg).toLocaleString('id-ID')}
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded font-bold shadow-xs cursor-pointer"
                >
                  Simpan Setoran
                </button>
              </form>
            </div>

            {/* Setoran Table */}
            <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                Riwayat Setoran Bank Sampah ({setoranSampahList.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                      <th className="p-2.5 border-b border-slate-200">Tanggal</th>
                      <th className="p-2.5 border-b border-slate-200">Warga</th>
                      <th className="p-2.5 border-b border-slate-200">Jenis</th>
                      <th className="p-2.5 border-b border-slate-200">Berat</th>
                      <th className="p-2.5 border-b border-slate-200 text-right">Saldo (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {setoranSampahList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                          Belum ada data setoran bank sampah. Masukkan data warga pada form di sebelah kiri.
                        </td>
                      </tr>
                    ) : (
                      setoranSampahList.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-600">{s.tanggal}</td>
                          <td className="p-2.5 font-bold text-slate-900">
                            {s.wargaNama} ({s.nomorRumah})
                          </td>
                          <td className="p-2.5 text-slate-700">{s.jenisSampah}</td>
                          <td className="p-2.5 font-mono font-semibold">{s.beratKg} kg</td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                            + Rp {s.totalRupiah.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PKK */}
      {activeUnit === 'PKK' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-pink-600" /> Program Kerja Utama PKK
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>1. Pokja I:</strong> Pengajian rutin Dasa Wisma & Gotong Royong.
              </li>
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>2. Pokja II:</strong> Pelatihan UMKM & Keterampilan Kerajinan.
              </li>
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>3. Pokja III:</strong> Pemanfaatan Kebun Tanaman Obat Keluarga (TOGA).
              </li>
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>4. Pokja IV:</strong> Pendampingan Posyandu Balita & Lansia.
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Informasi Kepengurusan PKK
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Status Pengurus:</span>
                <span className="font-bold text-slate-900">Aktif</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Kelompok Dasa Wisma:</span>
                <span className="font-mono font-bold text-emerald-700">Terkoordinasi per RT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. KARANG TARUNA */}
      {activeUnit === 'KARANG_TARUNA' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Award className="w-4 h-4 text-purple-600" /> Unit Karang Taruna
          </h3>
          <p className="text-xs text-slate-600">
            Wadah kegiatan kepemudaan, seni, olahraga, serta relawan kegiatan kemasyarakatan.
          </p>
        </div>
      )}

      {/* 5. POSYANDU */}
      {activeUnit === 'POSYANDU' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <HeartPulse className="w-4 h-4 text-rose-600" /> Posyandu Balita & Lansia
          </h3>
          <p className="text-xs text-slate-600">
            Layanan kesehatan dasar rutin bulanan untuk penimbangan balita dan pemeriksaan kesehatan lansia.
          </p>
        </div>
      )}

      {/* 6. LINMAS */}
      {activeUnit === 'LINMAS' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Linmas & Keamanan Siskamling
          </h3>
          <p className="text-xs text-slate-600">
            Pengelolaan jadwal pos ronda malam dan sistem tanggap darurat warga.
          </p>
        </div>
      )}

      {/* 7. DKM MASJID */}
      {activeUnit === 'DKM' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-emerald-600" /> DKM Masjid & Keagamaan
          </h3>
          <p className="text-xs text-slate-600">
            Pengelolaan kegiatan keagamaan, pengajian rutin, dan penyaluran infaq/sedekah warga.
          </p>
        </div>
      )}

      {/* MODAL TAMBAH BARANG */}
      {isAddBarangModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Barang Inventaris Baru</h3>
              <button onClick={() => setIsAddBarangModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBarang} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Barang *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tenda Hajatan 4x6"
                  value={namaBarang}
                  onChange={(e) => setNamaBarang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kode / Label Barang</label>
                <input
                  type="text"
                  placeholder="Contoh: TND-001"
                  value={kodeBarang}
                  onChange={(e) => setKodeBarang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jumlah Unit Barang</label>
                <input
                  type="number"
                  min={1}
                  value={jumlahTotal}
                  onChange={(e) => setJumlahTotal(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lokasi Penyimpanan</label>
                <input
                  type="text"
                  placeholder="Contoh: Gudang RW 05"
                  value={lokasiPenyimpanan}
                  onChange={(e) => setLokasiPenyimpanan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddBarangModalOpen(false)}
                  className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#0056b3] hover:bg-blue-700 text-white px-4 py-1.5 rounded font-bold shadow-xs cursor-pointer"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATAT PEMINJAMAN */}
      {isPinjamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Form Peminjaman Barang</h3>
              <button onClick={() => setIsPinjamModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePeminjaman} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pilih Barang *</label>
                <select
                  value={selectedBarangId}
                  onChange={(e) => setSelectedBarangId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-medium"
                >
                  <option value="">-- Pilih Barang --</option>
                  {barangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.namaBarang} ({b.kodeBarang}) - Stok: {b.jumlahBaik}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Peminjam *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Warga Peminjam"
                  value={peminjamNama}
                  onChange={(e) => setPeminjamNama(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">No. HP / WhatsApp</label>
                <input
                  type="text"
                  placeholder="0812xxxx"
                  value={peminjamHp}
                  onChange={(e) => setPeminjamHp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tgl Pinjam</label>
                  <input
                    type="date"
                    value={tglPinjam}
                    onChange={(e) => setTglPinjam(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tgl Kembalikan</label>
                  <input
                    type="date"
                    value={tglRencanaKembali}
                    onChange={(e) => setTglRencanaKembali(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jumlah Unit Dipinjam</label>
                <input
                  type="number"
                  min={1}
                  value={jumlahPinjam}
                  onChange={(e) => setJumlahPinjam(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPinjamModalOpen(false)}
                  className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded font-bold shadow-xs cursor-pointer"
                >
                  Simpan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

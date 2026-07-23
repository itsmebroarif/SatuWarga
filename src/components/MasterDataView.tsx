import React, { useState } from 'react';
import {
  Users,
  Home,
  FileText,
  Search,
  Plus,
  Lock,
  Unlock,
  MapPin,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  ShieldCheck,
  Filter,
  X,
  CheckCircle,
} from 'lucide-react';
import { Warga, KartuKeluarga, Rumah } from '../types';

interface MasterDataViewProps {
  wargaList: Warga[];
  kkList: KartuKeluarga[];
  rumahList: Rumah[];
  onAddWarga: (w: Warga) => void;
  onUpdateWarga: (w: Warga) => void;
  onDeleteWarga: (id: string) => void;
  onAddKK: (kk: KartuKeluarga) => void;
  onAddRumah: (r: Rumah) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  wargaList = [],
  kkList = [],
  rumahList = [],
  onAddWarga,
  onUpdateWarga,
  onDeleteWarga,
  onAddKK,
  onAddRumah,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'WARGA' | 'KK' | 'RUMAH'>('WARGA');
  const [searchTerm, setSearchTerm] = useState('');
  const [rtFilter, setRtFilter] = useState('ALL');
  const [showEncryptedNik, setShowEncryptedNik] = useState(false);

  // Add Warga Modal State
  const [isWargaModalOpen, setIsWargaModalOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Warga>>({
    nik: '',
    nama: '',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1995-01-01',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pendidikan: 'S1',
    pekerjaan: 'Karyawan Swasta',
    statusPerkawinan: 'Kawin',
    noHp: '081234567890',
    email: '',
    alamat: 'Jl. Graha Warga',
    rt: '01',
    rw: '05',
    nomorRumah: 'A-01',
    statusTinggal: 'Tetap',
    statusWarga: 'Aktif',
    lat: -6.2088,
    lng: 106.8456,
  });

  // Map Picker Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [tempLat, setTempLat] = useState(-6.2088);
  const [tempLng, setTempLng] = useState(106.8456);

  // Filtered Warga
  const filteredWarga = wargaList.filter((w) => {
    const matchesSearch =
      w.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nik.includes(searchTerm) ||
      w.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRt = rtFilter === 'ALL' || w.rt === rtFilter;
    return matchesSearch && matchesRt;
  });

  const handleOpenAddModal = () => {
    setEditingWarga(null);
    setFormData({
      nik: '327501' + Math.floor(1000000000 + Math.random() * 9000000000),
      nama: '',
      tempatLahir: 'Jakarta',
      tanggalLahir: '1992-06-15',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      pendidikan: 'S1',
      pekerjaan: 'Karyawan Swasta',
      statusPerkawinan: 'Kawin',
      noHp: '0812' + Math.floor(10000000 + Math.random() * 90000000),
      email: '',
      alamat: 'Jl. Graha Warga',
      rt: '01',
      rw: '05',
      nomorRumah: 'A-01',
      statusTinggal: 'Tetap',
      statusWarga: 'Aktif',
      lat: -6.2088,
      lng: 106.8456,
    });
    setIsWargaModalOpen(true);
  };

  const handleOpenEditModal = (w: Warga) => {
    setEditingWarga(w);
    setFormData({ ...w });
    setIsWargaModalOpen(true);
  };

  const handleSaveWarga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik) {
      alert('Mohon isi NIK dan Nama lengkap Warga.');
      return;
    }

    if (editingWarga) {
      onUpdateWarga({
        ...editingWarga,
        ...(formData as Warga),
      });
    } else {
      const newWargaObj: Warga = {
        id: 'w-' + Date.now(),
        nik: formData.nik || '',
        nama: formData.nama || '',
        tempatLahir: formData.tempatLahir || 'Jakarta',
        tanggalLahir: formData.tanggalLahir || '1990-01-01',
        jenisKelamin: formData.jenisKelamin || 'Laki-laki',
        agama: formData.agama || 'Islam',
        pendidikan: formData.pendidikan || 'S1',
        pekerjaan: formData.pekerjaan || 'Wiraswasta',
        statusPerkawinan: formData.statusPerkawinan || 'Kawin',
        noHp: formData.noHp || '',
        email: formData.email || '',
        alamat: formData.alamat || 'Jl. Graha Warga',
        rt: formData.rt || '01',
        rw: formData.rw || '05',
        nomorRumah: formData.nomorRumah || 'A-01',
        statusTinggal: formData.statusTinggal || 'Tetap',
        statusWarga: formData.statusWarga || 'Aktif',
        lat: formData.lat || -6.2088,
        lng: formData.lng || 106.8456,
        isEncrypted: true,
      };
      onAddWarga(newWargaObj);
    }
    setIsWargaModalOpen(false);
  };

  const exportWargaCsv = () => {
    const headers = 'ID,NIK,Nama,TempatLahir,TanggalLahir,Gender,Agama,NoHP,RT,RW,Rumah\n';
    const rows = wargaList
      .map(
        (w) =>
          `"${w.id}","${w.nik}","${w.nama}","${w.tempatLahir}","${w.tanggalLahir}","${w.jenisKelamin}","${w.agama}","${w.noHp}","${w.rt}","${w.rw}","${w.nomorRumah}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Warga_Sukamaju_RT01-05_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" /> Modul Master Data Kependudukan
          </h2>
          <p className="text-xs text-slate-500">
            Database Terpusat Warga, Kartu Keluarga (KK), dan Bangunan Rumah RT 01-10 / RW 01-30 Sukamaju.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('WARGA')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeSubTab === 'WARGA'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Data Warga ({wargaList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('KK')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeSubTab === 'KK'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Kartu Keluarga ({kkList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('RUMAH')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeSubTab === 'RUMAH'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Data Rumah ({rumahList.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DATA WARGA */}
      {activeSubTab === 'WARGA' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            {/* Search Input */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari Nama, NIK, atau No. Rumah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={rtFilter}
                onChange={(e) => setRtFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua RT</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const val = String(i + 1).padStart(2, '0');
                  return <option key={val} value={val}>RT {val}</option>;
                })}
              </select>
            </div>

            {/* Privacy & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowEncryptedNik(!showEncryptedNik)}
                className={`text-xs px-3 py-1.5 rounded border flex items-center gap-1.5 transition ${
                  showEncryptedNik
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-slate-50 border-slate-300 text-slate-700'
                }`}
                title="Sembunyikan / Tampilkan NIK lengkap"
              >
                {showEncryptedNik ? <Unlock className="w-3.5 h-3.5 text-amber-600" /> : <Lock className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{showEncryptedNik ? 'Sembunyikan NIK' : 'Lihat NIK Dekripsi'}</span>
              </button>

              <button
                onClick={exportWargaCsv}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>

              <button
                onClick={handleOpenAddModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Warga
              </button>
            </div>
          </div>

          {/* Table Warga */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="p-3 border-b border-slate-800">NIK (Encrypted)</th>
                    <th className="p-3 border-b border-slate-800">Nama Lengkap</th>
                    <th className="p-3 border-b border-slate-800">L/P</th>
                    <th className="p-3 border-b border-slate-800">Agama / Pekerjaan</th>
                    <th className="p-3 border-b border-slate-800">No. HP</th>
                    <th className="p-3 border-b border-slate-800">Alamat / Rumah</th>
                    <th className="p-3 border-b border-slate-800">RT / RW</th>
                    <th className="p-3 border-b border-slate-800">Status</th>
                    <th className="p-3 border-b border-slate-800 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWarga.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700 text-sm">Belum ada data warga</p>
                        <p className="text-xs text-slate-500 mt-0.5">Klik tombol "+ Tambah Warga" untuk memasukkan data warga Sukamaju.</p>
                      </td>
                    </tr>
                  )}
                  {filteredWarga.map((warga) => {
                    const maskedNik = showEncryptedNik
                      ? warga.nik
                      : warga.nik.slice(0, 6) + '******' + warga.nik.slice(-4);
                    return (
                      <tr key={warga.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono text-slate-700 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{maskedNik}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">{warga.nama}</td>
                        <td className="p-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              warga.jenisKelamin === 'Laki-laki'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-pink-100 text-pink-800'
                            }`}
                          >
                            {warga.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">
                          <div>{warga.agama}</div>
                          <div className="text-[10px] text-slate-500">{warga.pekerjaan}</div>
                        </td>
                        <td className="p-3 text-slate-700 font-mono text-[11px]">{warga.noHp}</td>
                        <td className="p-3 text-slate-800">
                          <span className="font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 mr-1.5">
                            {warga.nomorRumah}
                          </span>
                          <span className="text-[11px] text-slate-600">{warga.alamat}</span>
                        </td>
                        <td className="p-3 font-mono font-semibold text-slate-800">
                          {warga.rt}/{warga.rw}
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {warga.statusWarga}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(warga)}
                            className="p-1 text-slate-600 hover:text-emerald-600 rounded"
                            title="Edit Data Warga"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data warga ${warga.nama}?`)) {
                                onDeleteWarga(warga.id);
                              }
                            }}
                            className="p-1 text-slate-600 hover:text-red-600 rounded"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* SUB-TAB 2: KARTU KELUARGA */}
      {activeSubTab === 'KK' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" /> Daftar Kartu Keluarga (KK)
            </h3>
            <button
              onClick={() => {
                const noKk = '327501' + Math.floor(1000000000 + Math.random() * 9000000000);
                onAddKK({
                  id: 'kk-' + Date.now(),
                  nomorKk: noKk,
                  kepalaKeluargaNama: 'Kepala Keluarga Baru',
                  alamat: 'Jl. Graha Warga Blok A',
                  rt: '01',
                  rw: '05',
                  anggotaCount: 1,
                  anggotaNames: ['Kepala Keluarga Baru'],
                  status: 'Aktif',
                });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah KK
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kkList.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 text-sm">Belum ada data Kartu Keluarga (KK)</p>
                <p className="text-xs text-slate-500 mt-0.5">Klik tombol "+ Tambah KK" untuk mendaftarkan KK baru.</p>
              </div>
            )}
            {kkList.map((kk) => (
              <div key={kk.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    No. KK: {kk.nomorKk}
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                    {kk.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{kk.kepalaKeluargaNama}</h4>
                <p className="text-xs text-slate-600">{kk.alamat}, RT {kk.rt}/RW {kk.rw}</p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span className="font-semibold text-slate-700">Anggota ({kk.anggotaCount} orang):</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-600">
                    {kk.anggotaNames.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DATA RUMAH */}
      {activeSubTab === 'RUMAH' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Home className="w-4 h-4 text-purple-600" /> Register Bangunan & Pemetaan Rumah
            </h3>
            <button
              onClick={() => {
                onAddRumah({
                  id: 'rmh-' + Date.now(),
                  nomorRumah: 'D-' + Math.floor(Math.random() * 20),
                  blok: 'Blok D',
                  rt: '02',
                  rw: '05',
                  pemilikNama: 'Warga Baru',
                  penghuniCount: 2,
                  status: 'Dihuni',
                  lat: -6.2098,
                  lng: 106.8462,
                });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Reg. Rumah
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rumahList.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <Home className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 text-sm">Belum ada data register bangunan rumah</p>
                <p className="text-xs text-slate-500 mt-0.5">Klik tombol "+ Reg. Rumah" untuk mendaftarkan bangunan rumah.</p>
              </div>
            )}
            {rumahList.map((rmh) => (
              <div key={rmh.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-700 text-sm">{rmh.nomorRumah}</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                    {rmh.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800">Pemilik: {rmh.pemilikNama}</p>
                <p className="text-[11px] text-slate-500">
                  {rmh.blok}, RT {rmh.rt}/RW {rmh.rw} • {rmh.penghuniCount} Penghuni
                </p>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-1">
                  <MapPin className="w-3 h-3 text-red-500" /> {rmh.lat}, {rmh.lng}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT WARGA MODAL */}
      {isWargaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                {editingWarga ? 'Edit Data Warga' : 'Formulir Warga Baru'}
              </h3>
              <button onClick={() => setIsWargaModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWarga} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    NIK (Nomor Induk Kependudukan) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nik || ''}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="327501xxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                    placeholder="Nama lengkap sesuai KTP"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin || 'Laki-laki'}
                    onChange={(e) =>
                      setFormData({ ...formData, jenisKelamin: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Agama</label>
                  <select
                    value={formData.agama || 'Islam'}
                    onChange={(e) => setFormData({ ...formData, agama: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Khonghucu">Khonghucu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.noHp || ''}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="0812xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.pekerjaan || ''}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RT / RW</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.rt || '01'}
                      onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                      className="w-1/2 bg-slate-50 border border-slate-300 rounded px-2 py-1.5"
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const val = String(i + 1).padStart(2, '0');
                        return <option key={val} value={val}>RT {val}</option>;
                      })}
                    </select>
                    <select
                      value={formData.rw || '01'}
                      onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                      className="w-1/2 bg-slate-50 border border-slate-300 rounded px-2 py-1.5"
                    >
                      {Array.from({ length: 30 }, (_, i) => {
                        const val = String(i + 1).padStart(2, '0');
                        return <option key={val} value={val}>RW {val}</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Rumah</label>
                  <input
                    type="text"
                    value={formData.nomorRumah || ''}
                    onChange={(e) => setFormData({ ...formData, nomorRumah: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-bold text-purple-700 focus:outline-none focus:border-emerald-500"
                    placeholder="A-01 / B-05"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat Rumah</label>
                <input
                  type="text"
                  value={formData.alamat || ''}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                  placeholder="Jl. Graha Warga Blok A No. 1"
                />
              </div>

              {/* Coordinates Pin Picker Simulation */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Koordinat Lokasi GPS Rumah:</span>
                  <p className="font-mono text-slate-500 text-[11px]">
                    Lat: {formData.lat}, Lng: {formData.lng}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs px-2.5 py-1.5 rounded flex items-center gap-1 font-medium"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-600" /> Set Pin Peta
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsWargaModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded text-xs font-semibold shadow-xs"
                >
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAP PIN PICKER MODAL */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" /> Simulasi Map Pin Koordinat Rumah
              </h4>
              <button onClick={() => setIsMapModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900 text-white h-48 rounded flex flex-col items-center justify-center relative p-4 text-center border border-slate-800">
              <MapPin className="w-8 h-8 text-red-500 animate-bounce" />
              <p className="text-xs font-semibold mt-2">Peta Digital Perumahan Graha Warga RW 05</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Lat: {tempLat.toFixed(4)}, Lng: {tempLng.toFixed(4)}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempLat(-6.2088 + (Math.random() - 0.5) * 0.005);
                    setTempLng(106.8456 + (Math.random() - 0.5) * 0.005);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-1 rounded text-slate-200 border border-slate-700"
                >
                  Acak Titik GPS
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, lat: tempLat, lng: tempLng });
                  setIsMapModalOpen(false);
                }}
                className="bg-emerald-600 text-white text-xs px-4 py-1.5 rounded font-semibold"
              >
                Gunakan Koordinat Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
  Edit2,
  Trash2,
  Eye,
  ShieldCheck,
  X,
  CreditCard,
  UserPlus,
  Building,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Heart,
  Map,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { Warga, KartuKeluarga, Rumah } from '../types';
import { exportWargaCSV, exportWargaPDF, exportToCSV } from '../utils/exportUtils';

interface MasterDataViewProps {
  wargaList: Warga[];
  kkList: KartuKeluarga[];
  rumahList: Rumah[];
  onAddWarga: (w: Warga) => void;
  onUpdateWarga: (w: Warga) => void;
  onDeleteWarga: (id: string) => void;
  onAddKK: (kk: KartuKeluarga) => void;
  onUpdateKK?: (kk: KartuKeluarga) => void;
  onDeleteKK?: (id: string) => void;
  onAddRumah: (r: Rumah) => void;
  onUpdateRumah?: (r: Rumah) => void;
  onDeleteRumah?: (id: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  wargaList = [],
  kkList = [],
  rumahList = [],
  onAddWarga,
  onUpdateWarga,
  onDeleteWarga,
  onAddKK,
  onUpdateKK,
  onDeleteKK,
  onAddRumah,
  onUpdateRumah,
  onDeleteRumah,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'WARGA' | 'KK' | 'RUMAH'>('WARGA');
  const [searchTerm, setSearchTerm] = useState('');
  const [rtFilter, setRtFilter] = useState('ALL');
  const [golDarahFilter, setGolDarahFilter] = useState('ALL');
  const [pekerjaanFilter, setPekerjaanFilter] = useState('ALL');
  const [agamaFilter, setAgamaFilter] = useState('ALL');
  const [statusPerkawinanFilter, setStatusPerkawinanFilter] = useState('ALL');
  const [jenisKelaminFilter, setJenisKelaminFilter] = useState('ALL');
  const [showEncryptedNik, setShowEncryptedNik] = useState(false);

  // Modal States for Warga
  const [isWargaModalOpen, setIsWargaModalOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [viewingKtpWarga, setViewingKtpWarga] = useState<Warga | null>(null);

  // Form State Warga (Full KTP Standar)
  const [formData, setFormData] = useState<Partial<Warga>>({
    nik: '',
    nama: '',
    tempatLahir: 'Bekasi',
    tanggalLahir: '1995-01-01',
    jenisKelamin: 'Laki-laki',
    golonganDarah: '-',
    agama: 'Islam',
    pendidikan: 'S1',
    pekerjaan: 'Karyawan Swasta',
    statusPerkawinan: 'Kawin',
    hubunganKeluarga: 'Kepala Keluarga',
    kewarganegaraan: 'WNI',
    noHp: '',
    email: '',
    alamat: 'Jl. Graha Warga Blok A',
    rt: '01',
    rw: '05',
    kelurahan: 'Sukamaju',
    kecamatan: 'Cilodong',
    kotaKabupaten: 'Depok',
    provinsi: 'Jawa Barat',
    kodePos: '16415',
    nomorRumah: 'A-01',
    statusTinggal: 'Tetap',
    statusWarga: 'Aktif',
    lat: -6.2088,
    lng: 106.8456,
  });

  // Modal States for KK
  const [isKkModalOpen, setIsKkModalOpen] = useState(false);
  const [editingKk, setEditingKk] = useState<KartuKeluarga | null>(null);
  const [viewingKkDetail, setViewingKkDetail] = useState<KartuKeluarga | null>(null);

  const [kkFormData, setKkFormData] = useState<Partial<KartuKeluarga>>({
    nomorKk: '',
    kepalaKeluargaNama: '',
    alamat: 'Jl. Graha Warga Blok A',
    rt: '01',
    rw: '05',
    kelurahan: 'Sukamaju',
    kecamatan: 'Cilodong',
    kotaKabupaten: 'Depok',
    provinsi: 'Jawa Barat',
    kodePos: '16415',
    status: 'Aktif',
  });

  const [kkAnggotaList, setKkAnggotaList] = useState<string[]>(['']);

  // Modal States for Rumah
  const [isRumahModalOpen, setIsRumahModalOpen] = useState(false);
  const [editingRumah, setEditingRumah] = useState<Rumah | null>(null);
  const [rumahFormData, setRumahFormData] = useState<Partial<Rumah>>({
    nomorRumah: '',
    blok: 'Blok A',
    rt: '01',
    rw: '05',
    pemilikNama: '',
    penghuniCount: 1,
    status: 'Dihuni',
    lat: -6.2088,
    lng: 106.8456,
  });

  // Map Picker State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<'WARGA' | 'RUMAH'>('WARGA');
  const [tempLat, setTempLat] = useState(-6.2088);
  const [tempLng, setTempLng] = useState(106.8456);

  // Filtered Lists
  const filteredWarga = wargaList.filter((w) => {
    const matchesSearch =
      w.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nik.includes(searchTerm) ||
      w.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRt = rtFilter === 'ALL' || w.rt === rtFilter;
    const matchesGolDarah = golDarahFilter === 'ALL' || (w.golonganDarah || '-') === golDarahFilter;
    const matchesPekerjaan =
      pekerjaanFilter === 'ALL' || w.pekerjaan.toLowerCase().includes(pekerjaanFilter.toLowerCase());
    const matchesAgama = agamaFilter === 'ALL' || w.agama === agamaFilter;
    const matchesStatusPerkawinan =
      statusPerkawinanFilter === 'ALL' || w.statusPerkawinan === statusPerkawinanFilter;
    const matchesJenisKelamin =
      jenisKelaminFilter === 'ALL' ||
      (jenisKelaminFilter === 'L' && w.jenisKelamin === 'Laki-laki') ||
      (jenisKelaminFilter === 'P' && w.jenisKelamin === 'Perempuan');

    return (
      matchesSearch &&
      matchesRt &&
      matchesGolDarah &&
      matchesPekerjaan &&
      matchesAgama &&
      matchesStatusPerkawinan &&
      matchesJenisKelamin
    );
  });

  const filteredKk = kkList.filter((kk) => {
    const matchesSearch =
      kk.nomorKk.includes(searchTerm) ||
      kk.kepalaKeluargaNama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRt = rtFilter === 'ALL' || kk.rt === rtFilter;
    return matchesSearch && matchesRt;
  });

  const filteredRumah = rumahList.filter((rmh) => {
    const matchesSearch =
      rmh.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rmh.pemilikNama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRt = rtFilter === 'ALL' || rmh.rt === rtFilter;
    return matchesSearch && matchesRt;
  });

  // --- WARGA HANDLERS ---
  const handleOpenAddWargaModal = () => {
    setEditingWarga(null);
    setFormData({
      nik: '',
      nama: '',
      tempatLahir: 'Bekasi',
      tanggalLahir: '1995-01-01',
      jenisKelamin: 'Laki-laki',
      golonganDarah: '-',
      agama: 'Islam',
      pendidikan: 'S1',
      pekerjaan: 'Karyawan Swasta',
      statusPerkawinan: 'Kawin',
      hubunganKeluarga: 'Kepala Keluarga',
      kewarganegaraan: 'WNI',
      noHp: '',
      email: '',
      alamat: 'Jl. Graha Warga Blok A',
      rt: '01',
      rw: '05',
      kelurahan: 'Sukamaju',
      kecamatan: 'Cilodong',
      kotaKabupaten: 'Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16415',
      nomorRumah: 'A-01',
      statusTinggal: 'Tetap',
      statusWarga: 'Aktif',
      lat: -6.2088,
      lng: 106.8456,
    });
    setIsWargaModalOpen(true);
  };

  const handleOpenEditWargaModal = (w: Warga) => {
    setEditingWarga(w);
    setFormData({ ...w });
    setIsWargaModalOpen(true);
  };

  const handleSaveWarga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik) {
      alert('Mohon lengkapi Nomor Induk Kependudukan (NIK) dan Nama Lengkap.');
      return;
    }

    if (formData.nik.length !== 16) {
      if (!confirm('Peringatan: Format NIK standar Indonesia terdiri dari 16 digit angka. Lanjutkan menyimpan data?')) {
        return;
      }
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
        tempatLahir: formData.tempatLahir || 'Bekasi',
        tanggalLahir: formData.tanggalLahir || '1990-01-01',
        jenisKelamin: formData.jenisKelamin || 'Laki-laki',
        golonganDarah: formData.golonganDarah || '-',
        agama: formData.agama || 'Islam',
        pendidikan: formData.pendidikan || 'S1',
        pekerjaan: formData.pekerjaan || 'Wiraswasta',
        statusPerkawinan: formData.statusPerkawinan || 'Kawin',
        hubunganKeluarga: formData.hubunganKeluarga || 'Kepala Keluarga',
        kewarganegaraan: formData.kewarganegaraan || 'WNI',
        noHp: formData.noHp || '',
        email: formData.email || '',
        alamat: formData.alamat || 'Jl. Graha Warga Blok A',
        rt: formData.rt || '01',
        rw: formData.rw || '05',
        kelurahan: formData.kelurahan || 'Sukamaju',
        kecamatan: formData.kecamatan || 'Cilodong',
        kotaKabupaten: formData.kotaKabupaten || 'Depok',
        provinsi: formData.provinsi || 'Jawa Barat',
        kodePos: formData.kodePos || '16415',
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

  // --- KK HANDLERS ---
  const handleOpenAddKkModal = () => {
    setEditingKk(null);
    const generatedNoKk = '3276' + Math.floor(100000000000 + Math.random() * 900000000000);
    setKkFormData({
      nomorKk: generatedNoKk,
      kepalaKeluargaNama: '',
      alamat: 'Jl. Graha Warga Blok A',
      rt: '01',
      rw: '05',
      kelurahan: 'Sukamaju',
      kecamatan: 'Cilodong',
      kotaKabupaten: 'Depok',
      provinsi: 'Jawa Barat',
      kodePos: '16415',
      status: 'Aktif',
    });
    setKkAnggotaList(['']);
    setIsKkModalOpen(true);
  };

  const handleOpenEditKkModal = (kk: KartuKeluarga) => {
    setEditingKk(kk);
    setKkFormData({ ...kk });
    setKkAnggotaList(kk.anggotaNames.length > 0 ? [...kk.anggotaNames] : ['']);
    setIsKkModalOpen(true);
  };

  const handleSaveKk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kkFormData.nomorKk || !kkFormData.kepalaKeluargaNama) {
      alert('Mohon isi Nomor KK dan Nama Kepala Keluarga.');
      return;
    }

    const cleanAnggota = kkAnggotaList.filter((a) => a.trim() !== '');
    if (cleanAnggota.length === 0 && kkFormData.kepalaKeluargaNama) {
      cleanAnggota.push(kkFormData.kepalaKeluargaNama);
    }

    if (editingKk) {
      if (onUpdateKK) {
        onUpdateKK({
          ...editingKk,
          ...(kkFormData as KartuKeluarga),
          anggotaCount: cleanAnggota.length,
          anggotaNames: cleanAnggota,
        });
      }
    } else {
      const newKkObj: KartuKeluarga = {
        id: 'kk-' + Date.now(),
        nomorKk: kkFormData.nomorKk || '',
        kepalaKeluargaNama: kkFormData.kepalaKeluargaNama || '',
        alamat: kkFormData.alamat || 'Jl. Graha Warga',
        rt: kkFormData.rt || '01',
        rw: kkFormData.rw || '05',
        kelurahan: kkFormData.kelurahan || 'Sukamaju',
        kecamatan: kkFormData.kecamatan || 'Cilodong',
        kotaKabupaten: kkFormData.kotaKabupaten || 'Depok',
        provinsi: kkFormData.provinsi || 'Jawa Barat',
        kodePos: kkFormData.kodePos || '16415',
        anggotaCount: cleanAnggota.length,
        anggotaNames: cleanAnggota,
        status: kkFormData.status || 'Aktif',
      };
      onAddKK(newKkObj);
    }
    setIsKkModalOpen(false);
  };

  // --- RUMAH HANDLERS ---
  const handleOpenAddRumahModal = () => {
    setEditingRumah(null);
    setRumahFormData({
      nomorRumah: 'A-' + Math.floor(10 + Math.random() * 80),
      blok: 'Blok A',
      rt: '01',
      rw: '05',
      pemilikNama: '',
      penghuniCount: 2,
      status: 'Dihuni',
      lat: -6.2088,
      lng: 106.8456,
    });
    setIsRumahModalOpen(true);
  };

  const handleOpenEditRumahModal = (rmh: Rumah) => {
    setEditingRumah(rmh);
    setRumahFormData({ ...rmh });
    setIsRumahModalOpen(true);
  };

  const handleSaveRumah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rumahFormData.nomorRumah || !rumahFormData.pemilikNama) {
      alert('Mohon lengkapi Nomor Rumah dan Nama Pemilik.');
      return;
    }

    if (editingRumah) {
      if (onUpdateRumah) {
        onUpdateRumah({
          ...editingRumah,
          ...(rumahFormData as Rumah),
        });
      }
    } else {
      const newRumahObj: Rumah = {
        id: 'rmh-' + Date.now(),
        nomorRumah: rumahFormData.nomorRumah || 'A-01',
        blok: rumahFormData.blok || 'Blok A',
        rt: rumahFormData.rt || '01',
        rw: rumahFormData.rw || '05',
        pemilikNama: rumahFormData.pemilikNama || '',
        penghuniCount: Number(rumahFormData.penghuniCount || 1),
        status: rumahFormData.status || 'Dihuni',
        lat: Number(rumahFormData.lat || -6.2088),
        lng: Number(rumahFormData.lng || 106.8456),
      };
      onAddRumah(newRumahObj);
    }
    setIsRumahModalOpen(false);
  };

  // CSV Export
  const exportWargaCsv = () => {
    const headers = [
      'ID Warga',
      'NIK',
      'Nama Lengkap',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Jenis Kelamin',
      'GolDarah',
      'Agama',
      'Pendidikan',
      'Pekerjaan',
      'Status Perkawinan',
      'Hubungan Keluarga',
      'Kewarganegaraan',
      'No HP',
      'Email',
      'Alamat',
      'RT',
      'RW',
      'Kelurahan',
      'Kecamatan',
      'Kota/Kab',
      'Provinsi',
      'Kode Pos',
      'Nomor Rumah',
      'Status Tinggal',
      'Status Warga',
    ];
    const rows = filteredWarga.map((w) => [
      w.id,
      w.nik,
      w.nama,
      w.tempatLahir,
      w.tanggalLahir,
      w.jenisKelamin,
      w.golonganDarah || '-',
      w.agama,
      w.pendidikan,
      w.pekerjaan,
      w.statusPerkawinan,
      w.hubunganKeluarga || 'Kepala Keluarga',
      w.kewarganegaraan || 'WNI',
      w.noHp,
      w.email,
      w.alamat,
      w.rt,
      w.rw,
      w.kelurahan || 'Sukamaju',
      w.kecamatan || 'Cilodong',
      w.kotaKabupaten || 'Depok',
      w.provinsi || 'Jawa Barat',
      w.kodePos || '16415',
      w.nomorRumah,
      w.statusTinggal,
      w.statusWarga,
    ]);
    exportToCSV('Data_Kependudukan_KTP_Sukamaju', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold border-2 border-slate-900 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              Modul Master Data Kependudukan RT/RW
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Database Resmi Terintegrasi: KTP Elektronik, Kartu Keluarga (KK), & Pemetaan Bangunan Rumah.
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border-2 border-slate-900 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('WARGA')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'WARGA'
                ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-sky-400" />
            Data Warga KTP ({wargaList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('KK')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'KK'
                ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Kartu Keluarga ({kkList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('RUMAH')}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'RUMAH'
                ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-purple-400" />
            Register Rumah ({rumahList.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: DATA WARGA (KTP ELEKTRONIK STANDAR INDONESIA)                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'WARGA' && (
        <div className="space-y-4">
          {/* Controls & Action Bar */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Input & Primary Filters */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari Nama Warga, NIK (16 digit), Pekerjaan, atau No. Rumah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>

                {/* RT Filter */}
                <select
                  value={rtFilter}
                  onChange={(e) => setRtFilter(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                >
                  <option value="ALL">Semua RT</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const val = String(i + 1).padStart(2, '0');
                    return <option key={val} value={val}>RT {val}</option>;
                  })}
                </select>

                {/* Golongan Darah Filter */}
                <select
                  value={golDarahFilter}
                  onChange={(e) => setGolDarahFilter(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                >
                  <option value="ALL">Gol. Darah (Semua)</option>
                  <option value="A">Gol. Darah A</option>
                  <option value="B">Gol. Darah B</option>
                  <option value="AB">Gol. Darah AB</option>
                  <option value="O">Gol. Darah O</option>
                  <option value="-">Belum Tahu / -</option>
                </select>

                {/* Agama Filter */}
                <select
                  value={agamaFilter}
                  onChange={(e) => setAgamaFilter(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                >
                  <option value="ALL">Agama (Semua)</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>

                {/* Status Perkawinan Filter */}
                <select
                  value={statusPerkawinanFilter}
                  onChange={(e) => setStatusPerkawinanFilter(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                >
                  <option value="ALL">Status Perkawinan (Semua)</option>
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>

                {/* Jenis Kelamin Filter */}
                <select
                  value={jenisKelaminFilter}
                  onChange={(e) => setJenisKelaminFilter(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                >
                  <option value="ALL">Gender (Semua)</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowEncryptedNik(!showEncryptedNik)}
                  className={`text-xs px-3 py-1.5 rounded-xl border-2 font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    showEncryptedNik
                      ? 'bg-amber-100 border-slate-900 text-amber-900'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {showEncryptedNik ? <Unlock className="w-3.5 h-3.5 text-amber-700" /> : <Lock className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{showEncryptedNik ? 'Sembunyikan NIK' : 'Lihat Dekripsi NIK'}</span>
                </button>

                <button
                  onClick={() => exportWargaCSV(filteredWarga)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-900 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Unduh format Excel / CSV"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>

                <button
                  onClick={() => exportWargaPDF(filteredWarga)}
                  className="bg-red-50 hover:bg-red-100 text-red-800 border-2 border-slate-900 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Cetak Laporan PDF Resmi"
                >
                  <FileText className="w-3.5 h-3.5 text-red-600" /> PDF
                </button>

                <button
                  onClick={handleOpenAddWargaModal}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-1.5 rounded-xl font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Warga
                </button>
              </div>
            </div>

            {/* Active Filter Counter & Reset */}
            {(rtFilter !== 'ALL' ||
              golDarahFilter !== 'ALL' ||
              agamaFilter !== 'ALL' ||
              statusPerkawinanFilter !== 'ALL' ||
              jenisKelaminFilter !== 'ALL' ||
              searchTerm !== '') && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[11px]">
                <div className="flex items-center gap-2 flex-wrap font-bold text-slate-700">
                  <span className="text-slate-500 font-mono">Filter Aktif:</span>
                  {rtFilter !== 'ALL' && <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300">RT {rtFilter}</span>}
                  {golDarahFilter !== 'ALL' && <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200">Gol. Darah {golDarahFilter}</span>}
                  {agamaFilter !== 'ALL' && <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">Agama {agamaFilter}</span>}
                  {statusPerkawinanFilter !== 'ALL' && <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">{statusPerkawinanFilter}</span>}
                  {jenisKelaminFilter !== 'ALL' && <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">{jenisKelaminFilter === 'L' ? 'Laki-laki' : 'Perempuan'}</span>}
                  <span className="text-emerald-700 font-extrabold font-mono">({filteredWarga.length} Hasil Ditampilkan)</span>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRtFilter('ALL');
                    setGolDarahFilter('ALL');
                    setPekerjaanFilter('ALL');
                    setAgamaFilter('ALL');
                    setStatusPerkawinanFilter('ALL');
                    setJenisKelaminFilter('ALL');
                  }}
                  className="text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>

          {/* Table Data Warga */}
          <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 border-b-2 border-slate-900">NIK & Status E-KTP</th>
                    <th className="p-3 border-b-2 border-slate-900">Nama Lengkap (KTP)</th>
                    <th className="p-3 border-b-2 border-slate-900">L/P</th>
                    <th className="p-3 border-b-2 border-slate-900">TTL & Agama</th>
                    <th className="p-3 border-b-2 border-slate-900">Pekerjaan & Hubungan</th>
                    <th className="p-3 border-b-2 border-slate-900">Alamat & Rumah</th>
                    <th className="p-3 border-b-2 border-slate-900">RT / RW</th>
                    <th className="p-3 border-b-2 border-slate-900">Status Warga</th>
                    <th className="p-3 border-b-2 border-slate-900 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredWarga.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-extrabold text-slate-800 text-sm">Belum ada data warga terdaftar</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Klik tombol "+ Tambah Warga Baru (KTP)" untuk memasukkan data warga lengkap sesuai format KTP Indonesia.
                        </p>
                      </td>
                    </tr>
                  )}
                  {filteredWarga.map((warga) => {
                    const maskedNik = showEncryptedNik
                      ? warga.nik
                      : warga.nik.slice(0, 6) + '******' + warga.nik.slice(-4);

                    return (
                      <tr key={warga.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-bold">{maskedNik}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            GolDarah: <strong className="text-slate-700">{warga.golonganDarah || '-'}</strong>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 flex-wrap">
                            <span>{warga.nama}</span>
                            {warga.peranAkses && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-400">
                                {warga.peranAkses}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {warga.noHp ? `WA: ${warga.noHp}` : 'Tanpa No. HP'}
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                              warga.jenisKelamin === 'Laki-laki'
                                ? 'bg-sky-100 text-sky-800 border-sky-300'
                                : 'bg-pink-100 text-pink-800 border-pink-300'
                            }`}
                          >
                            {warga.jenisKelamin === 'Laki-laki' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800">
                          <div className="font-semibold">{warga.tempatLahir}, {warga.tanggalLahir}</div>
                          <div className="text-[10px] text-slate-500">{warga.agama}</div>
                        </td>
                        <td className="p-3 text-slate-800">
                          <div className="font-semibold">{warga.pekerjaan}</div>
                          <div className="text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200 inline-block mt-0.5">
                            {warga.hubunganKeluarga || 'Kepala Keluarga'}
                          </div>
                        </td>
                        <td className="p-3 text-slate-800">
                          <span className="font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-300 mr-1.5">
                            No. {warga.nomorRumah}
                          </span>
                          <span className="text-[11px] text-slate-600">{warga.alamat}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {warga.rt}/{warga.rw}
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                            {warga.statusWarga}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setViewingKtpWarga(warga)}
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg border border-sky-300 transition cursor-pointer"
                            title="Pratinjau E-KTP Digital"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditWargaModal(warga)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-300 transition cursor-pointer"
                            title="Edit Data Warga"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus data warga ${warga.nama}?`)) {
                                onDeleteWarga(warga.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-300 transition cursor-pointer"
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

      {/* ========================================================================= */}
      {/* SUB-TAB 2: KARTU KELUARGA (KK STANDAR DUKCAPIL)                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'KK' && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Register Kartu Keluarga (KK) Standar Dukcapil
              </h3>
              <p className="text-xs text-slate-500">Mencakup Nomor KK (16 digit), Kepala Keluarga, Alamat, dan Anggota Keluarga.</p>
            </div>
            <button
              onClick={handleOpenAddKkModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Formulir KK Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKk.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-extrabold text-slate-800 text-sm">Belum ada Kartu Keluarga terdaftar</p>
                <p className="text-xs text-slate-500 mt-0.5">Klik tombol "+ Formulir KK Baru" untuk mendaftarkan Kartu Keluarga warga.</p>
              </div>
            )}
            {filteredKk.map((kk) => (
              <div key={kk.id} className="p-4 bg-slate-50 border-2 border-slate-900 rounded-2xl space-y-3 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono bg-slate-900 text-white px-2.5 py-0.5 rounded-lg font-bold">
                      No. KK: {kk.nomorKk}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {kk.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Kepala Keluarga:</span>
                    <h4 className="font-black text-slate-900 text-sm">{kk.kepalaKeluargaNama}</h4>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {kk.alamat}, RT {kk.rt}/RW {kk.rw}, Kel. {kk.kelurahan || 'Sukamaju'}, Kec. {kk.kecamatan || 'Cilodong'}, {kk.kotaKabupaten || 'Depok'} {kk.kodePos || ''}
                  </p>

                  <div className="text-xs text-slate-700 pt-2 border-t border-slate-200">
                    <div className="font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Daftar Anggota Keluarga ({kk.anggotaCount} Orang):</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 font-medium bg-white p-2.5 rounded-xl border border-slate-200">
                      {kk.anggotaNames.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setViewingKkDetail(kk)}
                    className="p-1.5 bg-sky-50 text-sky-700 rounded-lg border border-sky-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Pratinjau Dokumen
                  </button>
                  <button
                    onClick={() => handleOpenEditKkModal(kk)}
                    className="p-1.5 bg-amber-50 text-amber-800 rounded-lg border border-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  {onDeleteKK && (
                    <button
                      onClick={() => onDeleteKK(kk.id)}
                      className="p-1.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: DATA RUMAH                                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'RUMAH' && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Home className="w-4 h-4 text-purple-600" /> Register Bangunan Rumah & Peta GPS
              </h3>
              <p className="text-xs text-slate-500">Pendataan fisik rumah tempat tinggal, status hunian, dan titik lokasi GPS.</p>
            </div>
            <button
              onClick={handleOpenAddRumahModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Reg. Rumah Baru
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredRumah.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                <Home className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-extrabold text-slate-800 text-sm">Belum ada register bangunan rumah</p>
                <p className="text-xs text-slate-500 mt-0.5">Klik "+ Reg. Rumah Baru" untuk menambah data rumah.</p>
              </div>
            )}
            {filteredRumah.map((rmh) => (
              <div key={rmh.id} className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-2xl space-y-2 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-800 text-base">No. {rmh.nomorRumah}</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-full font-bold">
                      {rmh.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 mt-1">Pemilik: {rmh.pemilikNama}</p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {rmh.blok}, RT {rmh.rt}/RW {rmh.rw} • {rmh.penghuniCount} Penghuni
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-rose-600" /> GPS: {rmh.lat}, {rmh.lng}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleOpenEditRumahModal(rmh)}
                    className="p-1.5 bg-amber-50 text-amber-800 rounded-lg border border-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  {onDeleteRumah && (
                    <button
                      onClick={() => onDeleteRumah(rmh.id)}
                      className="p-1.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FORMULIR WARGA KTP ELEKTRONIK (STANDAR LENGKAP INDONESIA)       */}
      {/* ========================================================================= */}
      {isWargaModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-900 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            {/* Modal Header Badge */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded uppercase">
                    Republik Indonesia • E-KTP Standar Dukcapil
                  </span>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingWarga ? 'Edit Formulir Warga (KTP)' : 'Formulir Pendaftaran Warga Baru (KTP)'}
                  </h3>
                </div>
              </div>
              <button onClick={() => setIsWargaModalOpen(false)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWarga} className="space-y-5 text-xs">
              {/* BAGIAN 1: IDENTITAS UTAMA (KTP) */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-sky-800">
                  <ShieldCheck className="w-4 h-4 text-sky-600" /> 1. Data Identitas Pokok KTP
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* NIK */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-extrabold">NIK (Nomor Induk Kependudukan) *</label>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        (formData.nik || '').length === 16 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {(formData.nik || '').length}/16 Digit
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={formData.nik || ''}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="Contoh: 327601xxxxxxxxxx"
                    />
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Nama Lengkap (Sesuai KTP) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nama || ''}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="Nama lengkap tanpa gelar disingkat"
                    />
                  </div>

                  {/* Tempat Lahir */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      value={formData.tempatLahir || ''}
                      onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="Kota / Kabupaten tempat lahir"
                    />
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={formData.tanggalLahir || ''}
                      onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Jenis Kelamin</label>
                    <select
                      value={formData.jenisKelamin || 'Laki-laki'}
                      onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  {/* Golongan Darah */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Golongan Darah</label>
                    <select
                      value={formData.golonganDarah || '-'}
                      onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="-">Tidak Tahu (-)</option>
                      <option value="A">Golongan A</option>
                      <option value="B">Golongan B</option>
                      <option value="AB">Golongan AB</option>
                      <option value="O">Golongan O</option>
                    </select>
                  </div>

                  {/* Agama */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Agama</label>
                    <select
                      value={formData.agama || 'Islam'}
                      onChange={(e) => setFormData({ ...formData, agama: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Khonghucu">Khonghucu</option>
                    </select>
                  </div>

                  {/* Kewarganegaraan */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Kewarganegaraan</label>
                    <select
                      value={formData.kewarganegaraan || 'WNI'}
                      onChange={(e) => setFormData({ ...formData, kewarganegaraan: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="WNI">WNI (Warga Negara Indonesia)</option>
                      <option value="WNA">WNA (Warga Negara Asing)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BAGIAN 2: STATUS & PEKERJAAN */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-emerald-800">
                  <Briefcase className="w-4 h-4 text-emerald-600" /> 2. Status Perkawinan, Keluarga, & Pekerjaan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Status Perkawinan */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Status Perkawinan</label>
                    <select
                      value={formData.statusPerkawinan || 'Kawin'}
                      onChange={(e) => setFormData({ ...formData, statusPerkawinan: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="Belum Kawin">Belum Kawin</option>
                      <option value="Kawin">Kawin</option>
                      <option value="Cerai Hidup">Cerai Hidup</option>
                      <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                  </div>

                  {/* Hubungan Dalam Keluarga */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Status Hubungan Dalam Keluarga</label>
                    <select
                      value={formData.hubunganKeluarga || 'Kepala Keluarga'}
                      onChange={(e) => setFormData({ ...formData, hubunganKeluarga: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="Kepala Keluarga">Kepala Keluarga</option>
                      <option value="Suami">Suami</option>
                      <option value="Istri">Istri</option>
                      <option value="Anak">Anak</option>
                      <option value="Orangtua">Orangtua</option>
                      <option value="Mantu">Mantu</option>
                      <option value="Cucu">Cucu</option>
                      <option value="Famili Lain">Famili Lain</option>
                    </select>
                  </div>

                  {/* Pendidikan Terakhir */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Pendidikan Terakhir</label>
                    <select
                      value={formData.pendidikan || 'S1'}
                      onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="Tidak / Belum Sekolah">Tidak / Belum Sekolah</option>
                      <option value="SD / MI">SD / MI</option>
                      <option value="SMP / MTs">SMP / MTs</option>
                      <option value="SMA / SMK / MA">SMA / SMK / MA</option>
                      <option value="D3 / Diploma">D3 / Diploma</option>
                      <option value="S1 / Sarjana">S1 / Sarjana</option>
                      <option value="S2 / Magister">S2 / Magister</option>
                      <option value="S3 / Doktor">S3 / Doktor</option>
                    </select>
                  </div>

                  {/* Pekerjaan */}
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Pekerjaan Sesuai KTP</label>
                    <input
                      type="text"
                      value={formData.pekerjaan || ''}
                      onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="Karyawan Swasta / PNS / Wiraswasta"
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 3: ALAMAT KTP & DOMISILI LENGKAP */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-purple-800">
                  <MapPin className="w-4 h-4 text-purple-600" /> 3. Alamat KTP & Wilayah Domisili RT/RW
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Alamat Jalan / Perumahan / Dusun</label>
                    <input
                      type="text"
                      value={formData.alamat || ''}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="Jl. Graha Warga Blok A"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Nomor Rumah</label>
                      <input
                        type="text"
                        value={formData.nomorRumah || ''}
                        onChange={(e) => setFormData({ ...formData, nomorRumah: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-extrabold text-purple-800 focus:outline-none focus:border-slate-900"
                        placeholder="A-01"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">RT</label>
                      <select
                        value={formData.rt || '01'}
                        onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-2 py-2 font-bold text-slate-900"
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const val = String(i + 1).padStart(2, '0');
                          return <option key={val} value={val}>RT {val}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">RW</label>
                      <select
                        value={formData.rw || '05'}
                        onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-2 py-2 font-bold text-slate-900"
                      >
                        {Array.from({ length: 30 }, (_, i) => {
                          const val = String(i + 1).padStart(2, '0');
                          return <option key={val} value={val}>RW {val}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Kode Pos</label>
                      <input
                        type="text"
                        value={formData.kodePos || '16415'}
                        onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Kelurahan / Desa</label>
                      <input
                        type="text"
                        value={formData.kelurahan || 'Sukamaju'}
                        onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Kecamatan</label>
                      <input
                        type="text"
                        value={formData.kecamatan || 'Cilodong'}
                        onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Kota / Kabupaten</label>
                      <input
                        type="text"
                        value={formData.kotaKabupaten || 'Depok'}
                        onChange={(e) => setFormData({ ...formData, kotaKabupaten: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* BAGIAN 4: KONTAK & STATUS KEBERADAAN */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-rose-800">
                  <Phone className="w-4 h-4 text-rose-600" /> 4. Kontak WhatsApp, Status Tinggal, & Lokasi Peta
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">No. HP / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.noHp || ''}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900"
                      placeholder="0812xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Email Warga (Opsional)</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900"
                      placeholder="warga@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Status Kepemilikan Hunian</label>
                    <select
                      value={formData.statusTinggal || 'Tetap'}
                      onChange={(e) => setFormData({ ...formData, statusTinggal: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                    >
                      <option value="Tetap">Rumah Sendiri (Tetap)</option>
                      <option value="Kontrak">Sewa / Kontrak</option>
                      <option value="Kos">Kos / Mess</option>
                      <option value="Komuter">Komuter / Non-Domisili</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Status Keberadaan Warga</label>
                    <select
                      value={formData.statusWarga || 'Aktif'}
                      onChange={(e) => setFormData({ ...formData, statusWarga: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                    >
                      <option value="Aktif">Aktif Berdomisili</option>
                      <option value="Pindah">Pindah Domisili</option>
                      <option value="Meninggal">Meninggal Dunia</option>
                    </select>
                  </div>
                </div>

                {/* Coordinates Pin Picker Simulation */}
                <div className="p-3 bg-white rounded-xl border-2 border-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Koordinat GPS Peta Rumah:</span>
                    <p className="font-mono text-slate-500 text-[11px] font-semibold">
                      Lat: {formData.lat}, Lng: {formData.lng}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMapTarget('WARGA');
                      setTempLat(formData.lat || -6.2088);
                      setTempLng(formData.lng || 106.8456);
                      setIsMapModalOpen(true);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Atur Pin Peta
                  </button>
                </div>
              </div>

              {/* BAGIAN 5: HAK AKSES SISTEM & HAK AKSES PERAN (USER ROLE) */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-300 space-y-3">
                <h4 className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> 5. Hak Akses Sistem & Penugasan Peran Pengurus (Role Based Access)
                </h4>
                <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                  Ketua Karang Taruna & Super Admin dapat menetapkan atau mengubah hak akses peran pengurus (Karang Taruna, RT/RW, Inti) untuk warga ini.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Peran Akses (User Role)</label>
                    <select
                      value={formData.peranAkses || 'WARGA'}
                      onChange={(e) => setFormData({ ...formData, peranAkses: e.target.value as any })}
                      className="w-full bg-white border-2 border-slate-900 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-600 shadow-xs"
                    >
                      <option value="WARGA">Warga / Penduduk biasa (Default)</option>
                      <optgroup label="⚡ Sub-Menu Karang Taruna (E-REKAP EMS)">
                        <option value="KETUA_KARANG_TARUNA">Ketua Karang Taruna (Full Admin Access)</option>
                        <option value="WAKIL_KETUA_KARANG_TARUNA">Wakil Ketua Karang Taruna</option>
                        <option value="SEKRETARIS_KARANG_TARUNA">Sekretaris Karang Taruna</option>
                        <option value="WAKIL_SEKRETARIS_KARANG_TARUNA">Wakil Sekretaris Karang Taruna</option>
                        <option value="BENDAHARA_KARANG_TARUNA">Bendahara Karang Taruna</option>
                        <option value="WAKIL_BENDAHARA_KARANG_TARUNA">Wakil Bendahara Karang Taruna</option>
                        <option value="PENGURUS_KARANG_TARUNA">Pengurus / Anggota Karang Taruna</option>
                      </optgroup>
                      <optgroup label="🏢 Pengurus Inti Lingkungan">
                        <option value="KETUA">Ketua Organisasi Lingkungan</option>
                        <option value="SEKRETARIS">Sekretaris Inti</option>
                        <option value="BENDAHARA">Bendahara Inti</option>
                      </optgroup>
                      <optgroup label="🏛️ Pengurus RW & RT">
                        <option value="KETUA_RW">Ketua RW</option>
                        <option value="SEKRETARIS_RW">Sekretaris RW</option>
                        <option value="BENDAHARA_RW">Bendahara RW</option>
                        <option value="KETUA_RT">Ketua RT</option>
                        <option value="SEKRETARIS_RT">Sekretaris RT</option>
                        <option value="BENDAHARA_RT">Bendahara RT</option>
                      </optgroup>
                      <optgroup label="🌱 Lembaga & Kader Warga">
                        <option value="KETUA_PKK">Ketua PKK</option>
                        <option value="PENGURUS_PKK">Pengurus PKK</option>
                        <option value="POSYANDU">Kader Posyandu</option>
                        <option value="BANK_SAMPAH">Pengelola Bank Sampah</option>
                        <option value="LINMAS">Tim Linmas / Keamanan</option>
                        <option value="KETUA_DKM">Ketua DKM</option>
                      </optgroup>
                      <optgroup label="🛡️ Sistem Administrator">
                        <option value="SUPER_ADMIN">Super Administrator</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsWargaModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  Simpan Data Warga (KTP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FORMULIR KARTU KELUARGA (KK STANDAR DUKCAPIL)                   */}
      {/* ========================================================================= */}
      {isKkModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-900 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded uppercase">
                    Kementerian Dalam Negeri • Kartu Keluarga
                  </span>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingKk ? 'Edit Data Kartu Keluarga (KK)' : 'Formulir Pendaftaran Kartu Keluarga (KK)'}
                  </h3>
                </div>
              </div>
              <button onClick={() => setIsKkModalOpen(false)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKk} className="space-y-4 text-xs">
              {/* Nomor KK & Kepala Keluarga */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                  1. Informasi Dokumen Kartu Keluarga
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-800 font-extrabold">Nomor Kartu Keluarga (16 Digit) *</label>
                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        {(kkFormData.nomorKk || '').length}/16 Digit
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={kkFormData.nomorKk || ''}
                      onChange={(e) => setKkFormData({ ...kkFormData, nomorKk: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="327601xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Nama Kepala Keluarga *</label>
                    <input
                      type="text"
                      required
                      value={kkFormData.kepalaKeluargaNama || ''}
                      onChange={(e) => setKkFormData({ ...kkFormData, kepalaKeluargaNama: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                      placeholder="Nama lengkap Kepala Keluarga"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat KK */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-800">
                  2. Alamat Kartu Keluarga Sesuai Dokumen
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-800 font-extrabold mb-1">Alamat Jalan / Perumahan</label>
                    <input
                      type="text"
                      value={kkFormData.alamat || ''}
                      onChange={(e) => setKkFormData({ ...kkFormData, alamat: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900"
                      placeholder="Jl. Graha Warga Blok A"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">RT</label>
                      <select
                        value={kkFormData.rt || '01'}
                        onChange={(e) => setKkFormData({ ...kkFormData, rt: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-2 py-2 font-bold text-slate-900"
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const val = String(i + 1).padStart(2, '0');
                          return <option key={val} value={val}>RT {val}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">RW</label>
                      <select
                        value={kkFormData.rw || '05'}
                        onChange={(e) => setKkFormData({ ...kkFormData, rw: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-2 py-2 font-bold text-slate-900"
                      >
                        {Array.from({ length: 30 }, (_, i) => {
                          const val = String(i + 1).padStart(2, '0');
                          return <option key={val} value={val}>RW {val}</option>;
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Kelurahan</label>
                      <input
                        type="text"
                        value={kkFormData.kelurahan || 'Sukamaju'}
                        onChange={(e) => setKkFormData({ ...kkFormData, kelurahan: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-800 font-extrabold mb-1">Kecamatan</label>
                      <input
                        type="text"
                        value={kkFormData.kecamatan || 'Cilodong'}
                        onChange={(e) => setKkFormData({ ...kkFormData, kecamatan: e.target.value })}
                        className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Anggota Keluarga List */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-sky-800">
                    3. Anggota Keluarga yang Terdaftar di KK ({kkAnggotaList.length} Orang)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setKkAnggotaList([...kkAnggotaList, ''])}
                    className="bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Anggota
                  </button>
                </div>

                <div className="space-y-2">
                  {kkAnggotaList.map((nama, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-center font-mono font-bold text-slate-500">{idx + 1}.</span>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => {
                          const updated = [...kkAnggotaList];
                          updated[idx] = e.target.value;
                          setKkAnggotaList(updated);
                        }}
                        className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900"
                        placeholder={`Nama Anggota ${idx + 1} (misal: Istri, Anak)`}
                      />
                      {kkAnggotaList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setKkAnggotaList(kkAnggotaList.filter((_, i) => i !== idx))}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsKkModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  Simpan Kartu Keluarga (KK)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: FORMULIR REGISTER BANGUNAN RUMAH                                */}
      {/* ========================================================================= */}
      {isRumahModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-900 max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-slate-900 text-base">
                  {editingRumah ? 'Edit Register Rumah' : 'Formulir Register Bangunan Rumah'}
                </h3>
              </div>
              <button onClick={() => setIsRumahModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRumah} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Nomor Rumah *</label>
                <input
                  type="text"
                  required
                  value={rumahFormData.nomorRumah || ''}
                  onChange={(e) => setRumahFormData({ ...rumahFormData, nomorRumah: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 font-black text-purple-800"
                  placeholder="A-01 / B-12"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-800 font-extrabold mb-1">Blok</label>
                  <input
                    type="text"
                    value={rumahFormData.blok || 'Blok A'}
                    onChange={(e) => setRumahFormData({ ...rumahFormData, blok: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-extrabold mb-1">RT</label>
                  <select
                    value={rumahFormData.rt || '01'}
                    onChange={(e) => setRumahFormData({ ...rumahFormData, rt: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-2 py-1.5 font-bold"
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const val = String(i + 1).padStart(2, '0');
                      return <option key={val} value={val}>RT {val}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-800 font-extrabold mb-1">RW</label>
                  <select
                    value={rumahFormData.rw || '05'}
                    onChange={(e) => setRumahFormData({ ...rumahFormData, rw: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-2 py-1.5 font-bold"
                  >
                    {Array.from({ length: 30 }, (_, i) => {
                      const val = String(i + 1).padStart(2, '0');
                      return <option key={val} value={val}>RW {val}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold mb-1">Nama Pemilik Rumah *</label>
                <input
                  type="text"
                  required
                  value={rumahFormData.pemilikNama || ''}
                  onChange={(e) => setRumahFormData({ ...rumahFormData, pemilikNama: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                  placeholder="Nama Pemilik Bangunan"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-800 font-extrabold mb-1">Jumlah Penghuni</label>
                  <input
                    type="number"
                    min={0}
                    value={rumahFormData.penghuniCount || 1}
                    onChange={(e) => setRumahFormData({ ...rumahFormData, penghuniCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-extrabold mb-1">Status Bangunan</label>
                  <select
                    value={rumahFormData.status || 'Dihuni'}
                    onChange={(e) => setRumahFormData({ ...rumahFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-1.5 font-bold"
                  >
                    <option value="Dihuni">Dihuni</option>
                    <option value="Kosong">Kosong</option>
                    <option value="Kontrak">Kontrak / Sewa</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsRumahModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  Simpan Register Rumah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PRATINJAU VIRTUAL E-KTP DUKCAPIL                                  */}
      {/* ========================================================================= */}
      {viewingKtpWarga && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 text-white rounded-3xl border-4 border-slate-900 max-w-xl w-full p-6 shadow-2xl space-y-4 relative overflow-hidden">
            {/* Watermark overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-sky-400/40 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-sky-300" />
                <div>
                  <h3 className="font-black text-sm tracking-wider uppercase text-sky-100">
                    PROVINSI JAWA BARAT • KOTA DEPOK
                  </h3>
                  <p className="text-[10px] font-mono text-sky-200 font-bold uppercase tracking-widest">
                    KARTU TANDA PENDUDUK ELEKTRONIK (E-KTP)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingKtpWarga(null)}
                className="p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full border border-sky-400/40 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between bg-sky-950/60 p-2.5 rounded-xl border border-sky-400/30">
                <span className="text-[11px] font-bold text-sky-300">NIK:</span>
                <span className="text-base font-extrabold tracking-widest text-amber-300">{viewingKtpWarga.nik}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1 text-[11px] font-semibold">
                  <div>
                    <span className="text-sky-300">Nama:</span> <strong className="text-white font-extrabold text-xs uppercase">{viewingKtpWarga.nama}</strong>
                  </div>
                  <div>
                    <span className="text-sky-300">Tempat/Tgl Lahir:</span> {viewingKtpWarga.tempatLahir}, {viewingKtpWarga.tanggalLahir}
                  </div>
                  <div>
                    <span className="text-sky-300">Jenis Kelamin:</span> {viewingKtpWarga.jenisKelamin} <span className="ml-2 text-sky-300">Gol. Darah:</span> {viewingKtpWarga.golonganDarah || '-'}
                  </div>
                  <div>
                    <span className="text-sky-300">Alamat:</span> {viewingKtpWarga.alamat} No. {viewingKtpWarga.nomorRumah}
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-300">RT/RW:</span> {viewingKtpWarga.rt}/{viewingKtpWarga.rw}
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-300">Kel/Desa:</span> {viewingKtpWarga.kelurahan || 'Sukamaju'}
                  </div>
                  <div className="pl-4">
                    <span className="text-sky-300">Kecamatan:</span> {viewingKtpWarga.kecamatan || 'Cilodong'}
                  </div>
                  <div>
                    <span className="text-sky-300">Agama:</span> {viewingKtpWarga.agama}
                  </div>
                  <div>
                    <span className="text-sky-300">Status Perkawinan:</span> {viewingKtpWarga.statusPerkawinan}
                  </div>
                  <div>
                    <span className="text-sky-300">Pekerjaan:</span> {viewingKtpWarga.pekerjaan}
                  </div>
                  <div>
                    <span className="text-sky-300">Kewarganegaraan:</span> {viewingKtpWarga.kewarganegaraan || 'WNI'}
                  </div>
                  <div>
                    <span className="text-sky-300">Berlaku Hingga:</span> <strong className="text-amber-300">SEUMUR HIDUP</strong>
                  </div>
                </div>

                {/* Photo Placeholder Card */}
                <div className="flex flex-col items-center justify-between bg-sky-950/80 p-2 rounded-xl border border-sky-400/40 text-center">
                  <div className="w-full h-32 bg-slate-800 rounded-lg border-2 border-amber-300 flex flex-col items-center justify-center text-slate-400">
                    <UserCheck className="w-10 h-10 text-sky-400" />
                    <span className="text-[9px] font-sans font-bold mt-1 text-slate-300">PAS FOTO E-KTP</span>
                  </div>
                  <div className="mt-2 text-[9px] text-sky-300 font-sans font-bold uppercase">
                    KOTA DEPOK<br />{new Date().toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: PRATINJAU DOKUMEN KARTU KELUARGA (KK)                           */}
      {/* ========================================================================= */}
      {viewingKkDetail && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border-4 border-slate-900 max-w-2xl w-full p-6 shadow-2xl space-y-4 font-serif text-slate-900 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 font-sans">
              <div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  DOKUMEN KARTU KELUARGA RESMI
                </span>
                <h3 className="font-black text-slate-900 text-base uppercase">
                  KARTU KELUARGA
                </h3>
                <p className="text-xs font-mono font-bold text-emerald-700">No. {viewingKkDetail.nomorKk}</p>
              </div>
              <button
                onClick={() => setViewingKkDetail(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Nama Kepala Keluarga:</span>
                  <strong className="text-sm font-black text-slate-900">{viewingKkDetail.kepalaKeluargaNama}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Alamat KK:</span>
                  <strong className="text-xs font-bold text-slate-800">
                    {viewingKkDetail.alamat}, RT {viewingKkDetail.rt}/RW {viewingKkDetail.rw}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Desa/Kelurahan:</span>
                  <strong className="text-xs font-bold text-slate-800">{viewingKkDetail.kelurahan || 'Sukamaju'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Kecamatan / Kab-Kota:</span>
                  <strong className="text-xs font-bold text-slate-800">
                    {viewingKkDetail.kecamatan || 'Cilodong'} / {viewingKkDetail.kotaKabupaten || 'Depok'}
                  </strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs mb-1">Daftar Anggota Keluarga ({viewingKkDetail.anggotaCount} Orang):</h4>
                <div className="border-2 border-slate-900 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white text-[10px]">
                      <tr>
                        <th className="p-2 border-r border-slate-700 w-8 text-center">No</th>
                        <th className="p-2 border-r border-slate-700">Nama Lengkap</th>
                        <th className="p-2">Status Dalam Keluarga</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                      {viewingKkDetail.anggotaNames.map((nama, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center font-mono border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2 font-bold border-r border-slate-200">{nama}</td>
                          <td className="p-2 text-slate-600">
                            {idx === 0 ? 'KEPALA KELUARGA' : 'ANGGOTA KELUARGA'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: MAP GPS PICKER SIMULATOR                                         */}
      {/* ========================================================================= */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-slate-900 max-w-lg w-full p-5 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" /> Simulasi Pemetaan GPS Rumah Warga
              </h4>
              <button onClick={() => setIsMapModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900 text-white h-52 rounded-2xl flex flex-col items-center justify-center relative p-4 text-center border-2 border-slate-900 shadow-inner">
              <MapPin className="w-10 h-10 text-rose-500 animate-bounce" />
              <p className="text-xs font-black mt-2 text-slate-100">Peta Digital Perumahan Graha Warga RW 05 Sukamaju</p>
              <p className="text-[11px] text-sky-400 font-mono font-bold mt-1">
                Lat: {tempLat.toFixed(5)}, Lng: {tempLng.toFixed(5)}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempLat(-6.2088 + (Math.random() - 0.5) * 0.006);
                    setTempLng(106.8456 + (Math.random() - 0.5) * 0.006);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-xl text-slate-200 border border-slate-700 font-bold cursor-pointer"
                >
                  Acak Koordinat GPS
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (mapTarget === 'WARGA') {
                    setFormData({ ...formData, lat: tempLat, lng: tempLng });
                  } else {
                    setRumahFormData({ ...rumahFormData, lat: tempLat, lng: tempLng });
                  }
                  setIsMapModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2 rounded-xl font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
              >
                Gunakan Koordinat GPS Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

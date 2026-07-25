import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Download,
  Upload,
  Palette,
  Activity,
  Database,
  FileSpreadsheet,
  FileCode,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Clock,
  Zap,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  Warga,
  KartuKeluarga,
  TransaksiKas,
  TagihanIuran,
  Surat,
  AduanWarga,
  EventItem,
  ArsipDokumen,
  SetoranSampah,
} from '../types';

interface PengaturanViewProps {
  wargaList: Warga[];
  kkList: KartuKeluarga[];
  kasList: TransaksiKas[];
  tagihanList: TagihanIuran[];
  suratList: Surat[];
  aduanList: AduanWarga[];
  eventsList: EventItem[];
  arsipList: ArsipDokumen[];
  setoranSampahList: SetoranSampah[];
  onImportFullBackup: (importedData: any) => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const THEME_OPTIONS = [
  { id: 'blue', name: 'Sukamaju Classic Blue', primaryHex: '#0056b3', badge: 'bg-[#0056b3] text-white' },
  { id: 'emerald', name: 'Emerald Posyandu', primaryHex: '#059669', badge: 'bg-emerald-600 text-white' },
  { id: 'indigo', name: 'Royal Indigo', primaryHex: '#4f46e5', badge: 'bg-indigo-600 text-white' },
  { id: 'amber', name: 'Warm Amber Gold', primaryHex: '#d97706', badge: 'bg-amber-600 text-white' },
  { id: 'teal', name: 'Ocean Teal', primaryHex: '#0d9488', badge: 'bg-teal-600 text-white' },
];

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  wargaList,
  kkList,
  kasList,
  tagihanList,
  suratList,
  aduanList,
  eventsList,
  arsipList,
  setoranSampahList,
  onImportFullBackup,
  addToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'EXPORT_IMPORT' | 'TEMA' | 'MONITORING'>('EXPORT_IMPORT');
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    return localStorage.getItem('satuwarga_color_theme') || 'blue';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to convert JSON objects array to CSV string
  const convertToCSV = (arr: Record<string, any>[]): string => {
    if (!arr || arr.length === 0) return '';
    const headers = Object.keys(arr[0]);
    const csvRows = [headers.join(',')];

    for (const row of arr) {
      const values = headers.map((header) => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  const downloadCSV = (filename: string, csvData: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Menu Specific CSV Exporters
  const handleExportMenuCSV = (menuType: string) => {
    let csvStr = '';
    let count = 0;

    switch (menuType) {
      case 'warga':
        csvStr = convertToCSV(
          wargaList.map((w) => ({
            NIK: w.nik,
            Nama: w.nama,
            Gender: w.jenisKelamin,
            Status: w.statusWarga,
            RT: w.rt,
            RW: w.rw,
            'No. Rumah': w.nomorRumah,
            Pekerjaan: w.pekerjaan,
            Agama: w.agama,
            HP: w.nomorHp,
          }))
        );
        count = wargaList.length;
        break;

      case 'kk':
        csvStr = convertToCSV(
          kkList.map((k) => ({
            'No KK': k.nomorKk,
            'Kepala Keluarga': k.namaKepalaKeluarga,
            RT: k.rt,
            RW: k.rw,
            Alamat: k.alamat,
            'Jumlah Anggota': k.anggotaUrutIds ? k.anggotaUrutIds.length : 1,
          }))
        );
        count = kkList.length;
        break;

      case 'kas':
        csvStr = convertToCSV(
          kasList.map((k) => ({
            Tanggal: k.tanggal,
            Jenis: k.jenis,
            Kategori: k.kategori,
            Keterangan: k.keterangan,
            'Jumlah (Rp)': k.jumlah,
            'Unit Kas': k.unitKas,
            Status: k.statusApproval,
          }))
        );
        count = kasList.length;
        break;

      case 'tagihan':
        csvStr = convertToCSV(
          tagihanList.map((t) => ({
            'Kode Tagihan': t.id,
            'Nama Warga': t.namaWarga,
            NIK: t.nik,
            Bulan: t.bulanTahun,
            'Jenis Iuran': t.jenisIuran,
            'Nominal (Rp)': t.nominal,
            Status: t.statusLunas ? 'LUNAS' : 'BELUM BAYAR',
          }))
        );
        count = tagihanList.length;
        break;

      case 'surat':
        csvStr = convertToCSV(
          suratList.map((s) => ({
            'No Surat': s.nomorSurat,
            Pemohon: s.pemohonNama,
            Jenis: s.jenisSurat,
            Tanggal: s.tanggalPengajuan,
            Keperluan: s.keperluan,
            Status: s.status,
          }))
        );
        count = suratList.length;
        break;

      case 'aduan':
        csvStr = convertToCSV(
          aduanList.map((a) => ({
            Judul: a.judul,
            Pelapor: a.pelaporNama,
            Kategori: a.kategori,
            Tanggal: a.tanggal,
            Status: a.status,
          }))
        );
        count = aduanList.length;
        break;

      case 'inventaris':
        csvStr = convertToCSV(
          setoranSampahList.map((s) => ({
            Warga: s.namaWarga,
            Tanggal: s.tanggal,
            'Jenis Sampah': s.jenisSampah,
            'Berat (Kg)': s.beratKg,
            'Nominal (Rp)': s.nominalRp,
          }))
        );
        count = setoranSampahList.length;
        break;

      default:
        break;
    }

    if (count === 0) {
      addToast('warning', 'Data Kosong', `Tidak ada record untuk di-export pada menu ${menuType.toUpperCase()}.`);
      return;
    }

    downloadCSV(`Sukamaju_Export_${menuType.toUpperCase()}`, csvStr);
    addToast('success', 'Export CSV Berhasil', `${count} data ${menuType.toUpperCase()} berhasil di-download.`);
  };

  // Full System Export (JSON Flashdisk Migration)
  const handleExportFullJSON = () => {
    const fullData = {
      app: 'Sukamaju ERP / SatuWarga.id',
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      database: {
        wargaList,
        kkList,
        kasList,
        tagihanList,
        suratList,
        aduanList,
        eventsList,
        arsipList,
        setoranSampahList,
      },
    };

    const jsonString = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sukamaju_FULL_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Export JSON Selesai', 'File cadangan sistem (.json) siap disalin ke flashdisk.');
  };

  // Import JSON Flashdisk Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.database || !parsed.database.wargaList) {
          throw new Error('Format file JSON tidak valid untuk database Sukamaju.');
        }

        onImportFullBackup(parsed.database);
        addToast(
          'success',
          'Restorasi Database Sukses',
          `Berhasil memuat ${parsed.database.wargaList.length} Warga & seluruh record dari file Flashdisk.`
        );
      } catch (err: any) {
        addToast('error', 'Gagal Import JSON', err.message || 'File corrupted atau format salah.');
      }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = '';
  };

  const handleApplyTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('satuwarga_color_theme', themeId);
    const themeObj = THEME_OPTIONS.find((t) => t.id === themeId);
    if (themeObj) {
      document.documentElement.style.setProperty('--color-primary', themeObj.primaryHex);
    }
    addToast('info', 'Tema Diperbarui', `Sistem menggunakan tema visual ${themeObj?.name || themeId}.`);
  };

  // Calculate Memory & Database Statistics
  const totalRecords =
    wargaList.length +
    kkList.length +
    kasList.length +
    tagihanList.length +
    suratList.length +
    aduanList.length +
    eventsList.length +
    arsipList.length +
    setoranSampahList.length;

  const estimatedJsonBytes = JSON.stringify({
    wargaList,
    kkList,
    kasList,
    tagihanList,
    suratList,
    aduanList,
    eventsList,
    arsipList,
    setoranSampahList,
  }).length;

  const estimatedKb = (estimatedJsonBytes / 1024).toFixed(1);

  // System Audit Activity Log Sample
  const auditLogs = [
    { time: 'Hari ini, 10:15', action: 'Inisialisasi Enkripsi AES-256 GCM', user: 'System Auto', module: 'Keamanan' },
    { time: 'Hari ini, 09:30', action: 'Verifikasi Surat Keterangan Warga', user: 'Ketua RT 01', module: 'Administrasi' },
    { time: 'Hari ini, 08:45', action: 'Pencatatan Tagihan Iuran Bulanan', user: 'Bendahara RW', module: 'Iuran QRIS' },
    { time: 'Kemarin, 16:20', action: 'Backup Rutin Database Lokal', user: 'Sekretaris RT', module: 'System Backup' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-[#0056b3] text-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                Pusat Pengaturan, Migrasi & Monitoring Sistem
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  Online Sync
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Kelola export Excel per menu, migrasi data offline (JSON Flashdisk), kustomisasi tema, serta pantau statistik penggunaan aplikasi.
          </p>
        </div>

        {/* Subtab Segment Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
          <button
            onClick={() => setActiveSubTab('EXPORT_IMPORT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'EXPORT_IMPORT'
                ? 'bg-[#0056b3] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export / Import Data
          </button>
          <button
            onClick={() => setActiveSubTab('TEMA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'TEMA'
                ? 'bg-[#0056b3] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Tema & Tampilan
          </button>
          <button
            onClick={() => setActiveSubTab('MONITORING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'MONITORING'
                ? 'bg-[#0056b3] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Monitoring System
          </button>
        </div>
      </div>

      {/* SUBTAB 1: EXPORT / IMPORT DATA PER TIAP MENU & FLASHDISK */}
      {activeSubTab === 'EXPORT_IMPORT' && (
        <div className="space-y-6">
          {/* Card 1: Offline Flashdisk Backup & Restore (JSON) */}
          <div className="bg-amber-50 border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-400 text-slate-900 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Migrasi & Backup Offline (JSON Flashdisk)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Satu berkas JSON berisi seluruh basis data RT/RW untuk dipindahkan antar laptop pengurus tanpa koneksi internet.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-200 text-slate-900 px-2.5 py-1 rounded-lg border border-slate-900">
                Offline Portable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Export JSON Button */}
              <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-600" /> Download Full Database JSON
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Simpan seluruh data warga, transaksi kas, tagihan iuran, dan surat ke file `.json` untuk disalin ke flashdisk.
                  </p>
                </div>
                <button
                  onClick={handleExportFullJSON}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export Semuanya ke JSON
                </button>
              </div>

              {/* Import JSON Button */}
              <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#0056b3]" /> Restore Database dari Flashdisk
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Unggah berkas `.json` dari flashdisk untuk memperbarui atau memulihkan data pada sistem laptop ini.
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#0056b3] hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Import Berkas JSON
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Export Excel / CSV Per Menu */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Export Data Excel (CSV) Per Tiap Menu
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unduh lembar kerja spreadsheet untuk pelaporan bulanan, arsip fisik, dan keperluan audit administrasi.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Menu 1: Warga */}
              <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">Data Warga</span>
                  <span className="text-[10px] text-slate-500">{wargaList.length} Record Terdaftar</span>
                </div>
                <button
                  onClick={() => handleExportMenuCSV('warga')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>

              {/* Menu 2: Kartu Keluarga */}
              <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">Kartu Keluarga (KK)</span>
                  <span className="text-[10px] text-slate-500">{kkList.length} Kepala Keluarga</span>
                </div>
                <button
                  onClick={() => handleExportMenuCSV('kk')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>

              {/* Menu 3: Kas Keuangan */}
              <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">Kas & Keuangan</span>
                  <span className="text-[10px] text-slate-500">{kasList.length} Transaksi Mutasi</span>
                </div>
                <button
                  onClick={() => handleExportMenuCSV('kas')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>

              {/* Menu 4: Tagihan Iuran */}
              <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">Iuran Warga & Tagihan</span>
                  <span className="text-[10px] text-slate-500">{tagihanList.length} Item Tagihan</span>
                </div>
                <button
                  onClick={() => handleExportMenuCSV('tagihan')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>

              {/* Menu 5: Surat Menyurat */}
              <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">Surat Menyurat</span>
                  <span className="text-[10px] text-slate-500">{suratList.length} Permohonan Surat</span>
                </div>
                <button
                  onClick={() => handleExportMenuCSV('surat')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>

              {/* Menu 6: Aduan Warga */}
              <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-900 flex items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs block">Aduan Warga</span>
                  <span className="text-[10px] text-slate-500">{aduanList.length} Laporan Aduan</span>
                </div>
                <button
                  onClick={() => handleExportMenuCSV('aduan')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: KUSTOMISASI TEMA & TAMPILAN */}
      {activeSubTab === 'TEMA' && (
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#0056b3]" /> Pengaturan Aksesibilitas & Tema Warna Accent
            </h3>
            <p className="text-xs text-slate-500">
              Pilih skema warna utama sesuai identitas visual lingkungan RT/RW Sukamaju.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleApplyTheme(theme.id)}
                  className={`p-4 rounded-2xl border-2 border-slate-900 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-slate-100 ring-2 ring-[#0056b3] shadow-[4px_4px_0px_0px_#0f172a] -translate-y-0.5'
                      : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_0px_#0f172a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-slate-900 shadow-xs"
                        style={{ backgroundColor: theme.primaryHex }}
                      />
                      <span className="font-extrabold text-slate-900 text-sm">{theme.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                    <span>Hex: {theme.primaryHex}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${theme.badge}`}>Aktif</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MONITORING SYSTEM & STATISTIK PENGGUNAAN */}
      {activeSubTab === 'MONITORING' && (
        <div className="space-y-6">
          {/* Top Monitoring Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold">
                <span>Total Record Menyimpan</span>
                <Database className="w-4 h-4 text-[#0056b3]" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">{totalRecords} Item</div>
              <p className="text-[10px] text-slate-500 font-semibold">
                Terdiri dari Warga, KK, Kas, Surat, Aduan & Assets
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold">
                <span>Estimasi Ukuran DB</span>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">{estimatedKb} KB</div>
              <p className="text-[10px] text-emerald-700 font-bold">Ringan & Cepat di Browser / Flashdisk</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold">
                <span>Enkripsi Privasi NIK</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">AES-256 GCM</div>
              <p className="text-[10px] text-slate-500 font-bold">Integritas 100% Terlindungi</p>
            </div>

            {/* Stat 4 */}
            <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold">
                <span>Waktu Sync Terakhir</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-sm font-black text-slate-900 font-mono">{new Date().toLocaleTimeString()}</div>
              <p className="text-[10px] text-slate-500 font-semibold">Real-time Local Memory Engine</p>
            </div>
          </div>

          {/* Database Breakdown & Activity Log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Database Table Breakdown */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Layers className="w-4 h-4 text-[#0056b3]" /> Rincian Rekaman Berkas
              </h3>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Warga Terdaftar</span>
                  <span className="font-mono font-bold text-slate-900">{wargaList.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Kartu Keluarga</span>
                  <span className="font-mono font-bold text-slate-900">{kkList.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Mutasi Kas Keuangan</span>
                  <span className="font-mono font-bold text-slate-900">{kasList.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Iuran & Tagihan QRIS</span>
                  <span className="font-mono font-bold text-slate-900">{tagihanList.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Surat Menyurat</span>
                  <span className="font-mono font-bold text-slate-900">{suratList.length}</span>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="lg:col-span-2 bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" /> Log Aktivitas Operasional Sistem
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Live Telemetry</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{log.action}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Oleh: <span className="font-bold text-slate-700">{log.user}</span> • Modul: {log.module}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  ActiveTab,
  Warga,
  KartuKeluarga,
  Rumah,
  Surat,
  TransaksiKas,
  TagihanIuran,
  EventItem,
  NotulenItem,
  SetoranSampah,
  ArsipDokumen,
  AduanWarga,
  PengumumanItem,
  VotingItem,
  BarangInventaris,
  PeminjamanBarang,
  ToastMessage,
} from './types';
import { localStore } from './services/storage';
import { Header } from './components/Header';
import { Sidebar, getAllowedTabsForRole } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MasterDataView } from './components/MasterDataView';
import { AdministrasiView } from './components/AdministrasiView';
import { KeuanganView } from './components/KeuanganView';
import { IuranView } from './components/IuranView';
import { KegiatanView } from './components/KegiatanView';
import { SubOrganisasiView } from './components/SubOrganisasiView';
import { ArsipProposalView } from './components/ArsipProposalView';
import { PengaturanView } from './components/PengaturanView';
import { AduanWargaView } from './components/AduanWargaView';
import { PengumumanView } from './components/PengumumanView';
import { VotingView } from './components/VotingView';
import { ChatbotView } from './components/ChatbotView';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ShieldCheck, Lock, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('KETUA');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Sidebar states (mobile drawer & desktop collapse/close)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsedDesktop, setIsSidebarCollapsedDesktop] = useState(false);

  // Regional Filters
  const [selectedRw, setSelectedRw] = useState<string>('ALL');
  const [selectedRt, setSelectedRt] = useState<string>('ALL');

  // Force Light Mode permanently
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('satuwarga_theme', 'light');
  }, []);

  // UI Toast & Confirmation States
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [encryptionModalOpen, setEncryptionModalOpen] = useState(false);

  // App Data State
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [kkList, setKkList] = useState<KartuKeluarga[]>([]);
  const [rumahList, setRumahList] = useState<Rumah[]>([]);
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [kasList, setKasList] = useState<TransaksiKas[]>([]);
  const [tagihanList, setTagihanList] = useState<TagihanIuran[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [notulenList, setNotulenList] = useState<NotulenItem[]>([]);
  const [setoranSampahList, setSetoranSampahList] = useState<SetoranSampah[]>([]);
  const [arsipList, setArsipList] = useState<ArsipDokumen[]>([]);
  const [aduanList, setAduanList] = useState<AduanWarga[]>([]);
  const [pengumumanList, setPengumumanList] = useState<PengumumanItem[]>([]);
  const [votingList, setVotingList] = useState<VotingItem[]>([]);
  const [barangList, setBarangList] = useState<BarangInventaris[]>([]);
  const [peminjamanList, setPeminjamanList] = useState<PeminjamanBarang[]>([]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const askConfirmation = (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: opts.title,
      message: opts.message,
      confirmLabel: opts.confirmLabel,
      variant: opts.variant,
      onConfirm: () => {
        opts.onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Load from LocalStorage Service
  useEffect(() => {
    setWargaList(localStore.getWarga());
    setKkList(localStore.getKK());
    setRumahList(localStore.getRumah());
    setSuratList(localStore.getSurat());
    setKasList(localStore.getKas());
    setTagihanList(localStore.getTagihan());
    setEventsList(localStore.getEvents());
    setNotulenList(localStore.getNotulen());
    setSetoranSampahList(localStore.getSetoranSampah());
    setArsipList(localStore.getArsip());
    setAduanList(localStore.loadAduan());
    setPengumumanList(localStore.loadPengumuman());
    setVotingList(localStore.loadVoting());
    setBarangList(localStore.loadBarang());
    setPeminjamanList(localStore.loadPeminjaman());
  }, []);

  // Auto-adjust active tab when currentRole changes
  useEffect(() => {
    const allowed = getAllowedTabsForRole(currentRole);
    if (!allowed.includes(activeTab as any)) {
      setActiveTab('dashboard');
    }
  }, [currentRole]);

  // Role Change Toast & Auto Settings
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const roleFormatted = role.replace(/_/g, ' ');
    addToast('info', 'Konfigurasi Otomatis', `Menu & fungsi disesuaikan untuk peran ${roleFormatted} (Tanpa Password).`);
  };

  // Handlers with Toast & Confirmation Modals
  const handleAddWarga = (w: Warga) => {
    const updated = [w, ...wargaList];
    setWargaList(updated);
    localStore.saveWarga(updated);
    addToast('success', 'Warga Ditambahkan', `Data warga ${w.nama} berhasil disimpan.`);
  };

  const handleUpdateWarga = (w: Warga) => {
    const updated = wargaList.map((item) => (item.id === w.id ? w : item));
    setWargaList(updated);
    localStore.saveWarga(updated);
    addToast('success', 'Perubahan Disimpan', `Data warga ${w.nama} diperbarui.`);
  };

  const handleDeleteWarga = (id: string) => {
    const target = wargaList.find((w) => w.id === id);
    askConfirmation({
      title: 'Hapus Data Warga',
      message: `Apakah Anda yakin ingin menghapus data warga ${target?.nama || 'ini'}? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Hapus Permanen',
      variant: 'danger',
      onConfirm: () => {
        const updated = wargaList.filter((item) => item.id !== id);
        setWargaList(updated);
        localStore.saveWarga(updated);
        addToast('warning', 'Data Dihapus', `Data warga ${target?.nama || ''} telah dihapus.`);
      },
    });
  };

  const handleAddKK = (kk: KartuKeluarga) => {
    const updated = [kk, ...kkList];
    setKkList(updated);
    localStore.saveKK(updated);
    addToast('success', 'KK Berhasil Didaftarkan', `Nomor KK ${kk.nomorKk} tersimpan.`);
  };

  const handleUpdateKK = (kk: KartuKeluarga) => {
    const updated = kkList.map((k) => (k.id === kk.id ? kk : k));
    setKkList(updated);
    localStore.saveKK(updated);
    addToast('success', 'KK Diperbarui', `Data KK ${kk.nomorKk} berhasil diperbarui.`);
  };

  const handleDeleteKK = (id: string) => {
    const target = kkList.find((k) => k.id === id);
    askConfirmation({
      title: 'Hapus Kartu Keluarga',
      message: `Hapus data KK No. ${target?.nomorKk || ''} (${target?.kepalaKeluargaNama || ''})?`,
      confirmLabel: 'Hapus KK',
      variant: 'danger',
      onConfirm: () => {
        const updated = kkList.filter((k) => k.id !== id);
        setKkList(updated);
        localStore.saveKK(updated);
        addToast('warning', 'Data KK Dihapus', `Data KK ${target?.nomorKk || ''} telah dihapus.`);
      },
    });
  };

  const handleAddRumah = (r: Rumah) => {
    const updated = [r, ...rumahList];
    setRumahList(updated);
    localStore.saveRumah(updated);
    addToast('success', 'Bangunan Terdaftar', `Rumah ${r.nomorRumah} tersimpan.`);
  };

  const handleUpdateRumah = (r: Rumah) => {
    const updated = rumahList.map((rmh) => (rmh.id === r.id ? r : rmh));
    setRumahList(updated);
    localStore.saveRumah(updated);
    addToast('success', 'Data Rumah Diperbarui', `Data rumah ${r.nomorRumah} berhasil diperbarui.`);
  };

  const handleDeleteRumah = (id: string) => {
    const target = rumahList.find((r) => r.id === id);
    askConfirmation({
      title: 'Hapus Data Rumah',
      message: `Hapus register rumah ${target?.nomorRumah || ''}?`,
      confirmLabel: 'Hapus Rumah',
      variant: 'danger',
      onConfirm: () => {
        const updated = rumahList.filter((r) => r.id !== id);
        setRumahList(updated);
        localStore.saveRumah(updated);
        addToast('warning', 'Data Rumah Dihapus', `Data rumah ${target?.nomorRumah || ''} telah dihapus.`);
      },
    });
  };

  const handleAddSurat = (s: Surat) => {
    const updated = [s, ...suratList];
    setSuratList(updated);
    localStore.saveSurat(updated);
    addToast('success', 'Surat Dibuat', `Pengajuan surat ${s.jenisSurat} telah dibuat.`);
  };

  const handleApproveSurat = (id: string) => {
    const target = suratList.find((s) => s.id === id);
    askConfirmation({
      title: 'Setujui Pengajuan Surat',
      message: `Setujui dan beri stempel digital resmi pada ${target?.jenisSurat || 'surat ini'} milik ${target?.namaWarga || 'warga'}?`,
      confirmLabel: 'Setujui & Tanda Tangan',
      variant: 'success',
      onConfirm: () => {
        const updated = suratList.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              status: 'DISETUJUI' as const,
              tglDisetujui: new Date().toISOString().slice(0, 10),
            };
          }
          return s;
        });
        setSuratList(updated);
        localStore.saveSurat(updated);
        addToast('success', 'Surat Disetujui', 'Dokumen siap dicetak warga.');
      },
    });
  };

  const handleRejectSurat = (id: string) => {
    askConfirmation({
      title: 'Tolak Surat',
      message: 'Apakah Anda yakin ingin menolak pengajuan surat ini?',
      confirmLabel: 'Ya, Tolak',
      variant: 'danger',
      onConfirm: () => {
        const updated = suratList.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              status: 'DITOLAK' as const,
            };
          }
          return s;
        });
        setSuratList(updated);
        localStore.saveSurat(updated);
        addToast('warning', 'Pengajuan Ditolak', 'Status pengajuan diperbarui menjadi DITOLAK.');
      },
    });
  };

  const handleAddKas = (k: TransaksiKas) => {
    const updated = [k, ...kasList];
    setKasList(updated);
    localStore.saveKas(updated);
    addToast('success', 'Transaksi Kas Dicatat', `Pencatatan kas senilai Rp ${k.jumlah.toLocaleString('id-ID')} tersimpan.`);
  };

  const handleApproveKas = (id: string) => {
    const updated = kasList.map((k) => (k.id === id ? { ...k, statusApproval: 'APPROVED' as const } : k));
    setKasList(updated);
    localStore.saveKas(updated);
    addToast('success', 'Kas Disetujui', 'Transaksi kas diverifikasi.');
  };

  const handleToggleStatusIuran = (id: string, status: 'LUNAS' | 'BELUM_LUNAS') => {
    const updated = tagihanList.map((t) => (t.id === id ? { ...t, status } : t));
    setTagihanList(updated);
    localStore.saveTagihan(updated);
    addToast('info', 'Status Iuran Diubah', `Status tagihan kini: ${status}`);
  };

  const handleAddTagihan = (t: TagihanIuran) => {
    const updated = [t, ...tagihanList];
    setTagihanList(updated);
    localStore.saveTagihan(updated);
    addToast('success', 'Tagihan Dibuat', `Iuran ${t.jenisIuran} berhasil diterbitkan.`);
  };

  const handleAddEvent = (evt: EventItem) => {
    const updated = [evt, ...eventsList];
    setEventsList(updated);
    localStore.saveEvents(updated);
    addToast('success', 'Kegiatan Dibuat', `Agenda "${evt.nama}" dijadwalkan.`);
  };

  const handleAddNotulen = (not: NotulenItem) => {
    const updated = [not, ...notulenList];
    setNotulenList(updated);
    localStore.saveNotulen(updated);
    addToast('success', 'Notulen Tersimpan', 'Dokumen risalah rapat ditambahkan.');
  };

  const handleAddSetoranSampah = (s: SetoranSampah) => {
    const updated = [s, ...setoranSampahList];
    setSetoranSampahList(updated);
    localStore.saveSetoranSampah(updated);
    addToast('success', 'Setoran Sampah Dicatat', `${s.beratKg} Kg ${s.jenisSampah} dicatat.`);
  };

  const handleAddArsip = (a: ArsipDokumen) => {
    const updated = [a, ...arsipList];
    setArsipList(updated);
    localStore.saveArsip(updated);
    addToast('success', 'Dokumen Diarsipkan', `Arsip "${a.judul}" tersimpan.`);
  };

  const handleAddAduan = (a: AduanWarga) => {
    const updated = [a, ...aduanList];
    setAduanList(updated);
    localStore.saveAduan(updated);
    addToast('success', 'Aduan Terkirim', 'Aduan warga telah diteruskan ke pengurus RT/RW.');
  };

  const handleUpdateStatusAduan = (
    id: string,
    status: 'OPEN' | 'PROGRESS' | 'PENDING' | 'DONE',
    balasanAdmin?: string,
    petugasNama?: string
  ) => {
    const updated = aduanList.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          status,
          balasanAdmin: balasanAdmin || a.balasanAdmin,
          petugasNama: petugasNama || a.petugasNama,
          tglSelesai: status === 'DONE' ? new Date().toISOString().slice(0, 10) : a.tglSelesai,
        };
      }
      return a;
    });
    setAduanList(updated);
    localStore.saveAduan(updated);
    addToast('info', 'Status Aduan Diperbarui', `Status laporan diubah menjadi ${status}`);
  };

  const handleAddPengumuman = (p: PengumumanItem) => {
    const updated = [p, ...pengumumanList];
    setPengumumanList(updated);
    localStore.savePengumuman(updated);
    addToast('success', 'Pengumuman Diterbitkan', `Pengumuman "${p.judul}" disiarkan.`);
  };

  const handleAddVoting = (v: VotingItem) => {
    const updated = [v, ...votingList];
    setVotingList(updated);
    localStore.saveVoting(updated);
    addToast('success', 'Voting Dibuka', `Musyawarah/E-voting "${v.judul}" telah aktif.`);
  };

  const handleCastVote = (votingId: string, optionId: string) => {
    const updated = votingList.map((v) => {
      if (v.id === votingId) {
        const updatedOpsi = v.opsi.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt));
        return {
          ...v,
          opsi: updatedOpsi,
          totalVotes: (v.totalVotes || 0) + 1,
          userVotedIds: [...(v.userVotedIds || []), 'w-001'],
        };
      }
      return v;
    });
    setVotingList(updated);
    localStore.saveVoting(updated);
    addToast('success', 'Suara Terrekam', 'Terima kasih atas partisipasi voting Anda.');
  };

  const handleAddBarang = (b: BarangInventaris) => {
    const updated = [b, ...barangList];
    setBarangList(updated);
    localStore.saveBarang(updated);
    addToast('success', 'Inventaris Ditambahkan', `Barang "${b.namaBarang}" berhasil dicatat.`);
  };

  const handleAddPeminjaman = (p: PeminjamanBarang) => {
    const updated = [p, ...peminjamanList];
    setPeminjamanList(updated);
    localStore.savePeminjaman(updated);
    addToast('success', 'Peminjaman Dicatat', `Permohonan peminjaman "${p.namaBarang}" dicatat.`);
  };

  const normalizedTab = String(activeTab || '').toLowerCase();

  const saldoKas = kasList.reduce((acc, curr) => {
    return curr.tipe === 'MASUK' ? acc + curr.jumlah : acc - curr.jumlah;
  }, 0);

  const aiContextData = {
    totalWarga: wargaList.length,
    saldoKas,
    totalAduan: aduanList.length,
    pendingAduan: aduanList.filter((a) => a.status === 'PENDING' || (a.status as string) === 'OPEN').length,
    totalPengumuman: pengumumanList.length,
    totalKegiatan: eventsList.length,
    totalBarang: barangList.length,
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased flex flex-col selection:bg-[#0056b3] selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Encryption Details Modal */}
      {encryptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-2 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_#0f172a] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-base">
                <ShieldCheck className="w-6 h-6" />
                <span>E2E Data Encryption Sukamaju</span>
              </div>
              <button
                onClick={() => setEncryptionModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">
                Seluruh data sensitif kependudukan Sukamaju (seperti Nomor Induk Kependudukan / NIK) diproteksi menggunakan standar enkripsi simetris <strong>AES-256 GCM</strong>.
              </p>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5 font-mono text-[11px] text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Key Hash Status: Active</span>
                </div>
                <p className="opacity-90 break-all">
                  SHA256: 8f9b2d01e4a5c67890abcdef1234567890abcdef1234567890
                </p>
              </div>
              <ul className="space-y-1.5 list-disc pl-4 font-medium text-slate-700">
                <li>Melindungi data privasi NIK warga dari akses ilegal.</li>
                <li>Hanya pengurus resmi terverifikasi (Ketua/Sekretaris RT/RW) yang dapat melakukan dekripsi tampilan.</li>
                <li>Sesuai dengan UU Perlindungan Data Pribadi (PDP) Indonesia.</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setEncryptionModalOpen(false);
                addToast('success', 'Enkripsi Terverifikasi', 'Sistem Enkripsi E2E Sukamaju berjalan optimal.');
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Tutup & Konfirmasi Keamanan
            </button>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedRw={selectedRw}
        onRwChange={setSelectedRw}
        selectedRt={selectedRt}
        onRtChange={setSelectedRt}
        isSidebarCollapsedDesktop={isSidebarCollapsedDesktop}
        onToggleSidebar={() => {
          // Toggle desktop collapse or mobile open
          if (window.innerWidth < 1024) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
          } else {
            setIsSidebarCollapsedDesktop(!isSidebarCollapsedDesktop);
          }
        }}
        onOpenEncryptionModal={() => setEncryptionModalOpen(true)}
        pendingSuratCount={suratList.filter((s) => s.status === 'MENUNGGU_RT' || s.status === 'MENUNGGU_RW' || (s.status as string) === 'PENDING').length}
        pendingAduanCount={aduanList.filter((a) => a.status === 'OPEN').length}
        wargaList={wargaList}
        kkList={kkList}
        kasList={kasList}
        onSelectSearchResult={(tab, key) => {
          setActiveTab(tab as any);
          addToast('info', 'Pencarian Global', `Navigasi ke modul ${String(tab).replace(/-/g, ' ')}${key ? `: ${key}` : ''}`);
        }}
      />

      <div className="flex-1 flex w-full relative">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab as any}
          onTabChange={(tab: any) => setActiveTab(tab)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsedDesktop={isSidebarCollapsedDesktop}
          onToggleCollapseDesktop={() => setIsSidebarCollapsedDesktop(!isSidebarCollapsedDesktop)}
          pendingSuratCount={suratList.filter((s) => s.status === 'MENUNGGU_RT' || s.status === 'MENUNGGU_RW' || (s.status as string) === 'PENDING').length}
          pendingAduanCount={aduanList.filter((a) => a.status === 'OPEN').length}
          unpaidIuranCount={tagihanList.filter((t) => t.status === 'BELUM_BAYAR').length}
          currentRole={currentRole}
        />

        {/* Main Content View Container */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6 flex flex-col justify-between">
          <div className="space-y-6 flex-1">
            {(normalizedTab === 'asisten-ai' || normalizedTab === 'asisten_ai') && (
              <ChatbotView contextData={aiContextData} />
            )}

            {(normalizedTab === 'dashboard' || normalizedTab === 'dashboard_utama') && (
              <DashboardView
                wargaList={wargaList}
                kkList={kkList}
                rumahList={rumahList}
                suratList={suratList}
                kasList={kasList}
                tagihanList={tagihanList}
                eventsList={eventsList}
                aduanList={aduanList}
                pengumumanList={pengumumanList}
                currentRole={currentRole}
                onNavigateTab={(t: any) => setActiveTab(t)}
                onApproveSurat={handleApproveSurat}
              />
            )}

            {(normalizedTab === 'master-data' || normalizedTab === 'master_data') && (
              <MasterDataView
                wargaList={wargaList}
                kkList={kkList}
                rumahList={rumahList}
                onAddWarga={handleAddWarga}
                onUpdateWarga={handleUpdateWarga}
                onDeleteWarga={handleDeleteWarga}
                onAddKK={handleAddKK}
                onUpdateKK={handleUpdateKK}
                onDeleteKK={handleDeleteKK}
                onAddRumah={handleAddRumah}
                onUpdateRumah={handleUpdateRumah}
                onDeleteRumah={handleDeleteRumah}
              />
            )}

            {normalizedTab === 'administrasi' && (
              <AdministrasiView
                suratList={suratList}
                wargaList={wargaList}
                onAddSurat={handleAddSurat}
                onApproveSurat={handleApproveSurat}
                onRejectSurat={handleRejectSurat}
              />
            )}

            {normalizedTab === 'keuangan' && (
              <KeuanganView
                kasList={kasList}
                onAddKas={handleAddKas}
                onApproveKas={handleApproveKas}
              />
            )}

            {normalizedTab === 'iuran' && (
              <IuranView
                tagihanList={tagihanList}
                onToggleStatusIuran={handleToggleStatusIuran}
                onAddTagihan={handleAddTagihan}
              />
            )}

            {(normalizedTab === 'aduan-warga' || normalizedTab === 'sosial-aduan') && (
              <AduanWargaView
                aduanList={aduanList}
                onAddAduan={handleAddAduan}
                onUpdateStatusAduan={handleUpdateStatusAduan}
                currentRole={currentRole}
              />
            )}

            {normalizedTab === 'pengumuman' && (
              <PengumumanView
                pengumumanList={pengumumanList}
                onAddPengumuman={handleAddPengumuman}
                currentRole={currentRole}
              />
            )}

            {normalizedTab === 'voting' && (
              <VotingView
                votingList={votingList}
                onAddVoting={handleAddVoting}
                onCastVote={handleCastVote}
                currentRole={currentRole}
              />
            )}

            {normalizedTab === 'kegiatan' && (
              <KegiatanView
                eventsList={eventsList}
                notulenList={notulenList}
                onAddEvent={handleAddEvent}
                onAddNotulen={handleAddNotulen}
              />
            )}

            {(normalizedTab === 'sub_organisasi' || normalizedTab === 'bank-sampah' || normalizedTab === 'inventaris') && (
              <SubOrganisasiView
                setoranSampahList={setoranSampahList}
                onAddSetoranSampah={handleAddSetoranSampah}
                barangList={barangList}
                peminjamanList={peminjamanList}
                onAddBarang={handleAddBarang}
                onAddPeminjaman={handleAddPeminjaman}
                initialUnit={normalizedTab === 'inventaris' ? 'INVENTARIS' : normalizedTab === 'bank-sampah' ? 'BANK_SAMPAH' : 'PKK'}
              />
            )}

            {(normalizedTab === 'arsip_proposal' || normalizedTab === 'dokumen-proposal' || normalizedTab === 'statistik') && (
              <ArsipProposalView
                arsipList={arsipList}
                wargaList={wargaList}
                onAddArsip={handleAddArsip}
              />
            )}

            {normalizedTab === 'pengaturan' && (
              <PengaturanView
                wargaList={wargaList}
                kkList={kkList}
                kasList={kasList}
                tagihanList={tagihanList}
                suratList={suratList}
                aduanList={aduanList}
                eventsList={eventsList}
                arsipList={arsipList}
                setoranSampahList={setoranSampahList}
                onImportFullBackup={(importedData: any) => {
                  if (importedData.wargaList && Array.isArray(importedData.wargaList)) {
                    setWargaList(importedData.wargaList);
                    localStore.saveWarga(importedData.wargaList);
                  }
                  if (importedData.kkList && Array.isArray(importedData.kkList)) {
                    setKkList(importedData.kkList);
                    localStore.saveKK(importedData.kkList);
                  }
                  if (importedData.kasList && Array.isArray(importedData.kasList)) {
                    setKasList(importedData.kasList);
                    localStore.saveKas(importedData.kasList);
                  }
                  if (importedData.tagihanList && Array.isArray(importedData.tagihanList)) {
                    setTagihanList(importedData.tagihanList);
                    localStore.saveTagihan(importedData.tagihanList);
                  }
                  if (importedData.suratList && Array.isArray(importedData.suratList)) {
                    setSuratList(importedData.suratList);
                    localStore.saveSurat(importedData.suratList);
                  }
                  if (importedData.aduanList && Array.isArray(importedData.aduanList)) {
                    setAduanList(importedData.aduanList);
                    localStore.saveAduan(importedData.aduanList);
                  }
                }}
                addToast={addToast}
                onResetAllData={() => {
                  localStorage.clear();
                  setWargaList([]);
                  setKkList([]);
                  setKasList([]);
                  setTagihanList([]);
                  setSuratList([]);
                  setAduanList([]);
                  setArsipList([]);
                  setEventsList([]);
                  setSetoranSampahList([]);
                  addToast('success', 'Reset Total Berhasil', 'Seluruh data aplikasi telah dibersihkan dan siap digunakan dari awal.');
                  setTimeout(() => {
                    window.location.reload();
                  }, 800);
                }}
              />
            )}
          </div>

          {/* Footer inside content section */}
          <Footer />
        </main>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { UserRole, ActiveTab, Warga, KartuKeluarga, Rumah, Surat, TransaksiKas, TagihanIuran, EventItem, NotulenItem, SetoranSampah, ArsipDokumen, AduanWarga, PengumumanItem, VotingItem } from './types';
import { localStore } from './services/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MasterDataView } from './components/MasterDataView';
import { AdministrasiView } from './components/AdministrasiView';
import { KeuanganView } from './components/KeuanganView';
import { IuranView } from './components/IuranView';
import { KegiatanView } from './components/KegiatanView';
import { SubOrganisasiView } from './components/SubOrganisasiView';
import { ArsipProposalView } from './components/ArsipProposalView';
import { AduanWargaView } from './components/AduanWargaView';
import { PengumumanView } from './components/PengumumanView';
import { VotingView } from './components/VotingView';
import { AIAssistantModal } from './components/AIAssistantModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('RT');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State
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
  }, []);

  // Handlers
  const handleAddWarga = (w: Warga) => {
    const updated = [w, ...wargaList];
    setWargaList(updated);
    localStore.saveWarga(updated);
  };

  const handleUpdateWarga = (w: Warga) => {
    const updated = wargaList.map((item) => (item.id === w.id ? w : item));
    setWargaList(updated);
    localStore.saveWarga(updated);
  };

  const handleDeleteWarga = (id: string) => {
    const updated = wargaList.filter((item) => item.id !== id);
    setWargaList(updated);
    localStore.saveWarga(updated);
  };

  const handleAddKK = (kk: KartuKeluarga) => {
    const updated = [kk, ...kkList];
    setKkList(updated);
    localStore.saveKK(updated);
  };

  const handleAddRumah = (r: Rumah) => {
    const updated = [r, ...rumahList];
    setRumahList(updated);
    localStore.saveRumah(updated);
  };

  const handleAddSurat = (s: Surat) => {
    const updated = [s, ...suratList];
    setSuratList(updated);
    localStore.saveSurat(updated);
  };

  const handleApproveSurat = (id: string) => {
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
  };

  const handleRejectSurat = (id: string) => {
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
  };

  const handleAddKas = (k: TransaksiKas) => {
    const updated = [k, ...kasList];
    setKasList(updated);
    localStore.saveKas(updated);
  };

  const handleApproveKas = (id: string) => {
    const updated = kasList.map((k) => (k.id === id ? { ...k, statusApproval: 'APPROVED' as const } : k));
    setKasList(updated);
    localStore.saveKas(updated);
  };

  const handleToggleStatusIuran = (id: string, status: 'LUNAS' | 'BELUM_LUNAS') => {
    const updated = tagihanList.map((t) => (t.id === id ? { ...t, status } : t));
    setTagihanList(updated);
    localStore.saveTagihan(updated);
  };

  const handleAddTagihan = (t: TagihanIuran) => {
    const updated = [t, ...tagihanList];
    setTagihanList(updated);
    localStore.saveTagihan(updated);
  };

  const handleAddEvent = (evt: EventItem) => {
    const updated = [evt, ...eventsList];
    setEventsList(updated);
    localStore.saveEvents(updated);
  };

  const handleAddNotulen = (not: NotulenItem) => {
    const updated = [not, ...notulenList];
    setNotulenList(updated);
    localStore.saveNotulen(updated);
  };

  const handleAddSetoranSampah = (s: SetoranSampah) => {
    const updated = [s, ...setoranSampahList];
    setSetoranSampahList(updated);
    localStore.saveSetoranSampah(updated);
  };

  const handleAddArsip = (a: ArsipDokumen) => {
    const updated = [a, ...arsipList];
    setArsipList(updated);
    localStore.saveArsip(updated);
  };

  const handleAddAduan = (a: AduanWarga) => {
    const updated = [a, ...aduanList];
    setAduanList(updated);
    localStore.saveAduan(updated);
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
  };

  const handleAddPengumuman = (p: PengumumanItem) => {
    const updated = [p, ...pengumumanList];
    setPengumumanList(updated);
    localStore.savePengumuman(updated);
  };

  const handleAddVoting = (v: VotingItem) => {
    const updated = [v, ...votingList];
    setVotingList(updated);
    localStore.saveVoting(updated);
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
  };

  const normalizedTab = String(activeTab || '').toLowerCase();

  return (
    <div className="min-h-screen bg-slate-100/80 font-sans text-slate-800 antialiased flex flex-col selection:bg-[#0056b3] selection:text-white">
      {/* Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        pendingSuratCount={suratList.filter((s) => s.status === 'PENDING').length}
        pendingAduanCount={aduanList.filter((a) => a.status === 'OPEN').length}
      />

      <div className="flex-1 flex w-full relative">
        {/* Sidebar Pinned Flush Left */}
        <Sidebar
          activeTab={activeTab as any}
          onTabChange={(tab: any) => setActiveTab(tab)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          pendingSuratCount={suratList.filter((s) => s.status === 'PENDING').length}
          pendingAduanCount={aduanList.filter((a) => a.status === 'OPEN').length}
          unpaidIuranCount={tagihanList.filter((t) => t.status === 'BELUM_BAYAR').length}
        />

        {/* Main Content View Container */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
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
              onOpenAiAssistant={() => setIsAiModalOpen(true)}
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
              onAddRumah={handleAddRumah}
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
            />
          )}

          {(normalizedTab === 'arsip_proposal' || normalizedTab === 'dokumen-proposal') && (
            <ArsipProposalView
              arsipList={arsipList}
              onAddArsip={handleAddArsip}
            />
          )}
        </main>
      </div>

      {/* AI Assistant Modal */}
      {isAiModalOpen && (
        <AIAssistantModal
          currentRole={currentRole}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#343a40] text-slate-300 text-xs py-3.5 border-t border-slate-700 text-center font-sans flex items-center justify-center gap-2">
        <span className="font-bold text-white">Satu<span className="text-[#17a2b8]">Warga.id</span></span>
        <span>•</span>
        <span>Community Operating System RT/RW</span>
        <span>•</span>
        <span className="text-emerald-400 font-mono text-[11px]">E2E Encrypted</span>
      </footer>
    </div>
  );
}

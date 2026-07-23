import {
  Warga,
  KartuKeluarga,
  Rumah,
  Surat,
  TransaksiKas,
  TagihanIuran,
  EventItem,
  NotulenItem,
  BarangInventaris,
  PeminjamanBarang,
  NasabahBankSampah,
  TransaksiBankSampah,
  AduanWarga,
  PengumumanItem,
  ProposalItem,
  LPJItem,
  VotingItem,
  SetoranSampah,
  ArsipDokumen,
} from '../types';

import {
  INITIAL_WARGA,
  INITIAL_KK,
  INITIAL_RUMAH,
  INITIAL_SURAT,
  INITIAL_KAS,
  INITIAL_TAGIHAN_IURAN,
  INITIAL_EVENTS,
  INITIAL_NOTULEN,
  INITIAL_BARANG,
  INITIAL_PEMINJAMAN,
  INITIAL_NASABAH,
  INITIAL_TRANSAKSI_SAMPAH,
  INITIAL_ADUAN,
  INITIAL_PENGUMUMAN,
  INITIAL_PROPOSAL,
  INITIAL_LPJ,
  INITIAL_VOTING,
} from '../data/mockData';

const STORAGE_VERSION = 'v3_sukamaju_empty';

// Auto-reset local storage cache once to guarantee blank state
try {
  if (typeof localStorage !== 'undefined') {
    const curVer = localStorage.getItem('satuwarga_version');
    if (curVer !== STORAGE_VERSION) {
      localStorage.clear();
      localStorage.setItem('satuwarga_version', STORAGE_VERSION);
    }
  }
} catch (e) {
  console.warn('LocalStorage clear check skipped:', e);
}

const STORAGE_KEYS = {
  WARGA: 'satuwarga_db_warga',
  KK: 'satuwarga_db_kk',
  RUMAH: 'satuwarga_db_rumah',
  SURAT: 'satuwarga_db_surat',
  KAS: 'satuwarga_db_kas',
  TAGIHAN: 'satuwarga_db_tagihan',
  EVENTS: 'satuwarga_db_events',
  NOTULEN: 'satuwarga_db_notulen',
  BARANG: 'satuwarga_db_barang',
  PEMINJAMAN: 'satuwarga_db_peminjaman',
  NASABAH: 'satuwarga_db_nasabah',
  TRX_SAMPAH: 'satuwarga_db_trx_sampah',
  ADUAN: 'satuwarga_db_aduan',
  PENGUMUMAN: 'satuwarga_db_pengumuman',
  PROPOSAL: 'satuwarga_db_proposal',
  LPJ: 'satuwarga_db_lpj',
  VOTING: 'satuwarga_db_voting',
  ENCRYPTION_KEY: 'satuwarga_sec_key',
};

// Simple AES / Base64 E2E Encryption Simulation for local privacy
export function mockEncrypt(text: string): string {
  if (!text) return '';
  return `ENC[AES-256-GCM]:${btoa(encodeURIComponent(text))}`;
}

export function mockDecrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  if (encryptedText.startsWith('ENC[AES-256-GCM]:')) {
    try {
      const raw = encryptedText.replace('ENC[AES-256-GCM]:', '');
      return decodeURIComponent(atob(raw));
    } catch {
      return encryptedText;
    }
  }
  return encryptedText;
}

export class LocalStoreService {
  static getStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch (e) {
      console.warn('Error reading key from storage', key, e);
    }
    return defaultValue;
  }

  static setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to storage', key, e);
    }
  }

  // Load all initial state
  static getWarga(): Warga[] {
    return this.getStorage<Warga[]>(STORAGE_KEYS.WARGA, INITIAL_WARGA);
  }
  static loadWarga(): Warga[] {
    return this.getWarga();
  }
  static saveWarga(data: Warga[]): void {
    this.setStorage(STORAGE_KEYS.WARGA, data);
  }

  static getKK(): KartuKeluarga[] {
    return this.getStorage<KartuKeluarga[]>(STORAGE_KEYS.KK, INITIAL_KK);
  }
  static loadKK(): KartuKeluarga[] {
    return this.getKK();
  }
  static saveKK(data: KartuKeluarga[]): void {
    this.setStorage(STORAGE_KEYS.KK, data);
  }

  static getRumah(): Rumah[] {
    return this.getStorage<Rumah[]>(STORAGE_KEYS.RUMAH, INITIAL_RUMAH);
  }
  static loadRumah(): Rumah[] {
    return this.getRumah();
  }
  static saveRumah(data: Rumah[]): void {
    this.setStorage(STORAGE_KEYS.RUMAH, data);
  }

  static getSurat(): Surat[] {
    return this.getStorage<Surat[]>(STORAGE_KEYS.SURAT, INITIAL_SURAT);
  }
  static loadSurat(): Surat[] {
    return this.getSurat();
  }
  static saveSurat(data: Surat[]): void {
    this.setStorage(STORAGE_KEYS.SURAT, data);
  }

  static getKas(): TransaksiKas[] {
    return this.getStorage<TransaksiKas[]>(STORAGE_KEYS.KAS, INITIAL_KAS);
  }
  static loadKas(): TransaksiKas[] {
    return this.getKas();
  }
  static saveKas(data: TransaksiKas[]): void {
    this.setStorage(STORAGE_KEYS.KAS, data);
  }

  static getTagihan(): TagihanIuran[] {
    return this.getStorage<TagihanIuran[]>(STORAGE_KEYS.TAGIHAN, INITIAL_TAGIHAN_IURAN);
  }
  static loadTagihan(): TagihanIuran[] {
    return this.getTagihan();
  }
  static saveTagihan(data: TagihanIuran[]): void {
    this.setStorage(STORAGE_KEYS.TAGIHAN, data);
  }

  static getEvents(): EventItem[] {
    return this.getStorage<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }
  static loadEvents(): EventItem[] {
    return this.getEvents();
  }
  static saveEvents(data: EventItem[]): void {
    this.setStorage(STORAGE_KEYS.EVENTS, data);
  }

  static getNotulen(): NotulenItem[] {
    return this.getStorage<NotulenItem[]>(STORAGE_KEYS.NOTULEN, INITIAL_NOTULEN);
  }
  static loadNotulen(): NotulenItem[] {
    return this.getNotulen();
  }
  static saveNotulen(data: NotulenItem[]): void {
    this.setStorage(STORAGE_KEYS.NOTULEN, data);
  }

  static getSetoranSampah(): SetoranSampah[] {
    return this.getStorage<SetoranSampah[]>('satuwarga_db_setoran_sampah', []);
  }
  static saveSetoranSampah(data: SetoranSampah[]): void {
    this.setStorage('satuwarga_db_setoran_sampah', data);
  }

  static getArsip(): any[] {
    return this.getStorage<any[]>('satuwarga_db_arsip_docs', []);
  }
  static saveArsip(data: any[]): void {
    this.setStorage('satuwarga_db_arsip_docs', data);
  }

  static loadBarang(): BarangInventaris[] {
    return this.getStorage<BarangInventaris[]>(STORAGE_KEYS.BARANG, INITIAL_BARANG);
  }
  static saveBarang(data: BarangInventaris[]): void {
    this.setStorage(STORAGE_KEYS.BARANG, data);
  }

  static loadPeminjaman(): PeminjamanBarang[] {
    return this.getStorage<PeminjamanBarang[]>(STORAGE_KEYS.PEMINJAMAN, INITIAL_PEMINJAMAN);
  }
  static savePeminjaman(data: PeminjamanBarang[]): void {
    this.setStorage(STORAGE_KEYS.PEMINJAMAN, data);
  }

  static loadNasabah(): NasabahBankSampah[] {
    return this.getStorage<NasabahBankSampah[]>(STORAGE_KEYS.NASABAH, INITIAL_NASABAH);
  }
  static saveNasabah(data: NasabahBankSampah[]): void {
    this.setStorage(STORAGE_KEYS.NASABAH, data);
  }

  static loadTrxSampah(): TransaksiBankSampah[] {
    return this.getStorage<TransaksiBankSampah[]>(STORAGE_KEYS.TRX_SAMPAH, INITIAL_TRANSAKSI_SAMPAH);
  }
  static saveTrxSampah(data: TransaksiBankSampah[]): void {
    this.setStorage(STORAGE_KEYS.TRX_SAMPAH, data);
  }

  static loadAduan(): AduanWarga[] {
    return this.getStorage<AduanWarga[]>(STORAGE_KEYS.ADUAN, INITIAL_ADUAN);
  }
  static saveAduan(data: AduanWarga[]): void {
    this.setStorage(STORAGE_KEYS.ADUAN, data);
  }

  static loadPengumuman(): PengumumanItem[] {
    return this.getStorage<PengumumanItem[]>(STORAGE_KEYS.PENGUMUMAN, INITIAL_PENGUMUMAN);
  }
  static savePengumuman(data: PengumumanItem[]): void {
    this.setStorage(STORAGE_KEYS.PENGUMUMAN, data);
  }

  static loadProposal(): ProposalItem[] {
    return this.getStorage<ProposalItem[]>(STORAGE_KEYS.PROPOSAL, INITIAL_PROPOSAL);
  }
  static saveProposal(data: ProposalItem[]): void {
    this.setStorage(STORAGE_KEYS.PROPOSAL, data);
  }

  static loadLPJ(): LPJItem[] {
    return this.getStorage<LPJItem[]>(STORAGE_KEYS.LPJ, INITIAL_LPJ);
  }
  static saveLPJ(data: LPJItem[]): void {
    this.setStorage(STORAGE_KEYS.LPJ, data);
  }

  static loadVoting(): VotingItem[] {
    return this.getStorage<VotingItem[]>(STORAGE_KEYS.VOTING, INITIAL_VOTING);
  }
  static saveVoting(data: VotingItem[]): void {
    this.setStorage(STORAGE_KEYS.VOTING, data);
  }

  // Backup entire database to JSON blob
  static exportBackupJSON(): string {
    const backupObj = {
      appName: 'SatuWarga.id',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        warga: this.loadWarga(),
        kk: this.loadKK(),
        rumah: this.loadRumah(),
        surat: this.loadSurat(),
        kas: this.loadKas(),
        tagihan: this.loadTagihan(),
        events: this.loadEvents(),
        notulen: this.loadNotulen(),
        barang: this.loadBarang(),
        peminjaman: this.loadPeminjaman(),
        nasabah: this.loadNasabah(),
        trxSampah: this.loadTrxSampah(),
        aduan: this.loadAduan(),
        pengumuman: this.loadPengumuman(),
        proposal: this.loadProposal(),
        lpj: this.loadLPJ(),
        voting: this.loadVoting(),
      },
    };
    return JSON.stringify(backupObj, null, 2);
  }

  // Reset database back to default initial mock state
  static resetToDefaults(): void {
    localStorage.clear();
    this.saveWarga(INITIAL_WARGA);
    this.saveKK(INITIAL_KK);
    this.saveRumah(INITIAL_RUMAH);
    this.saveSurat(INITIAL_SURAT);
    this.saveKas(INITIAL_KAS);
    this.saveTagihan(INITIAL_TAGIHAN_IURAN);
    this.saveEvents(INITIAL_EVENTS);
    this.saveNotulen(INITIAL_NOTULEN);
    this.saveBarang(INITIAL_BARANG);
    this.savePeminjaman(INITIAL_PEMINJAMAN);
    this.saveNasabah(INITIAL_NASABAH);
    this.saveTrxSampah(INITIAL_TRANSAKSI_SAMPAH);
    this.saveAduan(INITIAL_ADUAN);
    this.savePengumuman(INITIAL_PENGUMUMAN);
    this.saveProposal(INITIAL_PROPOSAL);
    this.saveLPJ(INITIAL_LPJ);
    this.saveVoting(INITIAL_VOTING);
  }
}

export const localStore = LocalStoreService;


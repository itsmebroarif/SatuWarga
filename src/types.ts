export type UserRole =
  | 'SUPER_ADMIN'
  | 'KETUA_RW'
  | 'WAKIL_KETUA_RW'
  | 'SEKRETARIS_RW'
  | 'WAKIL_SEKRETARIS_RW'
  | 'BENDAHARA_RW'
  | 'WAKIL_BENDAHARA_RW'
  | 'KETUA_RT'
  | 'WAKIL_KETUA_RT'
  | 'SEKRETARIS_RT'
  | 'WAKIL_SEKRETARIS_RT'
  | 'BENDAHARA_RT'
  | 'WAKIL_BENDAHARA_RT'
  | 'KETUA_PKK'
  | 'PENGURUS_PKK'
  | 'KETUA_KARANG_TARUNA'
  | 'PENGURUS_KARANG_TARUNA'
  | 'POSYANDU'
  | 'BANK_SAMPAH'
  | 'LINMAS'
  | 'KETUA_DKM'
  | 'PENGURUS_DKM'
  | 'WARGA';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type UnitCategory = 'RT' | 'RW' | 'PKK' | 'KARANG_TARUNA' | 'POSYANDU' | 'BANK_SAMPAH' | 'LINMAS' | 'DKM';

export interface Warga {
  id: string;
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Khonghucu';
  pendidikan: string;
  pekerjaan: string;
  statusPerkawinan: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  noHp: string;
  email: string;
  fotoUrl?: string;
  alamat: string;
  rt: string;
  rw: string;
  nomorRumah: string;
  statusTinggal: 'Tetap' | 'Kontrak' | 'Kos' | 'Komuter';
  statusWarga: 'Aktif' | 'Pindah' | 'Meninggal';
  lat: number;
  lng: number;
  kkId?: string;
  isEncrypted?: boolean;
}

export interface KartuKeluarga {
  id: string;
  nomorKk: string;
  kepalaKeluargaNama: string;
  alamat: string;
  rt: string;
  rw: string;
  anggotaCount: number;
  anggotaNames: string[];
  status: 'Aktif' | 'Arsip';
}

export interface Rumah {
  id: string;
  nomorRumah: string;
  blok: string;
  rt: string;
  rw: string;
  pemilikNama: string;
  penghuniCount: number;
  status: 'Dihuni' | 'Kosong' | 'Kontrak';
  lat: number;
  lng: number;
}

export type StatusSurat = 'DRAFT' | 'MENUNGGU_RT' | 'MENUNGGU_RW' | 'DISETUJUI' | 'DITOLAK';

export interface Surat {
  id: string;
  nomorSurat: string;
  jenisSurat:
    | 'Surat Domisili'
    | 'Surat Pengantar RT/RW'
    | 'Surat Keterangan Usaha'
    | 'Surat Tidak Mampu (SKTM)'
    | 'Surat Kematian'
    | 'Surat Kelahiran'
    | 'Surat Pindah'
    | 'Surat Izin Keramaian'
    | 'Surat Undangan'
    | 'Surat Keputusan';
  wargaId: string;
  namaWarga: string;
  nik: string;
  alamatWarga: string;
  rt: string;
  rw: string;
  keperluan: string;
  tanggalPengajuan: string;
  status: StatusSurat;
  qrCodeHash: string;
  digitalSignature?: string;
  stempelUrl?: string;
  catatanAdmin?: string;
  tglDisetujui?: string;
}

export interface TransaksiKas {
  id: string;
  unitKas: UnitCategory;
  jenis: 'PEMASUKAN' | 'PENGELUARAN';
  kategori: string;
  jumlah: number;
  tanggal: string;
  keterangan: string;
  buktiUrl?: string;
  statusApproval: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdBy: string;
}

export interface TagihanIuran {
  id: string;
  nomorRumah: string;
  wargaNama: string;
  bulanTahun: string;
  jenisIuran: 'Kebersihan & Sampah' | 'Keamanan & Ronda' | 'Kas Rutin RT' | 'Air Bersih' | 'Sumbangan PHBN';
  jumlah: number;
  status: 'LUNAS' | 'BELUM_LUNAS';
  tglBayar?: string;
  metodeBayar?: 'QRIS' | 'TUNAI' | 'TRANSFER';
  noKwitansi?: string;
}

export interface EventItem {
  id: string;
  nama: string;
  unitOwner: UnitCategory;
  tanggal: string;
  waktu: string;
  lokasi: string;
  picNama: string;
  anggaran: number;
  deskripsi: string;
  status: 'MENDATANG' | 'BERJALAN' | 'SELESAI';
  absensiCount: number;
  notulensiText?: string;
}

export interface NotulenItem {
  id: string;
  eventId?: string;
  judul: string;
  agenda: string;
  peserta: string;
  pembahasan: string;
  keputusan: string;
  actionItems: string;
  deadline: string;
  penanggungJawab: string;
  tanggal: string;
}

export interface BarangInventaris {
  id: string;
  unitOwner: UnitCategory;
  namaBarang: string;
  kodeBarang: string;
  jumlahTotal: number;
  jumlahBaik: number;
  jumlahDipinjam: number;
  jumlahRusak: number;
  lokasiPenyimpanan: string;
}

export interface PeminjamanBarang {
  id: string;
  barangId: string;
  namaBarang: string;
  peminjamNama: string;
  noHp: string;
  tglPinjam: string;
  tglRencanaKembali: string;
  tglKembali?: string;
  jumlah: number;
  status: 'PENDING' | 'DIPINJAM' | 'DIKEMBALIKAN' | 'DITOLAK';
  catatan?: string;
}

export interface NasabahBankSampah {
  id: string;
  nomorNasabah: string;
  nama: string;
  noHp: string;
  rt: string;
  saldo: number;
  totalBeratKg: number;
}

export interface TransaksiBankSampah {
  id: string;
  nasabahId: string;
  nasabahNama: string;
  jenisSampah: 'Plastik' | 'Kertas/Kardus' | 'Logam/Kaleng' | 'Botol Kaca' | 'Minyak Jelantah';
  beratKg: number;
  hargaPerKg: number;
  totalHarga: number;
  tanggal: string;
}

export interface AduanWarga {
  id: string;
  pelaporNama: string;
  noHp: string;
  rt: string;
  kategori: 'Jalan Rusak' | 'Lampu Mati' | 'Banjir' | 'Kebersihan' | 'Keamanan' | 'Sosial/Lainnya';
  judul: string;
  deskripsi: string;
  fotoUrl?: string;
  status: 'OPEN' | 'PROGRESS' | 'PENDING' | 'DONE';
  balasanAdmin?: string;
  tglAduan: string;
  petugasNama?: string;
  tglSelesai?: string;
}

export interface PengumumanItem {
  id: string;
  judul: string;
  isi: string;
  unitIssuer: UnitCategory;
  tanggal: string;
  kategori: 'PENTING' | 'KEGIATAN' | 'INFORMASI' | 'HIMBAUAN';
  tipe: 'BANNER' | 'POSTER' | 'ARTICLE' | 'PDF';
  mediaUrl?: string;
  penulis?: string;
  isUrgent?: boolean;
}

export interface ProposalItem {
  id: string;
  namaKegiatan: string;
  pemohonUnit: UnitCategory;
  estimasiBiaya: number;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED';
  tanggal: string;
  content: string;
}

export interface LPJItem {
  id: string;
  namaKegiatan: string;
  unit: UnitCategory;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
  status: 'SELESAI' | 'DRAFT';
  tanggal: string;
  content: string;
}

export interface VotingItem {
  id: string;
  judul: string;
  deskripsi: string;
  unit: UnitCategory;
  tglMulai: string;
  tglSelesai: string;
  opsi: { id: string; label: string; votes: number }[];
  status: 'AKTIF' | 'SELESAI';
  totalVotes: number;
  userVotedIds: string[];
}

export type ActiveTab =
  | 'DASHBOARD'
  | 'MASTER_DATA'
  | 'ADMINISTRASI'
  | 'KEUANGAN'
  | 'IURAN'
  | 'KEGIATAN'
  | 'SUB_ORGANISASI'
  | 'ARSIP_PROPOSAL'
  | string;

export interface SetoranSampah {
  id: string;
  wargaNama: string;
  nomorRumah: string;
  jenisSampah: string;
  beratKg: number;
  hargaPerKg: number;
  totalRupiah: number;
  tanggal: string;
}

export interface ArsipDokumen {
  id: string;
  judul: string;
  kategori: string;
  nomorDokumen: string;
  tanggal: string;
  fileSize: string;
  fileUrl: string;
  keterangan?: string;
}

export type SubOrgUnit = 'PKK' | 'POSYANDU' | 'BANK_SAMPAH' | 'KARANG_TARUNA' | 'KAMPUNG_PANCASILA' | 'JUMANTIK' | 'SISKAMLING';


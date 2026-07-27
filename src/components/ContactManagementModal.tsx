import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Phone,
  Search,
  Copy,
  Check,
  Clock,
  UserCheck,
  MapPin,
  X,
  Sparkles,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Building,
  Users,
} from 'lucide-react';
import { Warga } from '../types';

interface ContactManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  wargaList: Warga[];
  initialSelectedWarga?: Warga | null;
  onUpdateWarga?: (warga: Warga) => void;
}

export type MessagePurpose =
  | 'IURAN_RT'
  | 'DOKUMEN_SURAT'
  | 'KERJA_BAKTI'
  | 'PENGUMUMAN'
  | 'RONDA_SISKAMLING'
  | 'KUSTOM';

export function getWibTimeGreeting(): {
  timeStr: string;
  period: 'Pagi' | 'Siang' | 'Sore' | 'Malam';
  greeting: string;
} {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const wibDate = new Date(utcMs + 3600000 * 7); // UTC+7
  const hours = wibDate.getHours();
  const minutes = wibDate.getMinutes();

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const timeStr = `${formattedHours}:${formattedMinutes} WIB`;

  if (hours >= 4 && hours < 11) {
    return { timeStr, period: 'Pagi', greeting: 'Selamat Pagi' };
  } else if (hours >= 11 && hours < 15) {
    return { timeStr, period: 'Siang', greeting: 'Selamat Siang' };
  } else if (hours >= 15 && hours < 19) {
    return { timeStr, period: 'Sore', greeting: 'Selamat Sore' };
  } else {
    return { timeStr, period: 'Malam', greeting: 'Selamat Malam' };
  }
}

export const ContactManagementModal: React.FC<ContactManagementModalProps> = ({
  isOpen,
  onClose,
  wargaList = [],
  initialSelectedWarga = null,
  onUpdateWarga,
}) => {
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(
    initialSelectedWarga || (wargaList.length > 0 ? wargaList[0] : null)
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [rtFilter, setRtFilter] = useState('ALL');
  const [religionFilter, setReligionFilter] = useState('ALL');

  // WhatsApp Message Generator State
  const [purpose, setPurpose] = useState<MessagePurpose>('DOKUMEN_SURAT');
  const [customDetail, setCustomDetail] = useState('');
  const [useMuslimGreeting, setUseMuslimGreeting] = useState<boolean>(
    selectedWarga ? selectedWarga.agama === 'Islam' : true
  );

  // Phone editing
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  // Copy state
  const [copied, setCopied] = useState(false);

  // Update selected Warga when initialSelectedWarga changes or modal opens
  useEffect(() => {
    if (initialSelectedWarga) {
      setSelectedWarga(initialSelectedWarga);
      setUseMuslimGreeting(initialSelectedWarga.agama === 'Islam');
      setPhoneInput(initialSelectedWarga.noHp || '');
    } else if (wargaList.length > 0 && !selectedWarga) {
      setSelectedWarga(wargaList[0]);
      setUseMuslimGreeting(wargaList[0].agama === 'Islam');
      setPhoneInput(wargaList[0].noHp || '');
    }
  }, [initialSelectedWarga, isOpen, wargaList]);

  // When selected Warga changes, sync religion greeting and phone
  const handleSelectWarga = (w: Warga) => {
    setSelectedWarga(w);
    setUseMuslimGreeting(w.agama === 'Islam');
    setPhoneInput(w.noHp || '');
    setEditingPhone(false);
  };

  if (!isOpen) return null;

  // Filtered list
  const filteredContacts = wargaList.filter((w) => {
    const matchesSearch =
      w.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.noHp.includes(searchTerm) ||
      w.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRt = rtFilter === 'ALL' || w.rt === rtFilter;
    const matchesReligion =
      religionFilter === 'ALL' ||
      (religionFilter === 'ISLAM' && w.agama === 'Islam') ||
      (religionFilter === 'NON_ISLAM' && w.agama !== 'Islam');

    return matchesSearch && matchesRt && matchesReligion;
  });

  // WIB Greeting calculations
  const wibInfo = getWibTimeGreeting();

  // Determine Muslim Status
  const isSelectedMuslim = selectedWarga ? selectedWarga.agama === 'Islam' : false;

  // Save phone number update
  const handleSavePhone = () => {
    if (!selectedWarga) return;
    const updated = { ...selectedWarga, noHp: phoneInput.trim() };
    setSelectedWarga(updated);
    if (onUpdateWarga) {
      onUpdateWarga(updated);
    }
    setEditingPhone(false);
  };

  // Generate Message Text
  const buildWhatsAppMessage = () => {
    if (!selectedWarga) return '';

    const nama = selectedWarga.nama;
    const rt = selectedWarga.rt || '003';
    const rw = selectedWarga.rw || '012';
    const alamat = `${selectedWarga.alamat} No. ${selectedWarga.nomorRumah}`;

    let salutation = '';
    if (useMuslimGreeting) {
      salutation = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n${wibInfo.greeting} Bapak/Ibu ${nama},`;
    } else {
      salutation = `${wibInfo.greeting} Bapak/Ibu ${nama},`;
    }

    let purposeTitle = '';
    let defaultText = '';

    switch (purpose) {
      case 'DOKUMEN_SURAT':
        purposeTitle = 'Pemberitahuan Dokumen Surat Selesai';
        defaultText =
          'Menginformasikan bahwa dokumen Surat Pengantar / Keterangan Administrasi RT/RW yang Bapak/Ibu ajukan telah selesai diproses dan ditandatangani. Dokumen dapat diambil di Sekretariat RT atau diunduh secara digital.';
        break;
      case 'IURAN_RT':
        purposeTitle = 'Konfirmasi & Pengingat Iuran RT/RW';
        defaultText =
          'Mengingatkan perihal iuran kebersihan, keamanan, dan kas rutin lingkungan warga bulan ini. Pembayaran dapat dilakukan secara tunai ke Bendahara RT atau secara instan via QRIS/Transfer.';
        break;
      case 'KERJA_BAKTI':
        purposeTitle = 'Undangan Gotong Royong & Kerja Bakti';
        defaultText =
          'Mengundang partisipasi Bapak/Ibu warga dalam kegiatan Kerja Bakti Bersama pembersihan saluran drainase dan perapihan lingkungan demi kenyamanan dan kesehatan bersama.';
        break;
      case 'PENGUMUMAN':
        purposeTitle = 'Informasi Pengumuman Warga';
        defaultText =
          'Menyampaikan informasi penting dari Pengurus Lingkungan RT/RW Sukamaju terkait kegiatan warta warga dan koordinasi pelayanan sosial.';
        break;
      case 'RONDA_SISKAMLING':
        purposeTitle = 'Jadwal Ronda & Keamanan Siskamling';
        defaultText =
          'Pemberitahuan jadwal piket ronda malam Siskamling untuk menjaga keamanan dan ketertiban wilayah RT/RW kita. Mohon konfirmasi kehadirannya.';
        break;
      case 'KUSTOM':
      default:
        purposeTitle = 'Komunikasi Pengurus RT/RW';
        defaultText = 'Menyampaikan koordinasi dan pelayanan administrasi warga RT/RW.';
        break;
    }

    const detailPesanFormatted = customDetail.trim()
      ? customDetail.trim()
      : defaultText;

    const fullMessage = `${salutation}

Semoga Bapak/Ibu sekeluarga selalu dalam keadaan sehat wal'afiat.

Perkenankan kami dari Pengurus RT ${rt} / RW ${rw} Sukamaju menghubungi Bapak/Ibu terkait *${purposeTitle}*:

${detailPesanFormatted}

📍 *Data Domisili Terdata:*
${alamat} (RT ${rt} / RW ${rw})

Demikian informasi ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.

Hormat kami,
*Pengurus RT ${rt} / RW ${rw} Sukamaju*`;

    return fullMessage;
  };

  const messageDraft = buildWhatsAppMessage();

  // Format WhatsApp Link
  const getWhatsAppUrl = () => {
    if (!selectedWarga || !selectedWarga.noHp) return '';
    let cleanPhone = selectedWarga.noHp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const encodedText = encodeURIComponent(messageDraft);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(messageDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-4 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Contact Management & WhatsApp Dispatcher
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase border border-slate-900">
                  WIB Auto-Greeting
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Kelola kontak warga, format sapaan ramah WIB & salam agama otomatis, lalu kirim via WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns (Left: Contact Directory, Right: Message Composer) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
          {/* Left Column: Contact Directory (5 cols) */}
          <div className="lg:col-span-5 border-r-2 border-slate-900 bg-white p-4 flex flex-col gap-3 overflow-y-auto max-h-[400px] lg:max-h-none">
            {/* Search & Filter Header */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, No. HP, alamat warga..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={rtFilter}
                  onChange={(e) => setRtFilter(e.target.value)}
                  className="flex-1 bg-slate-50 border-2 border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                >
                  <option value="ALL">Semua RT</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const val = String(i + 1).padStart(2, '0');
                    return (
                      <option key={val} value={val}>
                        RT {val}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={religionFilter}
                  onChange={(e) => setReligionFilter(e.target.value)}
                  className="flex-1 bg-slate-50 border-2 border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-900"
                >
                  <option value="ALL">Agama (Semua)</option>
                  <option value="ISLAM">Muslim (Islam)</option>
                  <option value="NON_ISLAM">Non-Muslim</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
                <span>Total Kontak: {filteredContacts.length} Warga</span>
                {selectedWarga && (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Terpilih: {selectedWarga.nama}
                  </span>
                )}
              </div>
            </div>

            {/* Contacts List */}
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {filteredContacts.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <p className="text-xs font-bold">Tidak ada kontak ditemukan</p>
                </div>
              ) : (
                filteredContacts.map((warga) => {
                  const isSelected = selectedWarga?.id === warga.id;
                  const isMuslim = warga.agama === 'Islam';

                  return (
                    <div
                      key={warga.id}
                      onClick={() => handleSelectWarga(warga)}
                      className={`p-3 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]'
                          : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-slate-900'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-xs truncate">
                            {warga.nama}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${
                              isMuslim
                                ? isSelected
                                  ? 'bg-emerald-400 text-slate-950 border-emerald-500'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : isSelected
                                ? 'bg-sky-400 text-slate-950 border-sky-500'
                                : 'bg-sky-100 text-sky-800 border-sky-300'
                            }`}
                          >
                            {isMuslim ? 'Muslim' : warga.agama}
                          </span>
                        </div>

                        <div
                          className={`text-[10px] font-mono flex items-center gap-2 ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          <span className="flex items-center gap-1 font-bold">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            {warga.noHp || 'No. HP Belum Ada'}
                          </span>
                          <span>•</span>
                          <span>
                            RT {warga.rt}/RW {warga.rw}
                          </span>
                        </div>

                        <p
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {warga.alamat} (No. {warga.nomorRumah})
                        </p>
                      </div>

                      <div className="shrink-0">
                        <button
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-400 text-slate-950 border-emerald-500 hover:bg-emerald-300'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          }`}
                          title="Pilih Kontak untuk Kirim WA"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: WhatsApp Draft Composer & Time Engine (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto">
            {selectedWarga ? (
              <>
                {/* Active Contact Banner */}
                <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-sm text-slate-900">
                        {selectedWarga.nama}
                      </h3>
                      <span className="bg-slate-900 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-900">
                        RT {selectedWarga.rt} / RW {selectedWarga.rw}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isSelectedMuslim
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-sky-100 text-sky-800 border-sky-300'
                        }`}
                      >
                        Agama: {selectedWarga.agama}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {selectedWarga.alamat} No. {selectedWarga.nomorRumah}
                      </span>
                    </div>
                  </div>

                  {/* Phone Number Input & Edit */}
                  <div className="shrink-0 bg-slate-50 p-2 rounded-xl border border-slate-300 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                      <span>Nomor WhatsApp:</span>
                      {!editingPhone && (
                        <button
                          onClick={() => setEditingPhone(true)}
                          className="text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer font-extrabold"
                        >
                          <Edit2 className="w-2.5 h-2.5" /> Ubah
                        </button>
                      )}
                    </div>

                    {editingPhone ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          className="w-28 bg-white border border-slate-400 rounded px-1.5 py-0.5 text-xs font-mono font-bold"
                        />
                        <button
                          onClick={handleSavePhone}
                          className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="font-mono font-black text-xs text-slate-900 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedWarga.noHp || (
                          <span className="text-rose-600 italic">Belum Diisi</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Greeting Logic & Salutation Controls */}
                <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-300 text-amber-950 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black border border-slate-900 shadow-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black flex items-center gap-1">
                          Waktu WIB Saat Ini: <span className="text-emerald-800 font-mono">{wibInfo.timeStr}</span>
                        </div>
                        <p className="text-[10px] text-amber-800 font-medium">
                          Sapaan waktu otomatis: <strong>"{wibInfo.greeting}"</strong> ({wibInfo.period})
                        </p>
                      </div>
                    </div>

                    {/* Muslim Salutation Toggle Switch */}
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold shadow-xs">
                      <input
                        type="checkbox"
                        checked={useMuslimGreeting}
                        onChange={(e) => setUseMuslimGreeting(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Gunakan Salam "Assalamualaikum"</span>
                    </label>
                  </div>

                  <div className="text-xs font-semibold text-slate-700 bg-white/80 p-2 rounded-xl border border-amber-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Sapaan Terpilih:{' '}
                      <strong className="text-slate-900 font-mono">
                        "{useMuslimGreeting ? `Assalamu'alaikum Warahmatullahi Wabarakatuh. ${wibInfo.greeting}` : wibInfo.greeting} Bapak/Ibu {selectedWarga.nama}"
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Message Purpose Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-slate-900">
                    Pilih Tujuan WhatsApp (Perihal Komunikasi):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'DOKUMEN_SURAT', label: '📄 Surat & Dokumen', desc: 'Pemberitahuan surat siap' },
                      { id: 'IURAN_RT', label: '💵 Iuran & Kas RT', desc: 'Pengingat tagihan iuran' },
                      { id: 'KERJA_BAKTI', label: '🧹 Kerja Bakti', desc: 'Undangan gotong royong' },
                      { id: 'PENGUMUMAN', label: '📢 Pengumuman', desc: 'Warta warga penting' },
                      { id: 'RONDA_SISKAMLING', label: '🛡️ Jadwal Ronda', desc: 'Koordinasi Siskamling' },
                      { id: 'KUSTOM', label: '✍️ Pesan Kustom', desc: 'Tulis pesan sendiri' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPurpose(item.id as MessagePurpose)}
                        className={`p-2.5 rounded-xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                          purpose === item.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                            : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'
                        }`}
                      >
                        <span className="font-extrabold text-xs">{item.label}</span>
                        <span
                          className={`text-[10px] mt-0.5 ${
                            purpose === item.id ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message Detail Textarea */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-slate-900">
                    Catatan Detail / Rincian Tambahan Pesan:
                  </label>
                  <textarea
                    rows={2}
                    value={customDetail}
                    onChange={(e) => setCustomDetail(e.target.value)}
                    placeholder="Contoh: Pembayaran iuran sebesar Rp 50.000 untuk bulan Juli. Atau jadwal kerja bakti Sabtu jam 07.00 WIB di Lapangan..."
                    className="w-full bg-white border-2 border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                {/* Draft Preview Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      Pratinjau Draf Pesan WhatsApp:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition border border-slate-400"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Teks</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-emerald-950 text-emerald-100 font-mono text-xs p-3.5 rounded-2xl border-2 border-slate-900 whitespace-pre-wrap leading-relaxed shadow-inner max-h-48 overflow-y-auto">
                    {messageDraft}
                  </div>
                </div>

                {/* Send WhatsApp Action Button */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs border border-slate-400 transition cursor-pointer"
                  >
                    Tutup
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    disabled={!selectedWarga.noHp}
                    className={`px-5 py-2.5 rounded-2xl font-black text-xs border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-2 transition cursor-pointer active:translate-y-0.5 ${
                      selectedWarga.noHp
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed border-slate-400'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Buka WhatsApp Sekarang</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 my-auto">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="font-extrabold text-slate-700">Pilih Kontak Warga</p>
                <p className="text-xs text-slate-500 mt-1">
                  Klik salah satu kontak di panel sebelah kiri untuk menyusun pesan WhatsApp dengan salam otomatis WIB dan pilihan perihal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

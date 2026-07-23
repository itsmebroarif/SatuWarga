import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  BookOpen,
  Award,
  Sparkles,
  Users,
  Mic,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileText,
} from 'lucide-react';
import { EventItem, NotulenItem } from '../types';

interface KegiatanViewProps {
  eventsList: EventItem[];
  notulenList: NotulenItem[];
  onAddEvent: (evt: EventItem) => void;
  onAddNotulen: (not: NotulenItem) => void;
}

export const KegiatanView: React.FC<KegiatanViewProps> = ({
  eventsList = [],
  notulenList = [],
  onAddEvent,
  onAddNotulen,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'EVENTS' | 'NOTULEN' | 'SERTIFIKAT'>('EVENTS');

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [namaEvent, setNamaEvent] = useState('');
  const [unitOwner, setUnitOwner] = useState<EventItem['unitOwner']>('RT');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [lokasi, setLokasi] = useState('Balai Warga RW 05');
  const [picNama, setPicNama] = useState('H. Ahmad Dahlan');
  const [anggaran, setAnggaran] = useState(500000);
  const [deskripsi, setDeskripsi] = useState('');

  // Notulen AI Summarizer Modal State
  const [isNotulenModalOpen, setIsNotulenModalOpen] = useState(false);
  const [agendaNotulen, setAgendaNotulen] = useState('');
  const [catatanRaw, setCatatanRaw] = useState('');
  const [aiSummaryResult, setAiSummaryResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Certificate Modal State
  const [selectedCertParticipant, setSelectedCertParticipant] = useState('Bambang Supriadi, S.E.');
  const [selectedCertRole, setSelectedCertRole] = useState('Panitia Pelaksana / Relawan');
  const [certEventName, setCertEventName] = useState('Kerja Bakti Masal RW 05');
  const [showCertModal, setShowCertModal] = useState(false);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt: EventItem = {
      id: 'ev-' + Date.now(),
      nama: namaEvent || 'Kegiatan Lingkungan',
      unitOwner,
      tanggal,
      waktu: '08:00 WIB',
      lokasi,
      picNama,
      anggaran: Number(anggaran) || 0,
      deskripsi,
      status: 'MENDATANG',
      absensiCount: 15,
    };
    onAddEvent(newEvt);
    setIsEventModalOpen(false);
    setNamaEvent('');
    setDeskripsi('');
  };

  const handleSummarizeWithAi = async () => {
    if (!catatanRaw) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/summarize-notulen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agenda: agendaNotulen || 'Musyawarah Warga',
          pembahasanRaw: catatanRaw,
          peserta: 'Pengurus RT/RW & Warga',
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiSummaryResult(data.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveNotulen = (e: React.FormEvent) => {
    e.preventDefault();
    const newNot: NotulenItem = {
      id: 'not-' + Date.now(),
      judul: `Notulensi ${agendaNotulen || 'Rapat'}`,
      agenda: agendaNotulen || 'Rapat Koordinasi',
      peserta: 'Pengurus RT/RW & Warga',
      pembahasan: catatanRaw,
      keputusan: aiSummaryResult || catatanRaw,
      actionItems: 'Tindak Lanjut Koordinasi Pengurus',
      deadline: new Date().toISOString().slice(0, 10),
      penanggungJawab: 'Ketua RT',
      tanggal: new Date().toISOString().slice(0, 10),
    };
    onAddNotulen(newNot);
    setIsNotulenModalOpen(false);
    setAgendaNotulen('');
    setCatatanRaw('');
    setAiSummaryResult('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" /> Modul Agenda, Notulensi & Sertifikat
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan Jadwal Kegiatan Lingkungan, Ringkasan Rapat AI, Absensi Digital & E-Sertifikat.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('EVENTS')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeSubTab === 'EVENTS'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Agenda Kegiatan ({eventsList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('NOTULEN')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeSubTab === 'NOTULEN'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Notulensi Rapat ({notulenList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('SERTIFIKAT')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              activeSubTab === 'SERTIFIKAT'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Sertifikat Digital
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AGENDA KEGIATAN */}
      {activeSubTab === 'EVENTS' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Buat Agenda Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventsList.map((evt) => (
              <div key={evt.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded uppercase">
                    {evt.unitOwner}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      evt.status === 'SELESAI'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{evt.nama}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{evt.deskripsi}</p>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 space-y-1">
                  <div>📅 <strong>Jadwal:</strong> {evt.tanggal} ({evt.waktu})</div>
                  <div>📍 <strong>Lokasi:</strong> {evt.lokasi}</div>
                  <div>👤 <strong>PIC:</strong> {evt.picNama}</div>
                  <div>💰 <strong>Anggaran:</strong> Rp {evt.anggaran.toLocaleString('id-ID')}</div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> {evt.absensiCount} Warga Hadir
                  </span>
                  <button
                    onClick={() => {
                      setCertEventName(evt.nama);
                      setActiveSubTab('SERTIFIKAT');
                    }}
                    className="text-xs text-purple-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" /> E-Sertifikat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: NOTULENSI RAPAT */}
      {activeSubTab === 'NOTULEN' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsNotulenModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Catat Notulen + AI Ringkasan
            </button>
          </div>

          <div className="space-y-4">
            {notulenList.map((not) => (
              <div key={not.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">{not.judul}</h3>
                  <span className="text-xs font-mono text-slate-500">{not.tanggal}</span>
                </div>

                <div className="text-xs text-slate-700 space-y-2">
                  <div><strong>Agenda:</strong> {not.agenda}</div>
                  <div><strong>Peserta:</strong> {not.peserta}</div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <strong className="text-emerald-800 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Keputusan & Action Items:
                    </strong>
                    <p className="whitespace-pre-wrap text-slate-800 font-sans">{not.keputusan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: E-SERTIFIKAT GENERATOR */}
      {activeSubTab === 'SERTIFIKAT' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" /> Generator E-Sertifikat Relawan / Panitia
            </h3>
            <p className="text-xs text-slate-500">
              Buat Sertifikat Penghargaan Resmi Lingkungan RT/RW secara Otomatis.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Penerima Sertifikat *</label>
              <input
                type="text"
                value={selectedCertParticipant}
                onChange={(e) => setSelectedCertParticipant(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Kegiatan Lingkungan *</label>
              <input
                type="text"
                value={certEventName}
                onChange={(e) => setCertEventName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Peran / Apresiasi *</label>
              <input
                type="text"
                value={selectedCertRole}
                onChange={(e) => setSelectedCertRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-medium"
              />
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white text-xs py-2.5 rounded font-bold shadow-xs flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" /> Pratinjau & Cetak E-Sertifikat
            </button>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Buat Agenda Kegiatan Baru</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={namaEvent}
                  onChange={(e) => setNamaEvent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                  placeholder="Contoh: Senam Sehat & Pemeriksaan Darah"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Unit Penyelenggara</label>
                <select
                  value={unitOwner}
                  onChange={(e) => setUnitOwner(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-medium"
                >
                  <option value="RT">Pengurus RT</option>
                  <option value="RW">Pengurus RW</option>
                  <option value="PKK">PKK</option>
                  <option value="POSYANDU">Posyandu</option>
                  <option value="KARANG_TARUNA">Karang Taruna</option>
                  <option value="DKM">DKM Al-Ikhlas</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tanggal & Tanggung Jawab</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded px-2 py-1.5"
                  />
                  <input
                    type="text"
                    value={picNama}
                    onChange={(e) => setPicNama(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded px-2 py-1.5"
                    placeholder="Nama PIC"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estimasi Anggaran (Rp)</label>
                <input
                  type="number"
                  value={anggaran}
                  onChange={(e) => setAnggaran(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded font-semibold shadow-xs"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTULEN AI MODAL */}
      {isNotulenModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Catat Notulen Rapat + Gemini AI Summarizer
              </h3>
              <button onClick={() => setIsNotulenModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotulen} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Agenda / Judul Rapat *</label>
                <input
                  type="text"
                  required
                  value={agendaNotulen}
                  onChange={(e) => setAgendaNotulen(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-bold"
                  placeholder="Contoh: Rapat Evaluasi Keamanan & Pos Ronda RT 01"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Catatan Mentah Diskusi Rapat *</label>
                  <button
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={`text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                      isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Mic className="w-3 h-3" /> {isRecording ? 'Merekam Suara...' : 'Simulasi Audio Rec'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={catatanRaw}
                  onChange={(e) => setCatatanRaw(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5"
                  placeholder="Ketik poin diskusi mentah di sini..."
                />
              </div>

              {/* AI Summarize Button */}
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-900 text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Auto-Summary Poin Keputusan AI
                  </span>
                  <button
                    type="button"
                    onClick={handleSummarizeWithAi}
                    disabled={isAiLoading || !catatanRaw}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded font-bold"
                  >
                    {isAiLoading ? 'Meringkas...' : 'Proses Ringkasan AI'}
                  </button>
                </div>

                {aiSummaryResult && (
                  <div className="p-2 bg-white rounded border border-emerald-300 text-[10px] text-slate-800 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {aiSummaryResult}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNotulenModalOpen(false)}
                  className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-1.5 rounded font-semibold shadow-xs"
                >
                  Simpan Notulen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E-SERTIFIKAT PRINTABLE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-4 print:p-0 print:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 print:hidden">
              <span className="font-bold text-slate-800 text-sm">Pratinjau E-Sertifikat Official</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-purple-700 text-white text-xs px-3 py-1.5 rounded font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak / Export PDF
                </button>
                <button onClick={() => setShowCertModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CERTIFICATE DESIGN */}
            <div className="border-8 border-double border-purple-900 p-8 text-center space-y-4 bg-amber-50/20 font-serif my-2">
              <div className="text-purple-950 font-bold tracking-widest text-lg uppercase">
                SERTIFIKAT PENGHARGAAN
              </div>
              <p className="text-xs font-sans text-slate-600 italic">No. SERT/RT01-RW05/2026/088</p>

              <p className="text-xs font-sans text-slate-700 pt-2">Diberikan secara terhormat kepada:</p>

              <h2 className="text-xl font-bold text-slate-900 underline uppercase tracking-wider">
                {selectedCertParticipant}
              </h2>

              <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed font-sans">
                Atas dedikasi, partisipasi aktif, dan kontribusi nyata sebagai <strong>{selectedCertRole}</strong> dalam kegiatan <strong>"{certEventName}"</strong> di lingkungan RT 01-05 / RW 05 Graha Warga.
              </p>

              <div className="pt-8 grid grid-cols-2 text-xs font-sans">
                <div>
                  <p className="font-bold">Ketua RT 01</p>
                  <p className="font-bold underline text-slate-900 pt-10">H. Ahmad Dahlan</p>
                </div>
                <div>
                  <p className="font-bold">Ketua RW 05</p>
                  <p className="font-bold underline text-slate-900 pt-10">Drs. Hendra Wijaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

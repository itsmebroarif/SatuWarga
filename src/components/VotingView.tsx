import React, { useState } from 'react';
import {
  Vote,
  Plus,
  CheckCircle2,
  BarChart2,
  Calendar,
  Clock,
  UserCheck,
  X,
  AlertCircle,
  HelpCircle,
  Users,
} from 'lucide-react';
import { VotingItem, UnitCategory } from '../types';

interface VotingViewProps {
  votingList: VotingItem[];
  onAddVoting: (item: VotingItem) => void;
  onCastVote: (votingId: string, optionId: string) => void;
  currentRole?: string;
}

export const VotingView: React.FC<VotingViewProps> = ({
  votingList = [],
  onAddVoting,
  onCastVote,
  currentRole,
}) => {
  const [filterStatus, setFilterStatus] = useState<'SEMUA' | 'AKTIF' | 'SELESAI'>('SEMUA');
  const [selectedOptionId, setSelectedOptionId] = useState<Record<string, string>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [unit, setUnit] = useState<UnitCategory>('RT');
  const [tglSelesai, setTglSelesai] = useState('2026-08-15');
  const [opsiList, setOpsiList] = useState<string[]>(['Opsi A', 'Opsi B']);

  const filteredList = votingList.filter((item) => {
    if (filterStatus === 'SEMUA') return true;
    return item.status === filterStatus;
  });

  const handleAddOpsiInput = () => {
    setOpsiList([...opsiList, `Opsi ${String.fromCharCode(65 + opsiList.length)}`]);
  };

  const handleRemoveOpsiInput = (index: number) => {
    if (opsiList.length <= 2) return;
    setOpsiList(opsiList.filter((_, i) => i !== index));
  };

  const handleOpsiChange = (index: number, val: string) => {
    const updated = [...opsiList];
    updated[index] = val;
    setOpsiList(updated);
  };

  const handleCreateVoting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || opsiList.some((o) => !o.trim())) return;

    const newVoting: VotingItem = {
      id: 'vote-' + Date.now(),
      judul,
      deskripsi,
      unit,
      tglMulai: new Date().toISOString().slice(0, 10),
      tglSelesai,
      opsi: opsiList.map((label, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        label,
        votes: 0,
      })),
      status: 'AKTIF',
      totalVotes: 0,
      userVotedIds: [],
    };

    onAddVoting(newVoting);
    setIsModalOpen(false);
    setJudul('');
    setDeskripsi('');
    setOpsiList(['Opsi A', 'Opsi B']);
  };

  const handleVoteSubmit = (votingId: string) => {
    const optId = selectedOptionId[votingId];
    if (!optId) {
      alert('Silakan pilih salah satu opsi terlebih dahulu.');
      return;
    }
    onCastVote(votingId, optId);
  };

  return (
    <div className="space-y-5">
      {/* Material Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#0056b3] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold tracking-wider">
              Demokrasi Warga
            </span>
            <span className="text-slate-500 text-xs font-medium">Musyawarah & Pemilihan Digital</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Vote className="w-5 h-5 text-[#0056b3]" /> E-Voting & Jajak Pendapat Warga
          </h2>
          <p className="text-xs text-slate-600">
            Pemungutan suara terbuka untuk penetapan ketua RT/RW, lokasi fasum, atau keputusan anggaran secara transparan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0056b3] hover:bg-[#004494] active:scale-[0.98] text-white text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Buat Pemungutan Suara
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs">
        {[
          { id: 'SEMUA', label: 'Semua Voting' },
          { id: 'AKTIF', label: 'Sedang Berlangsung (Aktif)' },
          { id: 'SELESAI', label: 'Selesai / Hasil Akhir' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-[#0056b3] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Voting Polls Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-semibold">Belum ada pemungutan suara dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredList.map((item) => {
            const hasVoted = item.userVotedIds?.includes('w-001') || false;
            const total = item.totalVotes || 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        item.status === 'AKTIF'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.status === 'AKTIF' ? '● SE DANG BERLANGSUNG' : 'SELESAI'}
                    </span>
                    <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {item.unit}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{item.judul}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.deskripsi}</p>
                  </div>

                  {/* Options & Progress Bar */}
                  <div className="space-y-2.5 pt-2">
                    {item.opsi.map((opt) => {
                      const percentage = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                      const isSelected = selectedOptionId[item.id] === opt.id;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            if (item.status === 'AKTIF' && !hasVoted) {
                              setSelectedOptionId({ ...selectedOptionId, [item.id]: opt.id });
                            }
                          }}
                          className={`p-3 rounded-xl border transition relative overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'border-[#0056b3] bg-blue-50/50 ring-1 ring-[#0056b3]'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                          }`}
                        >
                          {/* Percentage Fill */}
                          <div
                            className="absolute top-0 left-0 bottom-0 bg-blue-200/40 transition-all duration-500 rounded-xl"
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 font-medium text-slate-900">
                              {item.status === 'AKTIF' && !hasVoted && (
                                <input
                                  type="radio"
                                  name={`vote-${item.id}`}
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="text-[#0056b3] focus:ring-0"
                                />
                              )}
                              <span>{opt.label}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-slate-700 font-bold">
                              <span>{opt.votes} Suara</span>
                              <span className="text-[11px] bg-white border border-slate-200 px-1.5 py-0.2 rounded text-[#0056b3]">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Total: {total} Warga
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Selesai: {item.tglSelesai}
                    </span>
                  </div>

                  {item.status === 'AKTIF' && !hasVoted && (
                    <button
                      onClick={() => handleVoteSubmit(item.id)}
                      className="bg-[#0056b3] hover:bg-[#004494] text-white px-4 py-1.5 rounded-lg font-bold shadow-xs transition cursor-pointer"
                    >
                      Kirim Suara
                    </button>
                  )}

                  {hasVoted && (
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Suara Anda Terdaftar
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE VOTING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Vote className="w-5 h-5 text-[#0056b3]" /> Buat Pemungutan Suara Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoting} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Musyawarah / Polling *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemilihan Lokasi Pos Ronda Baru RT 01..."
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056b3]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deskripsi Singkat *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jelaskan tujuan dan konteks pengambilan keputusan warga..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0056b3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit Pengelenggara *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  >
                    <option value="RT">Pengurus RT 01</option>
                    <option value="RW">Pengurus RW 05</option>
                    <option value="KARANG_TARUNA">Karang Taruna</option>
                    <option value="PKK">Ibu-ibu PKK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Batas Waktu Selesai *</label>
                  <input
                    type="date"
                    required
                    value={tglSelesai}
                    onChange={(e) => setTglSelesai(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-semibold">Pilihan Opsi Suara *</label>
                  <button
                    type="button"
                    onClick={handleAddOpsiInput}
                    className="text-xs text-[#0056b3] font-bold hover:underline cursor-pointer"
                  >
                    + Tambah Opsi
                  </button>
                </div>

                {opsiList.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold w-4 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOpsiChange(idx, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                      placeholder={`Nama Opsi ${idx + 1}`}
                    />
                    {opsiList.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOpsiInput(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0056b3] hover:bg-[#004494] text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Mulai E-Voting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Recycle,
  HeartPulse,
  Award,
  BookOpen,
  Plus,
  CheckCircle2,
  Calendar,
  DollarSign,
  Scale,
  Sparkles,
} from 'lucide-react';
import { SubOrgUnit, SetoranSampah } from '../types';

interface SubOrganisasiViewProps {
  setoranSampahList: SetoranSampah[];
  onAddSetoranSampah: (s: SetoranSampah) => void;
}

export const SubOrganisasiView: React.FC<SubOrganisasiViewProps> = ({
  setoranSampahList = [],
  onAddSetoranSampah,
}) => {
  const [activeUnit, setActiveUnit] = useState<SubOrgUnit>('PKK');

  // Bank Sampah Form State
  const [wargaNama, setWargaNama] = useState('Bambang Supriadi');
  const [jenisSampah, setJenisSampah] = useState('Plastik / Botol PET');
  const [beratKg, setBeratKg] = useState(2.5);
  const [hargaPerKg, setHargaPerKg] = useState(3000);

  const handleAddSetoran = (e: React.FormEvent) => {
    e.preventDefault();
    const total = beratKg * hargaPerKg;
    const newSetoran: SetoranSampah = {
      id: 'sampah-' + Date.now(),
      wargaNama,
      nomorRumah: 'A-01',
      jenisSampah,
      beratKg,
      hargaPerKg,
      totalRupiah: total,
      tanggal: new Date().toISOString().slice(0, 10),
    };
    onAddSetoranSampah(newSetoran);
    setBeratKg(2.5);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Unit Selector */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" /> Ekosistem Sub-Organisasi Lingkungan
          </h2>
          <p className="text-xs text-slate-500">
            Digitalisasi Terintegrasi PKK, Karang Taruna, Posyandu, Linmas & Ronda, DKM, dan Bank Sampah.
          </p>
        </div>

        {/* Sub Org Unit Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
          {[
            { id: 'PKK' as SubOrgUnit, label: 'PKK (Ibu-Ibu)', icon: Users },
            { id: 'KARANG_TARUNA' as SubOrgUnit, label: 'Karang Taruna', icon: Award },
            { id: 'POSYANDU' as SubOrgUnit, label: 'Posyandu (KMS)', icon: HeartPulse },
            { id: 'LINMAS' as SubOrgUnit, label: 'Linmas & Ronda', icon: ShieldAlert },
            { id: 'BANK_SAMPAH' as SubOrgUnit, label: 'Bank Sampah', icon: Recycle },
            { id: 'DKM' as SubOrgUnit, label: 'DKM Al-Ikhlas', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveUnit(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeUnit === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. UNIT PKK */}
      {activeUnit === 'PKK' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-pink-600" /> Program Kerja Utama PKK RW 05
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>1. Pokja I (Penghayatan Pancasila):</strong> Pengajian rutin Dasa Wisma & Gotong Royong.
              </li>
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>2. Pokja II (Pendidikan & Keterampilan):</strong> Pelatihan UMKM Kerajinan Daur Ulang.
              </li>
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>3. Pokja III (Pangan & Sandang):</strong> Pemanfaatan Kebun Tanaman Obat Keluarga (TOGA).
              </li>
              <li className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong>4. Pokja IV (Kesehatan & Lingkungan):</strong> Pendampingan Stunting & Posyandu Lansia.
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Struktur Kepengurusan PKK 2024-2027
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Ketua PKK RW:</span>
                <span className="font-bold text-slate-900">Hj. Siti Nurhaliza</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Sekretaris:</span>
                <span className="font-bold text-slate-900">Ibu Ratna Dewi</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Bendahara:</span>
                <span className="font-bold text-slate-900">Ibu Endang Sriwati</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">Jumlah Kelompok Dasa Wisma:</span>
                <span className="font-mono font-bold text-emerald-700">8 Kelompok</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. UNIT KARANG TARUNA */}
      {activeUnit === 'KARANG_TARUNA' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Award className="w-4 h-4 text-purple-600" /> Karang Taruna Karya Muda RW 05
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <span className="text-purple-800 font-bold">Jumlah Pemuda Terdata:</span>
              <div className="text-xl font-bold text-purple-900 mt-1">42 Orang</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
              <span className="text-emerald-800 font-bold">Kas Karang Taruna:</span>
              <div className="text-xl font-bold text-emerald-900 mt-1">Rp 1.250.000</div>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <span className="text-blue-800 font-bold">Event Terdekat:</span>
              <div className="text-sm font-bold text-blue-900 mt-1">Turnamen Badminton PHBN</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. UNIT POSYANDU */}
      {activeUnit === 'POSYANDU' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <HeartPulse className="w-4 h-4 text-rose-600" /> Posyandu Balita & Lansia "Mekar Sari"
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-rose-50 rounded border border-rose-200">
              <span className="text-rose-800 font-bold">Total Balita:</span>
              <div className="text-xl font-bold text-rose-900 mt-1">38 Anak</div>
            </div>
            <div className="p-3 bg-amber-50 rounded border border-amber-200">
              <span className="text-amber-800 font-bold">Total Lansia:</span>
              <div className="text-xl font-bold text-amber-900 mt-1">24 Orang</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
              <span className="text-emerald-800 font-bold">Jadwal Penimbangan:</span>
              <div className="text-xs font-bold text-emerald-900 mt-1">Minggu ke-2 Setiap Bulan</div>
            </div>
            <div className="p-3 bg-sky-50 rounded border border-sky-200">
              <span className="text-sky-800 font-bold">Status Bebas Stunting:</span>
              <div className="text-xs font-bold text-sky-900 mt-1">98% Terpenuhi (Hijau)</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. UNIT LINMAS & RONDA */}
      {activeUnit === 'LINMAS' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Jadwal Ronda Malam & Pos Kamling RT 01
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Jadwal Petugas Ronda Malam Ini (22:00 - 04:00 WIB)</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Bpk. Bambang Supriadi (Koordinator)</li>
                <li>Bpk. Rudi Hermawan</li>
                <li>Bpk. Agus Santoso</li>
                <li>Bpk. Joko Susilo</li>
              </ul>
            </div>
            <div className="p-3 bg-amber-50 rounded border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Log Panic Button Warga (Simulasi Darurat)
              </h4>
              <p className="text-slate-700">Status Keamanan Lingkungan: <strong>KONDUSIF & AMAN</strong></p>
              <p className="text-[11px] text-slate-500">
                Setiap warga dapat menekan Panic Button di aplikasi jika terjadi gangguan kejahatan / kebakaran.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. UNIT BANK SAMPAH */}
      {activeUnit === 'BANK_SAMPAH' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-600" /> Tabungan Bank Sampah "Graha Asri"
              </h3>
              <p className="text-xs text-slate-500">Pencatatan Penimbangan Sampah Anorganik Warga & Konversi Rupiah.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input Form */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
                Input Setoran Sampah Warga
              </h4>
              <form onSubmit={handleAddSetoran} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Warga *</label>
                  <input
                    type="text"
                    required
                    value={wargaNama}
                    onChange={(e) => setWargaNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Sampah *</label>
                  <select
                    value={jenisSampah}
                    onChange={(e) => setJenisSampah(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium"
                  >
                    <option value="Plastik / Botol PET">Plastik / Botol PET (Rp 3.000/kg)</option>
                    <option value="Kardus & Kertas">Kardus & Kertas Bekas (Rp 2.000/kg)</option>
                    <option value="Besi / Kaleng">Besi / Kaleng Alumunium (Rp 5.000/kg)</option>
                    <option value="Minyak Jelantah">Minyak Jelantah (Rp 6.000/liter)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Berat (Kg)</label>
                    <input
                      type="number"
                      step={0.5}
                      required
                      value={beratKg}
                      onChange={(e) => setBeratKg(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Harga / Kg</label>
                    <input
                      type="number"
                      required
                      value={hargaPerKg}
                      onChange={(e) => setHargaPerKg(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                    />
                  </div>
                </div>

                <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-center font-bold text-emerald-800 text-xs">
                  Total Rupiah: Rp {(beratKg * hargaPerKg).toLocaleString('id-ID')}
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded font-bold shadow-xs"
                >
                  Simpan Setoran
                </button>
              </form>
            </div>

            {/* Setoran Table */}
            <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                Riwayat Setoran Bank Sampah
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                      <th className="p-2.5 border-b border-slate-200">Tanggal</th>
                      <th className="p-2.5 border-b border-slate-200">Warga</th>
                      <th className="p-2.5 border-b border-slate-200">Jenis</th>
                      <th className="p-2.5 border-b border-slate-200">Berat</th>
                      <th className="p-2.5 border-b border-slate-200 text-right">Saldo (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {setoranSampahList.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-slate-600">{s.tanggal}</td>
                        <td className="p-2.5 font-bold text-slate-900">{s.wargaNama} ({s.nomorRumah})</td>
                        <td className="p-2.5 text-slate-700">{s.jenisSampah}</td>
                        <td className="p-2.5 font-mono font-semibold">{s.beratKg} kg</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                          + Rp {s.totalRupiah.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. UNIT DKM MASJID */}
      {activeUnit === 'DKM' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-emerald-600" /> DKM Masjid Al-Ikhlas RW 05
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
              <span className="text-emerald-800 font-bold">Kas Infaq & Sedekah:</span>
              <div className="text-xl font-bold text-emerald-900 mt-1">Rp 12.450.000</div>
            </div>
            <div className="p-3 bg-amber-50 rounded border border-amber-200">
              <span className="text-amber-800 font-bold">Kajian Rutin Pekanan:</span>
              <div className="text-xs font-bold text-amber-900 mt-1">Setiap Malam Sabtu Ba'da Maghrib</div>
            </div>
            <div className="p-3 bg-sky-50 rounded border border-sky-200">
              <span className="text-sky-800 font-bold">Imam & Muadzin Tetap:</span>
              <div className="text-xs font-bold text-sky-900 mt-1">Ust. Abdul Rasyid</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Menu,
  ChevronDown,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedRt?: string;
  onRtChange?: (rt: string) => void;
  onOpenEncryptionModal?: () => void;
  onToggleSidebarMobile?: () => void;
  pendingSuratCount?: number;
  pendingAduanCount?: number;
}

const ROLES_LIST: { role: UserRole; label: string; badge: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Administrator', badge: 'bg-red-700 text-white' },
  { role: 'KETUA_RW', label: 'Ketua RW 05', badge: 'bg-[#0056b3] text-white' },
  { role: 'SEKRETARIS_RW', label: 'Sekretaris RW 05', badge: 'bg-blue-700 text-white' },
  { role: 'BENDAHARA_RW', label: 'Bendahara RW 05', badge: 'bg-blue-600 text-white' },
  { role: 'KETUA_RT', label: 'Ketua RT 01', badge: 'bg-emerald-800 text-white' },
  { role: 'SEKRETARIS_RT', label: 'Sekretaris RT 01', badge: 'bg-emerald-700 text-white' },
  { role: 'BENDAHARA_RT', label: 'Bendahara RT 01', badge: 'bg-emerald-600 text-white' },
  { role: 'PKK', label: 'Pengurus PKK', badge: 'bg-pink-700 text-white' },
  { role: 'KARANG_TARUNA', label: 'Karang Taruna', badge: 'bg-amber-700 text-white' },
  { role: 'POSYANDU', label: 'Kader Posyandu', badge: 'bg-teal-700 text-white' },
  { role: 'BANK_SAMPAH', label: 'Pengelola Bank Sampah', badge: 'bg-green-700 text-white' },
  { role: 'LINMAS', label: 'Tim Linmas / Keamanan', badge: 'bg-slate-700 text-white' },
  { role: 'DKM', label: 'Pengurus DKM Al-Ikhlas', badge: 'bg-indigo-700 text-white' },
  { role: 'WARGA', label: 'Warga / Penduduk', badge: 'bg-gray-700 text-white' },
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedRt = 'ALL',
  onRtChange = (_rt?: string) => {},
  onOpenEncryptionModal = () => {},
  onToggleSidebarMobile = () => {},
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeRoleObj = ROLES_LIST.find((r) => r.role === currentRole) || ROLES_LIST[0];

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-900 border-b-2 border-slate-900 sticky top-0 z-30 shadow-[0_3px_0_0_#0f172a] w-full">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 bg-[#0056b3] text-white flex items-center justify-center font-black text-sm rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              SW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Satu<span className="text-[#0056b3]">Warga.id</span>
                </span>
                <span className="text-[10px] bg-amber-300 text-slate-900 border-2 border-slate-900 px-2 py-0.5 rounded-full font-extrabold uppercase shadow-[1px_1px_0px_0px_#0f172a]">
                  ERP Warga
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 hidden sm:block">
                Sistem Informasi Pengelolaan Warga Sukamaju
              </p>
            </div>
          </div>
        </div>

        {/* Center: RT/RW Filter Context */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-xs">
          <Building className="w-4 h-4 text-[#0056b3]" />
          <span className="text-slate-900 font-extrabold">Wilayah:</span>
          <select
            value={selectedRt}
            onChange={(e) => onRtChange(e.target.value)}
            className="bg-white border-2 border-slate-900 text-slate-900 rounded-lg px-2 py-0.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#0056b3] cursor-pointer"
          >
            <option value="ALL">Semua RT (RT 01 - 10 / RW 01 - 30)</option>
            <option value="01">RT 01</option>
            <option value="02">RT 02</option>
            <option value="03">RT 03</option>
            <option value="04">RT 04</option>
            <option value="05">RT 05</option>
            <option value="06">RT 06</option>
            <option value="07">RT 07</option>
            <option value="08">RT 08</option>
            <option value="09">RT 09</option>
            <option value="10">RT 10</option>
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Encryption Status Badge */}
          <button
            onClick={onOpenEncryptionModal}
            className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 border-2 border-slate-900 text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Sistem Enkripsi Data Warga Aktif"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span className="hidden xl:inline font-mono font-extrabold text-[11px] text-emerald-950">E2E Secured</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#0056b3]" />
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-900 ${activeRoleObj.badge}`}>
                {activeRoleObj.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-900" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_0px_#0f172a] py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b-2 border-slate-900 font-extrabold text-slate-900 uppercase tracking-wider text-[10px] bg-amber-100 rounded-t-xl flex items-center justify-between">
                  <span>Pilih Hak Akses / Peran</span>
                  <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-900">14 Peran</span>
                </div>
                <div className="max-h-72 overflow-y-auto p-1 space-y-1">
                  {ROLES_LIST.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        onRoleChange(item.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-100 transition cursor-pointer ${
                        currentRole === item.role ? 'bg-slate-100 font-extrabold border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : 'font-medium'
                      }`}
                    >
                      <span className="text-slate-900 flex items-center gap-1.5">
                        {currentRole === item.role && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {item.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border border-slate-900 ${item.badge}`}>
                        {item.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


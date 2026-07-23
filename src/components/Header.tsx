import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Search,
  Bot,
  Sparkles,
  Wifi,
  FileText,
  AlertCircle,
  Menu,
  ChevronDown,
  Building,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedRt?: string;
  onRtChange?: (rt: string) => void;
  onOpenAiAssistant: () => void;
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
  onOpenAiAssistant,
  onOpenEncryptionModal = () => {},
  onToggleSidebarMobile = () => {},
  pendingSuratCount = 0,
  pendingAduanCount = 0,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeRoleObj = ROLES_LIST.find((r) => r.role === currentRole) || ROLES_LIST[0];

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-30 shadow-xs w-full">
      <div className="w-full px-4 sm:px-6 h-15 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded focus:outline-none"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 bg-[#0056b3] text-white flex items-center justify-center font-bold text-sm rounded shadow-xs">
              SW
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Satu<span className="text-[#17a2b8]">Warga.id</span>
                </span>
                <span className="text-[10px] bg-[#f8f9fa] text-slate-600 border border-[#dee2e6] px-1.5 py-0.5 rounded font-mono uppercase">
                  v1.0 ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Community Operating System RT 01-05 / RW 05
              </p>
            </div>
          </div>
        </div>

        {/* Center: RT/RW Filter Context & Search */}
        <div className="hidden lg:flex items-center gap-2 bg-[#f8f9fa] px-3 py-1 rounded border border-[#dee2e6] text-xs">
          <Building className="w-4 h-4 text-[#0056b3]" />
          <span className="text-slate-600 font-semibold">Wilayah:</span>
          <select
            value={selectedRt}
            onChange={(e) => onRtChange(e.target.value)}
            className="bg-white border border-[#dee2e6] text-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-[#0056b3] font-medium"
          >
            <option value="ALL">Semua RT (RW 05)</option>
            <option value="01">RT 01</option>
            <option value="02">RT 02</option>
            <option value="03">RT 03</option>
            <option value="04">RT 04</option>
            <option value="05">RT 05</option>
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Encryption Status Badge */}
          <button
            onClick={onOpenEncryptionModal}
            className="flex items-center gap-1.5 bg-[#f8f9fa] hover:bg-slate-100 border border-[#dee2e6] text-slate-700 px-2.5 py-1.5 rounded text-xs transition"
            title="Sistem Enkripsi End-to-End Data Warga Aktif"
          >
            <ShieldCheck className="w-4 h-4 text-[#28a745]" />
            <span className="hidden xl:inline font-mono font-semibold text-[11px] text-slate-600">E2E Encrypted</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 bg-[#0056b3] hover:bg-[#004494] text-white px-3 py-1.5 rounded text-xs font-medium shadow-xs transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Asisten Warga</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-[#f8f9fa] hover:bg-slate-100 border border-[#dee2e6] text-slate-700 px-3 py-1.5 rounded text-xs transition"
            >
              <UserCheck className="w-4 h-4 text-[#0056b3]" />
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${activeRoleObj.badge}`}>
                {activeRoleObj.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#dee2e6] rounded shadow-lg py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-[#dee2e6] font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Ganti Hak Akses / Peran
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {ROLES_LIST.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        onRoleChange(item.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition ${
                        currentRole === item.role ? 'bg-slate-100 font-bold border-l-3 border-[#0056b3]' : ''
                      }`}
                    >
                      <span className="text-slate-800">{item.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${item.badge}`}>
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

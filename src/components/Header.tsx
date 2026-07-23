import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Menu,
  ChevronDown,
  Building,
  CheckCircle2,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Users,
  FileText,
  Wallet,
  X,
  ArrowRight,
} from 'lucide-react';
import { UserRole, Warga, KartuKeluarga, TransaksiKas, ActiveTab } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedRw?: string;
  onRwChange?: (rw: string) => void;
  selectedRt?: string;
  onRtChange?: (rt: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isSidebarCollapsedDesktop?: boolean;
  onToggleSidebar?: () => void;
  onOpenEncryptionModal?: () => void;
  pendingSuratCount?: number;
  pendingAduanCount?: number;

  // Global Search Props
  wargaList?: Warga[];
  kkList?: KartuKeluarga[];
  kasList?: TransaksiKas[];
  onSelectSearchResult?: (tab: ActiveTab, searchKey?: string) => void;
}

const ROLES_LIST: { role: UserRole; label: string; badge: string; group: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Administrator', badge: 'bg-red-700 text-white', group: 'Sistem Admin' },
  
  // Pengurus RW
  { role: 'KETUA_RW', label: 'Ketua RW', badge: 'bg-[#0056b3] text-white', group: 'Pengurus RW' },
  { role: 'WAKIL_KETUA_RW', label: 'Wakil Ketua RW', badge: 'bg-blue-800 text-white', group: 'Pengurus RW' },
  { role: 'SEKRETARIS_RW', label: 'Sekretaris RW', badge: 'bg-blue-700 text-white', group: 'Pengurus RW' },
  { role: 'WAKIL_SEKRETARIS_RW', label: 'Wakil Sekretaris RW', badge: 'bg-blue-600 text-white', group: 'Pengurus RW' },
  { role: 'BENDAHARA_RW', label: 'Bendahara RW', badge: 'bg-blue-600 text-white', group: 'Pengurus RW' },
  { role: 'WAKIL_BENDAHARA_RW', label: 'Wakil Bendahara RW', badge: 'bg-blue-500 text-white', group: 'Pengurus RW' },

  // Pengurus RT
  { role: 'KETUA_RT', label: 'Ketua RT', badge: 'bg-emerald-800 text-white', group: 'Pengurus RT' },
  { role: 'WAKIL_KETUA_RT', label: 'Wakil Ketua RT', badge: 'bg-emerald-700 text-white', group: 'Pengurus RT' },
  { role: 'SEKRETARIS_RT', label: 'Sekretaris RT', badge: 'bg-emerald-700 text-white', group: 'Pengurus RT' },
  { role: 'WAKIL_SEKRETARIS_RT', label: 'Wakil Sekretaris RT', badge: 'bg-emerald-600 text-white', group: 'Pengurus RT' },
  { role: 'BENDAHARA_RT', label: 'Bendahara RT', badge: 'bg-emerald-600 text-white', group: 'Pengurus RT' },
  { role: 'WAKIL_BENDAHARA_RT', label: 'Wakil Bendahara RT', badge: 'bg-emerald-500 text-white', group: 'Pengurus RT' },

  // Lembaga & Sub-Organisasi
  { role: 'KETUA_PKK', label: 'Ketua PKK', badge: 'bg-pink-700 text-white', group: 'Lembaga Warga' },
  { role: 'PENGURUS_PKK', label: 'Pengurus PKK', badge: 'bg-pink-600 text-white', group: 'Lembaga Warga' },
  { role: 'KETUA_KARANG_TARUNA', label: 'Ketua Karang Taruna', badge: 'bg-amber-700 text-white', group: 'Lembaga Warga' },
  { role: 'PENGURUS_KARANG_TARUNA', label: 'Pengurus Karang Taruna', badge: 'bg-amber-600 text-white', group: 'Lembaga Warga' },
  { role: 'POSYANDU', label: 'Kader Posyandu', badge: 'bg-teal-700 text-white', group: 'Lembaga Warga' },
  { role: 'BANK_SAMPAH', label: 'Pengelola Bank Sampah', badge: 'bg-green-700 text-white', group: 'Lembaga Warga' },
  { role: 'LINMAS', label: 'Tim Linmas / Keamanan', badge: 'bg-slate-700 text-white', group: 'Lembaga Warga' },
  { role: 'KETUA_DKM', label: 'Ketua DKM Masjid/Musholla', badge: 'bg-indigo-800 text-white', group: 'Lembaga Warga' },
  { role: 'PENGURUS_DKM', label: 'Pengurus DKM', badge: 'bg-indigo-700 text-white', group: 'Lembaga Warga' },

  // Warga
  { role: 'WARGA', label: 'Warga / Penduduk', badge: 'bg-gray-700 text-white', group: 'Warga' },
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedRw = 'ALL',
  onRwChange = () => {},
  selectedRt = 'ALL',
  onRtChange = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {},
  isSidebarCollapsedDesktop = false,
  onToggleSidebar = () => {},
  onOpenEncryptionModal = () => {},
  wargaList = [],
  kkList = [],
  kasList = [],
  onSelectSearchResult = (_tab?: ActiveTab, _key?: string) => {},
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const activeRoleObj = ROLES_LIST.find((r) => r.role === currentRole) || ROLES_LIST[0];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Search Results
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const hasMinQuery = trimmedQuery.length >= 2;

  const matchedWarga = hasMinQuery
    ? wargaList.filter(
        (w) =>
          w.nama.toLowerCase().includes(trimmedQuery) ||
          w.nik.includes(trimmedQuery) ||
          w.nomorRumah.toLowerCase().includes(trimmedQuery)
      ).slice(0, 4)
    : [];

  const matchedKk = hasMinQuery
    ? kkList.filter(
        (k) =>
          k.nomorKk.includes(trimmedQuery) ||
          k.namaKepalaKeluarga.toLowerCase().includes(trimmedQuery)
      ).slice(0, 3)
    : [];

  const matchedKas = hasMinQuery
    ? kasList.filter(
        (k) =>
          k.id.toLowerCase().includes(trimmedQuery) ||
          k.keterangan.toLowerCase().includes(trimmedQuery) ||
          k.kategori.toLowerCase().includes(trimmedQuery)
      ).slice(0, 3)
    : [];

  const totalResults = matchedWarga.length + matchedKk.length + matchedKas.length;

  const handleItemClick = (tab: ActiveTab, key?: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onSelectSearchResult(tab, key);
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 dark:text-slate-100 backdrop-blur-md text-slate-900 border-b-2 border-slate-900 dark:border-slate-800 sticky top-0 z-30 shadow-[0_3px_0_0_#0f172a] dark:shadow-[0_3px_0_0_#000000] w-full transition-colors">
      <div className="w-full px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Sidebar Toggle & Brand Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Buka / Tutup Sidebar Navigation"
          >
            {isSidebarCollapsedDesktop ? (
              <PanelLeftOpen className="w-5 h-5 text-[#0056b3] dark:text-blue-400" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            )}
          </button>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 bg-[#0056b3] text-white flex items-center justify-center font-black text-sm rounded-xl border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000]">
              SW
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  Satu<span className="text-[#0056b3] dark:text-blue-400">Warga.id</span>
                </span>
                <span className="text-[9px] sm:text-[10px] bg-amber-300 dark:bg-amber-400 text-slate-900 border-2 border-slate-900 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full font-extrabold uppercase shadow-[1px_1px_0px_0px_#0f172a]">
                  Sukamaju
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden lg:block">
                Sistem Informasi Pengelolaan Warga Sukamaju
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Cari Warga, NIK, KK, atau Transaksi..."
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-900 dark:border-slate-700 rounded-xl pl-9 pr-8 py-1.5 text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:ring-2 focus:ring-[#0056b3] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && hasMinQuery && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000000] p-2 z-50 max-h-96 overflow-y-auto text-xs space-y-3">
              <div className="px-2 py-1 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                <span>Hasil Pencarian Global ({totalResults})</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                  "{searchQuery}"
                </span>
              </div>

              {totalResults === 0 ? (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs">
                  Tidak ada data Warga, KK, atau Transaksi yang cocok dengan keyword.
                </div>
              ) : (
                <>
                  {/* Category: Warga */}
                  {matchedWarga.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Data Warga ({matchedWarga.length})
                      </div>
                      {matchedWarga.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => handleItemClick('master-data', w.nama)}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#0056b3] dark:group-hover:text-blue-400">
                              {w.nama}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              NIK: {w.nik} • RT {w.rt}/RW {w.rw} • Rumah {w.nomorRumah}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Category: Kartu Keluarga */}
                  {matchedKk.length > 0 && (
                    <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-2">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Kartu Keluarga ({matchedKk.length})
                      </div>
                      {matchedKk.map((k) => (
                        <button
                          key={k.id}
                          onClick={() => handleItemClick('master-data', k.nomorKk)}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#0056b3] dark:group-hover:text-blue-400">
                              No. KK: {k.nomorKk}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              Kepala Keluarga: {k.namaKepalaKeluarga} • RT {k.rt}/RW {k.rw}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Category: Transaksi Kas */}
                  {matchedKas.length > 0 && (
                    <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-2">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5" /> Transaksi Kas ({matchedKas.length})
                      </div>
                      {matchedKas.map((k) => (
                        <button
                          key={k.id}
                          onClick={() => handleItemClick('keuangan', k.keterangan)}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#0056b3] dark:group-hover:text-blue-400">
                              {k.kategori}: {k.keterangan}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              {k.jenis} • Rp {k.jumlah.toLocaleString('id-ID')} • Unit: {k.unitKas}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Dark Mode, Encryption, Role Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dark / Light Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-amber-300 rounded-xl border-2 border-slate-900 dark:border-slate-700 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title={isDarkMode ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-extrabold hidden sm:inline text-amber-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-800 shrink-0" />
                <span className="text-[11px] font-extrabold hidden sm:inline text-slate-800">Dark</span>
              </>
            )}
          </button>

          {/* Encryption Status Badge */}
          <button
            onClick={onOpenEncryptionModal}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 border-2 border-slate-900 dark:border-emerald-700 text-slate-900 dark:text-emerald-300 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Sistem Enkripsi Data Warga Sukamaju Active"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0" />
            <span className="hidden xl:inline font-mono font-extrabold text-[11px]">E2E Secured</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#0056b3] dark:text-blue-400 shrink-0" />
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-900 truncate max-w-[110px] sm:max-w-none ${activeRoleObj.badge}`}>
                {activeRoleObj.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-900 dark:text-slate-200 shrink-0" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] dark:shadow-[6px_6px_0px_0px_#000000] py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b-2 border-slate-900 dark:border-slate-800 font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] bg-amber-100 dark:bg-amber-950/80 rounded-t-xl flex items-center justify-between">
                  <span>Pilih Hak Akses Pengurus & Warga</span>
                  <span className="text-[9px] font-mono bg-white dark:bg-slate-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-slate-900">
                    23 Peran Lengkap
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto p-1.5 space-y-3">
                  {['Sistem Admin', 'Pengurus RW', 'Pengurus RT', 'Lembaga Warga', 'Warga'].map((groupName) => {
                    const groupRoles = ROLES_LIST.filter((r) => r.group === groupName);
                    if (groupRoles.length === 0) return null;

                    return (
                      <div key={groupName} className="space-y-1">
                        <div className="px-2 pt-1 text-[10px] font-mono font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                          {groupName}
                        </div>
                        {groupRoles.map((item) => (
                          <button
                            key={item.role}
                            onClick={() => {
                              onRoleChange(item.role);
                              setRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                              currentRole === item.role
                                ? 'bg-slate-100 dark:bg-slate-800 font-extrabold border-2 border-slate-900 dark:border-slate-600 shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#000000]'
                                : 'font-medium'
                            }`}
                          >
                            <span className="text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                              {currentRole === item.role && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                              {item.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border border-slate-900 ${item.badge}`}>
                              {item.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



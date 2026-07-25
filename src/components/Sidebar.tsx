import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Wallet,
  Receipt,
  Calendar,
  Package,
  AlertTriangle,
  Recycle,
  FolderOpen,
  Vote,
  BarChart3,
  Settings,
  Bell,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Bot,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'asisten-ai'
  | 'master-data'
  | 'administrasi'
  | 'keuangan'
  | 'iuran'
  | 'kegiatan'
  | 'inventaris'
  | 'bank-sampah'
  | 'sosial-aduan'
  | 'aduan-warga'
  | 'pengumuman'
  | 'voting'
  | 'dokumen-proposal'
  | 'statistik'
  | 'pengaturan';

export function getAllowedTabsForRole(role: UserRole): ActiveTab[] {
  const commonTabs: ActiveTab[] = ['asisten-ai'];
  switch (role) {
    case 'SUPER_ADMIN':
    case 'KETUA_RW':
    case 'WAKIL_KETUA_RW':
    case 'SEKRETARIS_RW':
    case 'WAKIL_SEKRETARIS_RW':
      return [
        'dashboard',
        ...commonTabs,
        'master-data',
        'administrasi',
        'keuangan',
        'iuran',
        'aduan-warga',
        'pengumuman',
        'voting',
        'kegiatan',
        'inventaris',
        'dokumen-proposal',
        'pengaturan',
      ];

    case 'BENDAHARA_RW':
    case 'WAKIL_BENDAHARA_RW':
      return [
        'dashboard',
        ...commonTabs,
        'keuangan',
        'iuran',
        'dokumen-proposal',
        'pengumuman',
        'kegiatan',
        'pengaturan',
      ];

    case 'KETUA_RT':
    case 'WAKIL_KETUA_RT':
    case 'SEKRETARIS_RT':
    case 'WAKIL_SEKRETARIS_RT':
      return [
        'dashboard',
        ...commonTabs,
        'master-data',
        'administrasi',
        'iuran',
        'aduan-warga',
        'pengumuman',
        'voting',
        'kegiatan',
        'dokumen-proposal',
        'pengaturan',
      ];

    case 'BENDAHARA_RT':
    case 'WAKIL_BENDAHARA_RT':
      return [
        'dashboard',
        ...commonTabs,
        'keuangan',
        'iuran',
        'dokumen-proposal',
        'pengumuman',
        'pengaturan',
      ];

    case 'KETUA_PKK':
    case 'PENGURUS_PKK':
      return [
        'dashboard',
        ...commonTabs,
        'kegiatan',
        'inventaris',
        'pengumuman',
        'voting',
        'dokumen-proposal',
      ];

    case 'KETUA_KARANG_TARUNA':
    case 'PENGURUS_KARANG_TARUNA':
      return [
        'dashboard',
        ...commonTabs,
        'kegiatan',
        'inventaris',
        'aduan-warga',
        'pengumuman',
        'voting',
        'dokumen-proposal',
      ];

    case 'POSYANDU':
      return [
        'dashboard',
        ...commonTabs,
        'master-data',
        'kegiatan',
        'pengumuman',
        'dokumen-proposal',
      ];

    case 'BANK_SAMPAH':
      return [
        'dashboard',
        ...commonTabs,
        'inventaris',
        'keuangan',
        'pengumuman',
        'dokumen-proposal',
      ];

    case 'LINMAS':
      return [
        'dashboard',
        ...commonTabs,
        'aduan-warga',
        'pengumuman',
        'kegiatan',
      ];

    case 'KETUA_DKM':
    case 'PENGURUS_DKM':
      return [
        'dashboard',
        ...commonTabs,
        'kegiatan',
        'keuangan',
        'inventaris',
        'pengumuman',
      ];

    case 'WARGA':
    default:
      return [
        'dashboard',
        ...commonTabs,
        'administrasi',
        'iuran',
        'aduan-warga',
        'pengumuman',
        'voting',
        'kegiatan',
      ];
  }
}

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  KETUA_RW: 'Ketua RW',
  WAKIL_KETUA_RW: 'Wakil Ketua RW',
  SEKRETARIS_RW: 'Sekretaris RW',
  WAKIL_SEKRETARIS_RW: 'Wakil Sek. RW',
  BENDAHARA_RW: 'Bendahara RW',
  WAKIL_BENDAHARA_RW: 'Wakil Ben. RW',
  KETUA_RT: 'Ketua RT',
  WAKIL_KETUA_RT: 'Wakil Ketua RT',
  SEKRETARIS_RT: 'Sekretaris RT',
  WAKIL_SEKRETARIS_RT: 'Wakil Sek. RT',
  BENDAHARA_RT: 'Bendahara RT',
  WAKIL_BENDAHARA_RT: 'Wakil Ben. RT',
  KETUA_PKK: 'Ketua PKK',
  PENGURUS_PKK: 'Pengurus PKK',
  KETUA_KARANG_TARUNA: 'Ketua Karang Taruna',
  PENGURUS_KARANG_TARUNA: 'Pengurus Karang Taruna',
  POSYANDU: 'Kader Posyandu',
  BANK_SAMPAH: 'Bank Sampah',
  LINMAS: 'Tim Linmas',
  KETUA_DKM: 'Ketua DKM',
  PENGURUS_DKM: 'Pengurus DKM',
  WARGA: 'Warga / Penduduk',
};

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop?: boolean;
  onToggleCollapseDesktop?: () => void;
  pendingSuratCount: number;
  pendingAduanCount: number;
  unpaidIuranCount: number;
  currentRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop = false,
  onToggleCollapseDesktop = () => {},
  pendingSuratCount,
  pendingAduanCount,
  unpaidIuranCount,
  currentRole = 'KETUA_RW',
}) => {
  const allowedTabs = getAllowedTabsForRole(currentRole as UserRole);

  const rawNavItems = [
    {
      group: 'UTAMA',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard Utama', icon: LayoutDashboard },
        {
          id: 'asisten-ai' as ActiveTab,
          label: 'Asisten AI Warga',
          icon: Sparkles,
          badge: 'AI',
          badgeColor: 'bg-gradient-to-r from-sky-400 to-blue-600 text-white border border-sky-300 font-extrabold',
        },
      ],
    },
    {
      group: 'MASTER DATA',
      items: [
        { id: 'master-data' as ActiveTab, label: 'Data Warga & KK', icon: Users },
      ],
    },
    {
      group: 'OPERASIONAL & KEUANGAN',
      items: [
        {
          id: 'administrasi' as ActiveTab,
          label: 'Surat Menyurat',
          icon: FileCheck,
          badge: pendingSuratCount > 0 ? pendingSuratCount : undefined,
          badgeColor: 'bg-amber-400 text-slate-900 border-2 border-slate-900',
        },
        { id: 'keuangan' as ActiveTab, label: 'Kas & Keuangan', icon: Wallet },
        {
          id: 'iuran' as ActiveTab,
          label: 'Iuran Warga & QRIS',
          icon: Receipt,
          badge: unpaidIuranCount > 0 ? unpaidIuranCount : undefined,
          badgeColor: 'bg-rose-400 text-slate-900 border-2 border-slate-900',
        },
      ],
    },
    {
      group: 'LAYANAN & ASPIRASI',
      items: [
        {
          id: 'aduan-warga' as ActiveTab,
          label: 'Aduan Warga',
          icon: AlertTriangle,
          badge: pendingAduanCount > 0 ? pendingAduanCount : undefined,
          badgeColor: 'bg-red-500 text-white border-2 border-slate-900',
        },
        { id: 'pengumuman' as ActiveTab, label: 'Pengumuman', icon: Bell },
        { id: 'voting' as ActiveTab, label: 'E-Voting', icon: Vote },
      ],
    },
    {
      group: 'KEGIATAN & ORGANISASI',
      items: [
        { id: 'kegiatan' as ActiveTab, label: 'Kegiatan & Notulen', icon: Calendar },
        { id: 'inventaris' as ActiveTab, label: 'Inventarisasi', icon: Package },
      ],
    },
    {
      group: 'DOKUMEN & PRODUKTIVITAS',
      items: [
        { id: 'dokumen-proposal' as ActiveTab, label: 'Dokumen & Proposal', icon: FolderOpen },
      ],
    },
    {
      group: 'SISTEM',
      items: [
        { id: 'pengaturan' as ActiveTab, label: 'Pengaturan', icon: Settings },
      ],
    },
  ];

  // Auto-filter menus based on the currentRole
  const filteredNavItems = rawNavItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => allowedTabs.includes(item.id)),
    }))
    .filter((group) => group.items.length > 0);

  const handleSelect = (id: ActiveTab) => {
    onTabChange(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 border-r-2 border-slate-900 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
          isCollapsedDesktop ? 'lg:w-20' : 'lg:w-64'
        } ${
          isOpenMobile
            ? 'translate-x-0 w-64'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Controls: Mobile Close & Desktop Collapse Button */}
        <div className="p-3 border-b-2 border-slate-800 bg-slate-950/90 backdrop-blur-md flex items-center justify-between gap-2">
          <div className={`flex flex-col gap-1 min-w-0 ${isCollapsedDesktop ? 'lg:hidden' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white font-black text-xs flex items-center justify-center border border-sky-400 shrink-0">
                ER
              </div>
              <span className="font-extrabold text-sm uppercase tracking-wider text-white truncate">
                E-<span className="text-sky-400">REKAP</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold w-fit">
              <UserCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{ROLE_DISPLAY_NAMES[currentRole as UserRole] || currentRole}</span>
            </div>
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleCollapseDesktop}
            className="hidden lg:flex items-center justify-center p-1.5 bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer shrink-0"
            title={isCollapsedDesktop ? 'Buka Sidebar' : 'Tutup / Ciutkan Sidebar'}
          >
            {isCollapsedDesktop ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 cursor-pointer lg:hidden shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Items with Custom High Contrast Scrollbar */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar p-2 sm:p-3 space-y-4">
          {filteredNavItems.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              {!isCollapsedDesktop && (
                <div className="px-2 pt-1 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono hidden lg:flex">
                  <span>{group.group}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      title={item.label}
                      className={`w-full flex items-center ${
                        isCollapsedDesktop ? 'lg:justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
                      } rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0056b3] to-[#0284c7] text-white border-2 border-white shadow-[3px_3px_0px_0px_#ffffff] -translate-x-0.5'
                          : 'text-slate-300 hover:bg-slate-800/90 hover:text-white border border-transparent hover:border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? 'bg-white/20 text-amber-300'
                              : 'bg-slate-800/60 text-slate-400 group-hover:bg-slate-700 group-hover:text-amber-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`truncate ${isCollapsedDesktop ? 'lg:hidden' : ''}`}>
                          {item.label}
                        </span>
                      </div>

                      {/* Badge in expanded mode */}
                      {item.badge !== undefined && !isCollapsedDesktop && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Badge indicator dot in collapsed mode */}
                      {item.badge !== undefined && isCollapsedDesktop && (
                        <span className="hidden lg:block absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-slate-900 animate-bounce">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sidebar Status */}
        <div className="p-3 border-t-2 border-slate-800 bg-slate-950 text-slate-400 text-xs space-y-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <span className={`font-extrabold text-white text-xs flex items-center gap-1.5 ${isCollapsedDesktop ? 'lg:hidden' : ''}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              E-REKAP System
            </span>
            <span className="text-[9px] bg-sky-400 text-slate-950 font-extrabold font-mono px-1.5 py-0.5 rounded border border-slate-900 mx-auto lg:mx-0">
              v2.0
            </span>
          </div>
          {!isCollapsedDesktop && (
            <p className="text-[10px] text-slate-400 leading-tight hidden lg:block font-medium">
              Sistem E-REKAP Pengelolaan Warga Sukamaju
            </p>
          )}
        </div>
      </aside>
    </>
  );
};



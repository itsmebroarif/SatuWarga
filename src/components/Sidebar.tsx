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
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
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

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingSuratCount: number;
  pendingAduanCount: number;
  unpaidIuranCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  pendingSuratCount,
  pendingAduanCount,
  unpaidIuranCount,
}) => {
  const navItems = [
    {
      group: 'UTAMA',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard Utama', icon: LayoutDashboard },
      ],
    },
    {
      group: 'MASTER DATA',
      items: [
        { id: 'master-data' as ActiveTab, label: 'Data Warga, KK & Rumah', icon: Users },
      ],
    },
    {
      group: 'OPERASIONAL & KEUANGAN',
      items: [
        {
          id: 'administrasi' as ActiveTab,
          label: 'Surat Menyurat Warga',
          icon: FileCheck,
          badge: pendingSuratCount > 0 ? pendingSuratCount : undefined,
          badgeColor: 'bg-amber-400 text-slate-900 border-2 border-slate-900',
        },
        { id: 'keuangan' as ActiveTab, label: 'Kas & Keuangan Multi-Unit', icon: Wallet },
        {
          id: 'iuran' as ActiveTab,
          label: 'Iuran Warga & Payment QRIS',
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
          label: 'Aduan & Keluhan Warga',
          icon: AlertTriangle,
          badge: pendingAduanCount > 0 ? pendingAduanCount : undefined,
          badgeColor: 'bg-red-500 text-white border-2 border-slate-900',
        },
        { id: 'pengumuman' as ActiveTab, label: 'Pengumuman Lingkungan', icon: Bell },
        { id: 'voting' as ActiveTab, label: 'E-Voting & Musyawarah', icon: Vote },
      ],
    },
    {
      group: 'KEGIATAN & ORGANISASI',
      items: [
        { id: 'kegiatan' as ActiveTab, label: 'Kegiatan & Notulensi', icon: Calendar },
        { id: 'inventaris' as ActiveTab, label: 'Inventaris & Peminjaman', icon: Package },
        { id: 'bank-sampah' as ActiveTab, label: 'Bank Sampah Lingkungan', icon: Recycle },
      ],
    },
    {
      group: 'DOKUMEN & PRODUKTIVITAS',
      items: [
        { id: 'dokumen-proposal' as ActiveTab, label: 'Arsip & Proposal Kegiatan', icon: FolderOpen },
        { id: 'statistik' as ActiveTab, label: 'Statistik Demografi', icon: BarChart3 },
      ],
    },
    {
      group: 'SISTEM',
      items: [
        { id: 'pengaturan' as ActiveTab, label: 'Pengaturan & Enkripsi', icon: Settings },
      ],
    },
  ];

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

      {/* Sidebar Container - Pinned Flush Left */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-100 border-r-2 border-slate-900 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-800 lg:hidden bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm uppercase tracking-wider text-white">
              Satu<span className="text-[#0056b3]">Warga.id</span>
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0056b3] text-white border-2 border-white shadow-[3px_3px_0px_0px_#ffffff] -translate-x-0.5'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:border border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-amber-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${item.badgeColor}`}
                        >
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
        <div className="p-3 border-t-2 border-slate-800 bg-slate-950 text-slate-400 text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
SUKAMAJU ERP
            </span>
            <span className="text-[9px] bg-amber-300 text-slate-900 font-extrabold font-mono px-1.5 py-0.5 rounded border border-slate-900">
              v1.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Sistem Kelola Mandiri RT/RW & Lembaga Warga.
          </p>
        </div>
      </aside>
    </>
  );
};


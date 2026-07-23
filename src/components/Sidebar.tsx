import React from 'react';
import {
  LayoutDashboard,
  Users,
  Home,
  FileCheck,
  Wallet,
  Receipt,
  Calendar,
  BookOpen,
  Package,
  AlertTriangle,
  Recycle,
  FolderOpen,
  Vote,
  Sparkles,
  BarChart3,
  Settings,
  Bell,
  X,
  FileText,
  Award,
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
  | 'ai-assistant'
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
          label: 'Surat Menyurat',
          icon: FileCheck,
          badge: pendingSuratCount > 0 ? pendingSuratCount : undefined,
          badgeColor: 'bg-amber-600',
        },
        { id: 'keuangan' as ActiveTab, label: 'Kas & Keuangan Multi-Unit', icon: Wallet },
        {
          id: 'iuran' as ActiveTab,
          label: 'Iuran Warga & QRIS',
          icon: Receipt,
          badge: unpaidIuranCount > 0 ? unpaidIuranCount : undefined,
          badgeColor: 'bg-rose-600',
        },
      ],
    },
    {
      group: 'Layanan & Aspirasi Warga',
      items: [
        {
          id: 'aduan-warga' as ActiveTab,
          label: 'Aduan Warga',
          icon: AlertTriangle,
          badge: pendingAduanCount > 0 ? pendingAduanCount : undefined,
          badgeColor: 'bg-red-600',
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
        { id: 'dokumen-proposal' as ActiveTab, label: 'Arsip & Proposal AI', icon: FolderOpen },
        { id: 'ai-assistant' as ActiveTab, label: 'AI Asisten Warga', icon: Sparkles, isAi: true },
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
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-15 left-0 z-40 h-[calc(100vh-3.75rem)] w-60 bg-[#343a40] text-slate-200 border-r border-slate-700/50 flex flex-col transition-transform duration-200 ease-in-out shadow-sm ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700/60 md:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Satu<span className="text-[#17a2b8]">Warga.id</span>
          </span>
          <button onClick={onCloseMobile} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2 text-[10px] font-bold text-slate-400/90 uppercase tracking-wider">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition group ${
                        isActive
                          ? 'bg-[#0056b3] text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive
                              ? 'text-white'
                              : item.isAi
                              ? 'text-amber-300 group-hover:scale-110 transition'
                              : 'text-slate-400 group-hover:text-[#17a2b8]'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] text-white font-bold ${item.badgeColor}`}
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

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-700/60 bg-black/20 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">
              Satu<span className="text-[#17a2b8]">Warga.id</span>
            </span>
            <span className="text-[10px] text-[#17a2b8] font-mono">ERP Warga</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Sistem Informasi Pengelolaan Lingkungan RT/RW
          </p>
        </div>
      </aside>
    </>
  );
};

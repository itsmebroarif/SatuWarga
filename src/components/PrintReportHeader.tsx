import React from 'react';

interface PrintReportHeaderProps {
  title: string;
  unitName?: string;
  subtitle?: string;
}

export const PrintReportHeader: React.FC<PrintReportHeaderProps> = ({
  title,
  unitName = 'E-REKAP ENTERPRISE MANAGEMENT SYSTEM',
  subtitle = 'Sistem Terpadu Manajemen Administrasi, Keuangan, & Inventaris',
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-4 text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">{unitName}</h1>
          <p className="text-xs font-semibold text-slate-700">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 border border-slate-400 rounded">
            DOKUMEN CETAK RESMI
          </span>
          <p className="text-[10px] text-slate-600 mt-1">
            Dicetak pada: <span className="font-bold">{currentDate} WIB</span>
          </p>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-slate-300 text-center">
        <h2 className="text-base font-extrabold tracking-wide uppercase font-mono">{title}</h2>
      </div>
    </div>
  );
};

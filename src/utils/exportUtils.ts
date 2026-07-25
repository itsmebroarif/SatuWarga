import { Warga, KartuKeluarga, TransaksiKas } from '../types';

/**
 * Utility to export JavaScript objects to CSV with UTF-8 BOM
 */
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  // Get headers
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          let cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
          cell = cell.replace(/"/g, '""'); // escape double quotes
          if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
            cell = `"${cell}"`;
          }
          return cell;
        })
        .join(',')
    ),
  ].join('\r\n');

  // Add UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Utility to generate a formatted printable document / PDF window
 */
export function exportToPDF(
  title: string,
  subtitle: string,
  headers: string[],
  dataRows: (string | number)[][],
  footerSummary?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up terblokir oleh browser. Harap izinkan pop-up untuk mencetak PDF.');
    return;
  }

  const dateNow = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tableHeaderHtml = headers.map((h) => `<th style="border: 2px solid #0f172a; padding: 8px; background: #e2e8f0; font-weight: 800; font-size: 11px; text-transform: uppercase;">${h}</th>`).join('');

  const tableBodyHtml = dataRows
    .map(
      (row, idx) =>
        `<tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          ${row.map((cell) => `<td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px;">${cell}</td>`).join('')}
        </tr>`
    )
    .join('');

  const htmlString = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ${dateNow}</title>
        <style>
          @body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 20px; }
          .header { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 18px; font-weight: 900; text-transform: uppercase; margin: 0; }
          .subtitle { font-size: 12px; font-weight: 600; color: #475569; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .footer-summary { margin-top: 16px; padding: 10px; background: #f1f5f9; border: 2px solid #0f172a; border-radius: 8px; font-size: 11px; font-weight: bold; }
          .signature { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 11px; font-weight: bold; }
          .sig-box { width: 200px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-size: 11px; font-weight: 900; letter-spacing: 1px; color: #0284c7;">RUKUN TETANGGA / RUKUN WARGA SUKAMAJU</div>
          <h1 class="title">${title}</h1>
          <div class="subtitle">${subtitle} • Dicetak Tanggal: ${dateNow}</div>
        </div>

        <table>
          <thead>
            <tr>${tableHeaderHtml}</tr>
          </thead>
          <tbody>
            ${tableBodyHtml}
          </tbody>
        </table>

        ${footerSummary ? `<div class="footer-summary">${footerSummary}</div>` : ''}

        <div class="signature">
          <div class="sig-box">
            <p>Mengetahui,<br/>Sekretaris RT / RW</p>
            <br/><br/><br/>
            <p>( .................................... )</p>
          </div>
          <div class="sig-box">
            <p>Sukamaju, ${dateNow}<br/>Ketua RT / RW</p>
            <br/><br/><br/>
            <p>( .................................... )</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 300);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlString);
  printWindow.document.close();
}

/**
 * Helper to export Warga List
 */
export function exportWargaCSV(wargaList: Warga[]) {
  const formatted = wargaList.map((w, idx) => ({
    No: idx + 1,
    NIK: w.nik,
    Nama: w.nama,
    'Jenis Kelamin': w.jenisKelamin,
    'Gol. Darah': w.golonganDarah || '-',
    Agama: w.agama,
    Pekerjaan: w.pekerjaan,
    'Status Perkawinan': w.statusPerkawinan,
    'No. HP': w.noHp,
    Alamat: `${w.alamat}, RT ${w.rt}/RW ${w.rw}`,
    'Status Warga': w.statusWarga,
  }));
  exportToCSV('Daftar_Warga_Sukamaju', formatted);
}

export function exportWargaPDF(wargaList: Warga[]) {
  const headers = ['No', 'NIK', 'Nama Lengkap', 'JK', 'Gol.Darah', 'Agama', 'Pekerjaan', 'No. HP', 'RT', 'Status'];
  const rows = wargaList.map((w, idx) => [
    idx + 1,
    w.nik,
    w.nama,
    w.jenisKelamin === 'Laki-laki' ? 'L' : 'P',
    w.golonganDarah || '-',
    w.agama,
    w.pekerjaan,
    w.noHp,
    `RT ${w.rt}`,
    w.statusWarga,
  ]);
  exportToPDF(
    'LAPORAN DAFTAR DATA WARGA SUKAMAJU',
    `Total Data Warga Terdaftar: ${wargaList.length} Jiwa`,
    headers,
    rows,
    `Rekapitulasi: Total ${wargaList.length} Warga Terdaftar.`
  );
}

/**
 * Helper to export Kas Transaksi
 */
export function exportKasCSV(kasList: TransaksiKas[]) {
  const formatted = kasList.map((k, idx) => ({
    No: idx + 1,
    Tanggal: k.tanggal,
    Jenis: k.jenis,
    Kategori: k.kategori,
    Jumlah: k.jumlah,
    Keterangan: k.keterangan,
    'Nomor Bukti': k.nomorBukti || '-',
    Pencatat: k.dicatatOleh,
  }));
  exportToCSV('Laporan_Kas_Keuangan', formatted);
}

export function exportKasPDF(kasList: TransaksiKas[], totalPemasukan: number, totalPengeluaran: number, saldoAkhir: number) {
  const headers = ['No', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Jumlah (Rp)', 'Pencatat'];
  const rows = kasList.map((k, idx) => [
    idx + 1,
    k.tanggal,
    k.jenis === 'MASUK' ? 'Pemasukan' : 'Pengeluaran',
    k.kategori,
    k.keterangan,
    `Rp ${k.jumlah.toLocaleString('id-ID')}`,
    k.dicatatOleh,
  ]);

  const summary = `Total Pemasukan: Rp ${totalPemasukan.toLocaleString('id-ID')} | Total Pengeluaran: Rp ${totalPengeluaran.toLocaleString('id-ID')} | SALDO AKHIR: Rp ${saldoAkhir.toLocaleString('id-ID')}`;

  exportToPDF('LAPORAN REKAPITULASI KAS & KEUANGAN RT/RW', 'Rincian Pemasukan & Pengeluaran', headers, rows, summary);
}

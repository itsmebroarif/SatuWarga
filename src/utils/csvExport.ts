export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCSV = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCSV).join(',');
  const rowLines = rows.map((row) => row.map(escapeCSV).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\n'); // UTF-8 BOM for Microsoft Excel

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

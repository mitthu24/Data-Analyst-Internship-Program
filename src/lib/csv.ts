/** Prevents CSV/formula injection: a cell starting with =, +, -, or @ is
 * treated as a formula by Excel/Sheets when the file is opened — prefix it
 * with a single quote so it's read as plain text instead. */
export function csvCell(value: string): string {
  const needsFormulaGuard = /^[=+\-@]/.test(value);
  const guarded = needsFormulaGuard ? `'${value}` : value;
  const escaped = guarded.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function buildCsv(header: string[], rows: string[][]): string {
  const lines = [header.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))];
  return lines.join("\r\n");
}

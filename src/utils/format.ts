export function fmtMoney(amount: number): string {
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// 'YYYY-MM' para el mes que se está viendo en el calendario
export function ymKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function monthTitle(date: Date): string {
  const s = date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isSameMonth(date: Date, today: Date): boolean {
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
}

// Lista de 'YYYY-MM' entre dos meses inclusive, para planes a plazos
export function getRangeMonths(start?: string, end?: string): string[] {
  if (!start || !end) return [];
  const months: string[] = [];
  let [y, m] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  while (y < ey || (y === ey && m <= em)) {
    months.push(`${y}-${String(m).padStart(2, '0')}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return months;
}

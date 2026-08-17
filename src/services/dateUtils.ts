/**
 * Parse any flexible date string (ISO, YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, Timestamps, Month-Year)
 */
export const parseFlexibleDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;
  const str = String(dateStr).trim();
  if (!str || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'na' || str.toLowerCase() === 'undefined' || str.toLowerCase() === 'null') return null;

  // Format: DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY (e.g. 15/05/2025, 17.06.2026)
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // Format: YYYY/MM/DD or YYYY-MM-DD
  const ymdMatch = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // Format: Month - Year (e.g. "May - 2025" or "May 2025")
  const monthYearMatch = str.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+(\d{4})/i);
  if (monthYearMatch) {
    const monthStr = monthYearMatch[1];
    const year = parseInt(monthYearMatch[2], 10);
    const monthIdx = MONTH_NAMES.findIndex(m => m.toLowerCase() === monthStr.toLowerCase().slice(0, 3));
    if (monthIdx !== -1) {
      return new Date(year, monthIdx, 1);
    }
  }

  // Try standard Date parsing as fallback (ISO timestamps etc.)
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  return null;
};

/**
 * Format a raw date string for clean UI display (e.g. "15/05/2025" or "2025-05-15").
 * Always returns raw text if parsing fails so sheet dates are NEVER hidden as "NA".
 */
export const formatDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr) return 'NA';
  const str = String(dateStr).trim();
  if (!str || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'na') return 'NA';

  const parsed = parseFlexibleDate(str);
  if (!parsed) {
    return str.split('T')[0].split(' ')[0] || str;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export const YEAR_OPTIONS = ['All', '2021', '2022', '2023', '2024', '2025', '2026', '2027'] as const;
export const WEEK_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'Week 1', value: 'Week 1' },
  { label: 'Week 2', value: 'Week 2' },
  { label: 'Week 3', value: 'Week 3' },
  { label: 'Week 4', value: 'Week 4' },
  { label: 'Week 5', value: 'Week 5' },
] as const;

/**
 * Hierarchical Date Filtering: Year, Month, Week
 */
export const isWithinHierarchicalDateFilter = (
  dateStr: string | undefined | null,
  selectedYear: string = 'All',
  selectedMonth: string = 'All',
  selectedWeek: string = 'All'
): boolean => {
  if (selectedYear === 'All' && selectedMonth === 'All' && selectedWeek === 'All') return true;
  if (!dateStr) return false;

  const parsed = parseFlexibleDate(dateStr);
  if (!parsed) return false;

  // 1. Year Filter
  if (selectedYear !== 'All') {
    if (String(parsed.getFullYear()) !== selectedYear) return false;
  }

  // 2. Month Filter (Jan = index 0, Feb = index 1...)
  if (selectedMonth !== 'All') {
    const monthName = MONTH_NAMES[parsed.getMonth()];
    if (monthName !== selectedMonth) return false;
  }

  // 3. Week Filter (Week 1 = Days 1-7, Week 2 = Days 8-14, Week 3 = Days 15-21, Week 4 = Days 22-28, Week 5 = Days 29-31)
  if (selectedWeek !== 'All') {
    const day = parsed.getDate();
    if (selectedWeek === 'Week 1' && (day < 1 || day > 7)) return false;
    if (selectedWeek === 'Week 2' && (day < 8 || day > 14)) return false;
    if (selectedWeek === 'Week 3' && (day < 15 || day > 21)) return false;
    if (selectedWeek === 'Week 4' && (day < 22 || day > 28)) return false;
    if (selectedWeek === 'Week 5' && day < 29) return false;
  }

  return true;
};

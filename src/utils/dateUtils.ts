import { ZoomLevel } from '@/types/workOrder';

/**
 * Calculate the number of days between two dates.
 * Positive if dateB > dateA.
 */
export function daysBetween(dateA: string | Date, dateB: string | Date): number {
  const a = typeof dateA === 'string' ? new Date(dateA + 'T00:00:00') : dateA;
  const b = typeof dateB === 'string' ? new Date(dateB + 'T00:00:00') : dateB;
  const msPerDay = 86400000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

/**
 * Calculate visible date range based on zoom level, centered on today.
 */
export function getVisibleRange(zoom: ZoomLevel): { start: Date; end: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  const end = new Date(today);

  switch (zoom) {
    case 'day':
      start.setDate(start.getDate() - 14); // ±2 weeks
      end.setDate(end.getDate() + 14);
      break;
    case 'week':
      start.setMonth(start.getMonth() - 2); // ±2 months
      end.setMonth(end.getMonth() + 2);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 6); // ±6 months
      end.setMonth(end.getMonth() + 6);
      break;
  }

  return { start, end };
}

/**
 * Pixels per day for each zoom level.
 */
export function getPixelsPerDay(zoom: ZoomLevel): number {
  switch (zoom) {
    case 'day': return 60;
    case 'week': return 16;
    case 'month': return 4;
  }
}

/**
 * Calculate left position in pixels for a given date.
 */
export function dateToPixel(date: string, visibleStart: Date, pixelsPerDay: number): number {
  return daysBetween(visibleStart, date) * pixelsPerDay;
}

/**
 * Calculate width in pixels for a date range.
 */
export function dateRangeToWidth(startDate: string, endDate: string, pixelsPerDay: number): number {
  return Math.max(daysBetween(startDate, endDate) * pixelsPerDay, pixelsPerDay);
}

/**
 * Convert a pixel offset back to a date string.
 */
export function pixelToDate(pixelOffset: number, visibleStart: Date, pixelsPerDay: number): string {
  const days = Math.floor(pixelOffset / pixelsPerDay);
  const date = new Date(visibleStart);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Format date for display based on zoom level.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Generate header labels for the timeline based on zoom level.
 */
export function generateHeaderDates(visibleStart: Date, visibleEnd: Date, zoom: ZoomLevel): { date: Date; label: string; isWeekend: boolean }[] {
  const dates: { date: Date; label: string; isWeekend: boolean }[] = [];
  const current = new Date(visibleStart);

  while (current <= visibleEnd) {
    const isWeekend = current.getDay() === 0 || current.getDay() === 6;

    switch (zoom) {
      case 'day':
        dates.push({
          date: new Date(current),
          label: current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
          isWeekend,
        });
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        dates.push({
          date: new Date(current),
          label: `W${getWeekNumber(current)} · ${current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          isWeekend: false,
        });
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        dates.push({
          date: new Date(current),
          label: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          isWeekend: false,
        });
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return dates;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Check if two date ranges overlap.
 * Overlap exists when: newStart < existingEnd AND newEnd > existingStart
 */
export function hasOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string
): boolean {
  return newStart < existingEnd && newEnd > existingStart;
}

/**
 * Add days to a date string, returning a new date string.
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Get today as ISO date string.
 */
export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

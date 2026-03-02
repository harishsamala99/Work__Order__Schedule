import { WorkOrderStatus } from '@/types/workOrder';

/**
 * Status color and label configuration.
 */
export const STATUS_CONFIG: Record<
  WorkOrderStatus,
  { label: string; dotClass: string; bgClass: string; textClass: string }
> = {
  open: {
    label: 'Open',
    dotClass: 'bg-status-open',
    bgClass: 'bg-status-open-bg',
    textClass: 'text-status-open',
  },
  'in-progress': {
    label: 'In Progress',
    dotClass: 'bg-status-in-progress',
    bgClass: 'bg-status-in-progress-bg',
    textClass: 'text-status-in-progress',
  },
  complete: {
    label: 'Complete',
    dotClass: 'bg-status-complete',
    bgClass: 'bg-status-complete-bg',
    textClass: 'text-status-complete',
  },
  blocked: {
    label: 'Blocked',
    dotClass: 'bg-status-blocked',
    bgClass: 'bg-status-blocked-bg',
    textClass: 'text-status-blocked',
  },
};

/**
 * Get inline styles for status bar coloring since Tailwind can't
 * dynamically generate classes with opacity modifiers from CSS vars.
 */
export function getStatusBarStyles(status: WorkOrderStatus): {
  background: string;
  borderColor: string;
  color: string;
} {
  const map: Record<WorkOrderStatus, { bg: string; border: string; text: string }> = {
    open: {
      bg: 'hsla(221, 83%, 53%, 0.12)',
      border: 'hsla(221, 83%, 53%, 0.35)',
      text: 'hsl(221, 83%, 53%)',
    },
    'in-progress': {
      bg: 'hsla(263, 70%, 50%, 0.12)',
      border: 'hsla(263, 70%, 50%, 0.35)',
      text: 'hsl(263, 70%, 50%)',
    },
    complete: {
      bg: 'hsla(142, 71%, 45%, 0.12)',
      border: 'hsla(142, 71%, 45%, 0.35)',
      text: 'hsl(142, 71%, 45%)',
    },
    blocked: {
      bg: 'hsla(32, 95%, 44%, 0.12)',
      border: 'hsla(32, 95%, 44%, 0.35)',
      text: 'hsl(32, 95%, 44%)',
    },
  };

  const s = map[status];
  return { background: s.bg, borderColor: s.border, color: s.text };
}

export function getStatusDotColor(status: WorkOrderStatus): string {
  const map: Record<WorkOrderStatus, string> = {
    open: 'hsl(221, 83%, 53%)',
    'in-progress': 'hsl(263, 70%, 50%)',
    complete: 'hsl(142, 71%, 45%)',
    blocked: 'hsl(32, 95%, 44%)',
  };
  return map[status];
}

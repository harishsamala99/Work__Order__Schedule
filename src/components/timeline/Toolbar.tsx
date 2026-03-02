import React from 'react';
import { ZoomLevel } from '@/types/workOrder';
import { ChevronDown, RotateCcw, CalendarDays } from 'lucide-react';

interface ToolbarProps {
  zoom: ZoomLevel;
  onZoomChange: (zoom: ZoomLevel) => void;
  onTodayClick: () => void;
  onResetData: () => void;
}

const ZOOM_OPTIONS: { value: ZoomLevel; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const Toolbar: React.FC<ToolbarProps> = ({ zoom, onZoomChange, onTodayClick, onResetData }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h1 className="text-base font-semibold text-foreground tracking-tight">
            Work Order Schedule
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onTodayClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
                     border border-border bg-card text-foreground
                     hover:bg-muted transition-colors"
        >
          <CalendarDays size={13} />
          Today
        </button>

        <div className="relative">
          <select
            value={zoom}
            onChange={(e) => onZoomChange(e.target.value as ZoomLevel)}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium rounded-md
                       border border-border bg-card text-foreground
                       hover:bg-muted transition-colors cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          >
            {ZOOM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
          />
        </div>

        <button
          onClick={onResetData}
          title="Reset sample data"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
                     border border-border bg-card text-muted-foreground
                     hover:bg-muted hover:text-foreground transition-colors"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </header>
  );
};

export default Toolbar;

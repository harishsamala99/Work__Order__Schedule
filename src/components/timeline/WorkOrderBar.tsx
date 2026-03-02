import React, { useState, useRef } from 'react';
import { WorkOrderDocument } from '@/types/workOrder';
import { getStatusBarStyles, getStatusDotColor, STATUS_CONFIG } from './statusConfig';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface WorkOrderBarProps {
  order: WorkOrderDocument;
  left: number;
  width: number;
  onEdit: (order: WorkOrderDocument) => void;
  onDelete: (docId: string) => void;
}

const WorkOrderBar: React.FC<WorkOrderBarProps> = ({ order, left, width, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const styles = getStatusBarStyles(order.data.status);
  const config = STATUS_CONFIG[order.data.status];
  const dotColor = getStatusDotColor(order.data.status);

  const handleClickOutside = React.useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  }, []);

  React.useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen, handleClickOutside]);

  return (
    <div
      className="absolute top-2 rounded-md cursor-pointer
                 transition-all duration-150 hover:shadow-md hover:scale-[1.01]
                 group flex items-center justify-between px-2.5 overflow-hidden"
      style={{
        left,
        width: Math.max(width, 40),
        height: 40,
        background: styles.background,
        border: `1px solid ${styles.borderColor}`,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Content */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: dotColor }}
        />
        {width > 80 && (
          <span
            className="text-[11px] font-medium truncate"
            style={{ color: styles.color }}
          >
            {order.data.name}
          </span>
        )}
      </div>

      {/* Status badge + menu */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {width > 140 && (
          <span
            className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              color: styles.color,
              background: `${styles.borderColor}`,
            }}
          >
            {config.label}
          </span>
        )}

        {/* Three-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity
                       p-0.5 rounded hover:bg-black/5"
            style={{ color: styles.color }}
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-50 bg-card border border-border rounded-lg shadow-lg
                            py-1 min-w-[120px] animate-fade-in">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(order);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground
                           hover:bg-muted transition-colors"
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(order.docId);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-destructive
                           hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderBar;

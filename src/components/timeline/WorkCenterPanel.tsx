import React from 'react';
import { WorkCenterDocument } from '@/types/workOrder';

interface WorkCenterPanelProps {
  workCenters: WorkCenterDocument[];
  rowHeight: number;
  headerHeight: number;
}

const ROW_HEIGHT = 64;

const WorkCenterPanel: React.FC<WorkCenterPanelProps> = ({ workCenters, headerHeight }) => {
  return (
    <div className="flex-shrink-0 w-52 border-r border-border bg-card z-10">
      {/* Header spacer to align with timeline header */}
      <div
        className="border-b border-border bg-timeline-header flex items-end px-4 pb-2"
        style={{ height: headerHeight }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Work Centers
        </span>
      </div>

      {/* Work center rows */}
      <div className="overflow-hidden">
        {workCenters.map((wc) => (
          <div
            key={wc.docId}
            className="flex items-center px-4 border-b border-border
                       hover:bg-muted/50 transition-colors group"
            style={{ height: ROW_HEIGHT }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0 group-hover:bg-primary transition-colors" />
              <span className="text-sm font-medium text-foreground truncate">
                {wc.data.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkCenterPanel;
export { ROW_HEIGHT };

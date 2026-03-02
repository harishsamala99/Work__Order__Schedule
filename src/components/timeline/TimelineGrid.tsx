import React, { useRef, useMemo, useEffect } from 'react';
import { WorkCenterDocument, WorkOrderDocument, ZoomLevel } from '@/types/workOrder';
import {
  getVisibleRange,
  getPixelsPerDay,
  dateToPixel,
  dateRangeToWidth,
  pixelToDate,
  generateHeaderDates,
  daysBetween,
  todayStr,
} from '@/utils/dateUtils';
import WorkOrderBar from './WorkOrderBar';
import { ROW_HEIGHT } from './WorkCenterPanel';

interface TimelineGridProps {
  workCenters: WorkCenterDocument[];
  workOrders: WorkOrderDocument[];
  zoom: ZoomLevel;
  onClickEmpty: (workCenterId: string, date: string) => void;
  onEditOrder: (order: WorkOrderDocument) => void;
  onDeleteOrder: (docId: string) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const HEADER_HEIGHT = 56;

const TimelineGrid: React.FC<TimelineGridProps> = ({
  workCenters,
  workOrders,
  zoom,
  onClickEmpty,
  onEditOrder,
  onDeleteOrder,
  scrollRef,
}) => {
  const { start: visibleStart, end: visibleEnd } = useMemo(() => getVisibleRange(zoom), [zoom]);
  const pixelsPerDay = useMemo(() => getPixelsPerDay(zoom), [zoom]);
  const totalDays = useMemo(() => daysBetween(visibleStart, visibleEnd), [visibleStart, visibleEnd]);
  const totalWidth = totalDays * pixelsPerDay;

  const headerDates = useMemo(
    () => generateHeaderDates(visibleStart, visibleEnd, zoom),
    [visibleStart, visibleEnd, zoom]
  );

  // Today indicator position
  const todayLeft = useMemo(
    () => dateToPixel(todayStr(), visibleStart, pixelsPerDay),
    [visibleStart, pixelsPerDay]
  );

  // Center on today when zoom changes
  useEffect(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = todayLeft - containerWidth / 2;
    }
  }, [zoom, todayLeft, scrollRef]);

  /**
   * Handle click on empty timeline area to create a new work order.
   */
  const handleRowClick = (workCenterId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = scrollRef.current?.scrollLeft || 0;
    // Calculate pixel offset relative to the full timeline
    const pixelOffset = e.clientX - rect.left + scrollLeft;
    const clickedDate = pixelToDate(pixelOffset, visibleStart, pixelsPerDay);
    onClickEmpty(workCenterId, clickedDate);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden" ref={scrollRef}>
      <div style={{ width: totalWidth, minWidth: '100%' }}>
        {/* Header row */}
        <div
          className="sticky top-0 z-20 border-b border-border bg-timeline-header flex"
          style={{ height: HEADER_HEIGHT }}
        >
          {headerDates.map((hd, i) => {
            const left = dateToPixel(
              hd.date.toISOString().split('T')[0],
              visibleStart,
              pixelsPerDay
            );
            const cellWidth = zoom === 'day' ? pixelsPerDay : zoom === 'week' ? pixelsPerDay * 7 : pixelsPerDay * 30;

            return (
              <div
                key={i}
                className={`flex-shrink-0 flex items-end pb-2 px-1 border-r border-border/50
                           ${hd.isWeekend ? 'bg-timeline-weekend' : ''}`}
                style={{ width: cellWidth }}
              >
                <span
                  className={`text-[10px] font-medium tracking-wide
                             ${hd.isWeekend ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}
                >
                  {hd.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline rows */}
        <div className="relative">
          {/* Today indicator */}
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ left: todayLeft }}
          >
            <div className="w-px h-full bg-timeline-today opacity-60" />
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2
                         w-2 h-2 rounded-full bg-timeline-today"
            />
          </div>

          {workCenters.map((wc) => {
            const orders = workOrders.filter((wo) => wo.data.workCenterId === wc.docId);

            return (
              <div
                key={wc.docId}
                className="relative border-b border-border hover:bg-primary/[0.02] transition-colors cursor-pointer"
                style={{ height: ROW_HEIGHT }}
                onClick={(e) => handleRowClick(wc.docId, e)}
              >
                {/* Grid lines */}
                {zoom === 'day' &&
                  headerDates.map((hd, i) => {
                    const cellLeft = dateToPixel(
                      hd.date.toISOString().split('T')[0],
                      visibleStart,
                      pixelsPerDay
                    );
                    return (
                      <div
                        key={i}
                        className={`absolute top-0 bottom-0 border-r border-border/30
                                   ${hd.isWeekend ? 'bg-muted/30' : ''}`}
                        style={{ left: cellLeft, width: pixelsPerDay }}
                      />
                    );
                  })}

                {/* Work order bars */}
                {orders.map((order) => {
                  const left = dateToPixel(order.data.startDate, visibleStart, pixelsPerDay);
                  const width = dateRangeToWidth(order.data.startDate, order.data.endDate, pixelsPerDay);

                  return (
                    <WorkOrderBar
                      key={order.docId}
                      order={order}
                      left={left}
                      width={width}
                      onEdit={onEditOrder}
                      onDelete={onDeleteOrder}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineGrid;
export { HEADER_HEIGHT };

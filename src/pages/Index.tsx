import React, { useRef, useCallback } from 'react';
import { useWorkOrderStore } from '@/hooks/useWorkOrderStore';
import Toolbar from '@/components/timeline/Toolbar';
import WorkCenterPanel from '@/components/timeline/WorkCenterPanel';
import TimelineGrid, { HEADER_HEIGHT } from '@/components/timeline/TimelineGrid';
import WorkOrderPanel from '@/components/WorkOrderPanel';
import { WorkOrderDocument } from '@/types/workOrder';

const Index = () => {
  const store = useWorkOrderStore();
  const scrollRef = useRef<HTMLDivElement>(null!);

  const handleTodayClick = useCallback(() => {
    // Re-trigger centering by toggling zoom
    const current = store.zoom;
    store.setZoom(current);
  }, [store]);

  const handleSave = useCallback(
    (data: WorkOrderDocument['data'], docId?: string) => {
      if (docId) {
        store.updateWorkOrder(docId, data);
      } else {
        store.addWorkOrder({ data });
      }
      store.closePanel();
    },
    [store]
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toolbar
        zoom={store.zoom}
        onZoomChange={store.setZoom}
        onTodayClick={handleTodayClick}
        onResetData={store.resetData}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkCenterPanel
          workCenters={store.workCenters}
          rowHeight={64}
          headerHeight={HEADER_HEIGHT}
        />

        <TimelineGrid
          workCenters={store.workCenters}
          workOrders={store.workOrders}
          zoom={store.zoom}
          onClickEmpty={store.openCreatePanel}
          onEditOrder={store.openEditPanel}
          onDeleteOrder={store.deleteWorkOrder}
          scrollRef={scrollRef}
        />
      </div>

      <WorkOrderPanel
        panel={store.panel}
        workCenters={store.workCenters}
        onClose={store.closePanel}
        onSave={handleSave}
        checkOverlap={store.checkOverlap}
      />
    </div>
  );
};

export default Index;

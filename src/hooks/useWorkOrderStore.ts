import { useState, useCallback, useEffect } from 'react';
import { WorkOrderDocument, WorkCenterDocument, ZoomLevel, PanelState } from '@/types/workOrder';
import { WORK_CENTERS, INITIAL_WORK_ORDERS } from '@/data/sampleData';
import { hasOverlap } from '@/utils/dateUtils';

const STORAGE_KEY = 'erp-work-orders';

function loadOrders(): WorkOrderDocument[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return INITIAL_WORK_ORDERS;
}

function saveOrders(orders: WorkOrderDocument[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function useWorkOrderStore() {
  const [workCenters] = useState<WorkCenterDocument[]>(WORK_CENTERS);
  const [workOrders, setWorkOrders] = useState<WorkOrderDocument[]>(loadOrders);
  const [zoom, setZoom] = useState<ZoomLevel>('day');
  const [panel, setPanel] = useState<PanelState>({ isOpen: false, mode: 'create' });

  // Persist to localStorage
  useEffect(() => {
    saveOrders(workOrders);
  }, [workOrders]);

  const getOrdersForWorkCenter = useCallback(
    (workCenterId: string) => workOrders.filter((wo) => wo.data.workCenterId === workCenterId),
    [workOrders]
  );

  /**
   * Overlap detection: checks if a new/edited order overlaps with
   * existing orders on the same work center, optionally excluding one order (for edits).
   */
  const checkOverlap = useCallback(
    (workCenterId: string, startDate: string, endDate: string, excludeDocId?: string): boolean => {
      const others = workOrders.filter(
        (wo) => wo.data.workCenterId === workCenterId && wo.docId !== excludeDocId
      );
      return others.some((wo) => hasOverlap(startDate, endDate, wo.data.startDate, wo.data.endDate));
    },
    [workOrders]
  );

  const addWorkOrder = useCallback(
    (order: Omit<WorkOrderDocument, 'docId' | 'docType'>) => {
      const newOrder: WorkOrderDocument = {
        docId: `wo-${Date.now()}`,
        docType: 'workOrder',
        ...order,
      };
      setWorkOrders((prev) => [...prev, newOrder]);
    },
    []
  );

  const updateWorkOrder = useCallback(
    (docId: string, data: WorkOrderDocument['data']) => {
      setWorkOrders((prev) =>
        prev.map((wo) => (wo.docId === docId ? { ...wo, data } : wo))
      );
    },
    []
  );

  const deleteWorkOrder = useCallback(
    (docId: string) => {
      setWorkOrders((prev) => prev.filter((wo) => wo.docId !== docId));
    },
    []
  );

  const openCreatePanel = useCallback(
    (workCenterId: string, defaultStartDate: string) => {
      setPanel({ isOpen: true, mode: 'create', workCenterId, defaultStartDate });
    },
    []
  );

  const openEditPanel = useCallback(
    (workOrder: WorkOrderDocument) => {
      setPanel({ isOpen: true, mode: 'edit', workOrder, workCenterId: workOrder.data.workCenterId });
    },
    []
  );

  const closePanel = useCallback(() => {
    setPanel({ isOpen: false, mode: 'create' });
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setWorkOrders(INITIAL_WORK_ORDERS);
  }, []);

  return {
    workCenters,
    workOrders,
    zoom,
    setZoom,
    panel,
    getOrdersForWorkCenter,
    checkOverlap,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    openCreatePanel,
    openEditPanel,
    closePanel,
    resetData,
  };
}

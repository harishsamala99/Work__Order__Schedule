// Data model types matching the document pattern spec

export interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string; // ISO date YYYY-MM-DD
    endDate: string;   // ISO date YYYY-MM-DD
  };
}

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export type ZoomLevel = 'day' | 'week' | 'month';

export interface PanelState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  workCenterId?: string;
  workOrder?: WorkOrderDocument;
  defaultStartDate?: string;
}

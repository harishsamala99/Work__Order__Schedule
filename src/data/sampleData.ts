import { WorkCenterDocument, WorkOrderDocument } from '@/types/workOrder';

/**
 * Sample work centers for the manufacturing ERP timeline.
 */
export const WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } },
];

/**
 * Generate sample work orders relative to today's date.
 * This ensures the timeline always has visible data.
 */
function generateSampleOrders(): WorkOrderDocument[] {
  const today = new Date();
  const d = (offset: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
  };

  return [
    {
      docId: 'wo-1',
      docType: 'workOrder',
      data: {
        name: 'Extrusion Batch #2401',
        workCenterId: 'wc-1',
        status: 'in-progress',
        startDate: d(-3),
        endDate: d(4),
      },
    },
    {
      docId: 'wo-2',
      docType: 'workOrder',
      data: {
        name: 'Extrusion Batch #2402',
        workCenterId: 'wc-1',
        status: 'open',
        startDate: d(6),
        endDate: d(12),
      },
    },
    {
      docId: 'wo-3',
      docType: 'workOrder',
      data: {
        name: 'CNC Shaft Machining',
        workCenterId: 'wc-2',
        status: 'complete',
        startDate: d(-10),
        endDate: d(-4),
      },
    },
    {
      docId: 'wo-4',
      docType: 'workOrder',
      data: {
        name: 'CNC Housing Cut',
        workCenterId: 'wc-2',
        status: 'open',
        startDate: d(1),
        endDate: d(8),
      },
    },
    {
      docId: 'wo-5',
      docType: 'workOrder',
      data: {
        name: 'Final Assembly – Unit A',
        workCenterId: 'wc-3',
        status: 'blocked',
        startDate: d(-1),
        endDate: d(5),
      },
    },
    {
      docId: 'wo-6',
      docType: 'workOrder',
      data: {
        name: 'QC Inspection Lot #88',
        workCenterId: 'wc-4',
        status: 'in-progress',
        startDate: d(-2),
        endDate: d(3),
      },
    },
    {
      docId: 'wo-7',
      docType: 'workOrder',
      data: {
        name: 'QC Final Release',
        workCenterId: 'wc-4',
        status: 'open',
        startDate: d(5),
        endDate: d(10),
      },
    },
    {
      docId: 'wo-8',
      docType: 'workOrder',
      data: {
        name: 'Packaging Run #55',
        workCenterId: 'wc-5',
        status: 'complete',
        startDate: d(-7),
        endDate: d(-2),
      },
    },
    {
      docId: 'wo-9',
      docType: 'workOrder',
      data: {
        name: 'Packaging Run #56',
        workCenterId: 'wc-5',
        status: 'open',
        startDate: d(2),
        endDate: d(9),
      },
    },
  ];
}

export const INITIAL_WORK_ORDERS: WorkOrderDocument[] = generateSampleOrders();

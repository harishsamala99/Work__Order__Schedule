import React, { useEffect, useMemo } from 'react';
import { WorkOrderDocument, WorkOrderStatus, PanelState } from '@/types/workOrder';
import { WorkCenterDocument } from '@/types/workOrder';
import { addDays } from '@/utils/dateUtils';
import { STATUS_CONFIG, getStatusDotColor } from './timeline/statusConfig';
import { X, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    status: z.enum(['open', 'in-progress', 'complete', 'blocked']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type FormValues = z.infer<typeof formSchema>;

interface WorkOrderPanelProps {
  panel: PanelState;
  workCenters: WorkCenterDocument[];
  onClose: () => void;
  onSave: (data: WorkOrderDocument['data'], docId?: string) => void;
  checkOverlap: (workCenterId: string, startDate: string, endDate: string, excludeDocId?: string) => boolean;
}

const STATUS_OPTIONS: { value: WorkOrderStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'blocked', label: 'Blocked' },
];

const WorkOrderPanel: React.FC<WorkOrderPanelProps> = ({
  panel,
  workCenters,
  onClose,
  onSave,
  checkOverlap,
}) => {
  const isEdit = panel.mode === 'edit';
  const workCenterName = useMemo(() => {
    const id = isEdit ? panel.workOrder?.data.workCenterId : panel.workCenterId;
    return workCenters.find((wc) => wc.docId === id)?.data.name || '';
  }, [panel, workCenters, isEdit]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: panel.workOrder!.data.name,
          status: panel.workOrder!.data.status,
          startDate: panel.workOrder!.data.startDate,
          endDate: panel.workOrder!.data.endDate,
        }
      : {
          name: '',
          status: 'open',
          startDate: panel.defaultStartDate || '',
          endDate: panel.defaultStartDate ? addDays(panel.defaultStartDate, 7) : '',
        },
  });

  // Reset form when panel changes
  useEffect(() => {
    if (panel.isOpen) {
      if (isEdit && panel.workOrder) {
        reset({
          name: panel.workOrder.data.name,
          status: panel.workOrder.data.status,
          startDate: panel.workOrder.data.startDate,
          endDate: panel.workOrder.data.endDate,
        });
      } else {
        reset({
          name: '',
          status: 'open',
          startDate: panel.defaultStartDate || '',
          endDate: panel.defaultStartDate ? addDays(panel.defaultStartDate, 7) : '',
        });
      }
    }
  }, [panel, isEdit, reset]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (panel.isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [panel.isOpen, onClose]);

  const onSubmit = (values: FormValues) => {
    const workCenterId = isEdit ? panel.workOrder!.data.workCenterId : panel.workCenterId!;
    const excludeId = isEdit ? panel.workOrder!.docId : undefined;

    // Check overlap
    if (checkOverlap(workCenterId, values.startDate, values.endDate, excludeId)) {
      setError('startDate', { message: 'This time range overlaps with another work order' });
      return;
    }

    onSave(
      {
        name: values.name,
        workCenterId,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
      },
      isEdit ? panel.workOrder!.docId : undefined
    );
  };

  if (!panel.isOpen) return null;

  const selectedStatus = watch('status');

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-96 bg-card border-l border-border
                      shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {isEdit ? 'Edit Work Order' : 'New Work Order'}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{workCenterName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background
                           text-foreground placeholder:text-muted-foreground/60
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                           transition-colors"
                placeholder="e.g., Extrusion Batch #2403"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <div className="relative">
                <select
                  {...register('status')}
                  className="w-full appearance-none px-3 py-2 text-sm rounded-md border border-border
                             bg-background text-foreground cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                             transition-colors"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                  style={{ background: getStatusDotColor(selectedStatus as WorkOrderStatus) }}
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Start Date
              </label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background
                           text-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                           transition-colors"
              />
              {errors.startDate && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                End Date
              </label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background
                           text-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                           transition-colors"
              />
              {errors.endDate && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-md border border-border
                         text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-md
                         bg-primary text-primary-foreground
                         hover:opacity-90 transition-opacity"
            >
              {isEdit ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default WorkOrderPanel;

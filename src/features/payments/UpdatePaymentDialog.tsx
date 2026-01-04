import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import type { Activity, PaymentData, PaymentFormValues } from '../../shared/schema';
import PaymentForm from './PaymentForm';
import { usePaymentForm, useUpdatePayment } from './payments';

type UpdatePaymentDialogProps = {
  payment: PaymentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpdatePaymentDialog({
  payment,
  open,
  onOpenChange,
}: UpdatePaymentDialogProps) {
  const formValues: PaymentFormValues = useMemo(
    () => ({
      activityId: payment.activityId,
      payeeId: payment.payeeId,
      roleId: payment.roleId,
      honorarium: payment.honorarium,
      salaryId: payment.salaryId,
      taxRate: payment.taxRate,
      accountId: payment.accountId,
      tinId: payment.tinId,
    }),
    [payment]
  );

  const activity: Pick<Activity, 'id' | 'title'> = {
    id: payment.activityId,
    title: payment.activity,
  };
  const form = usePaymentForm(formValues);
  const { isError, isSuccess, mutateAsync: updatePayment } = useUpdatePayment();

  const handleSubmit = useCallback(
    () => (formData: PaymentFormValues) => {
      toast.promise(updatePayment({ id: payment.id, formData }), {
        loading: 'Updating payment...',
      });
    },
    [payment.id, updatePayment]
  );

  useEffect(() => {
    form.reset();
  }, [formValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Update Payment</DialogTitle>
          <DialogDescription>Update a payment.</DialogDescription>
        </DialogHeader>
        <PaymentForm
          form={form}
          onSubmit={handleSubmit}
          setIsDialogOpen={onOpenChange}
          activity={activity}
          isSuccess={isSuccess}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  );
}

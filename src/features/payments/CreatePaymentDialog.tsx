import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CirclePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Activity, PaymentFormValues } from '../../shared/schema';
import PaymentForm from './PaymentForm';
import { useCreatePayment, usePaymentForm } from './payments';

type CreatePaymentDialogProps = {
  activity?: Pick<Activity, 'id' | 'title'>;
};

export default function CreatePaymentDialog({ activity }: CreatePaymentDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formValues: PaymentFormValues = useMemo(
    () => ({
      activityId: activity?.id ?? 0,
      payeeId: 0,
      roleId: 0,
      honorarium: 0,
      salaryId: 0,
      taxRate: 10,
      accountId: 0,
    }),
    [activity?.id]
  );

  const form = usePaymentForm(formValues);
  const { isError, isSuccess, mutateAsync: createPayment } = useCreatePayment();

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button size="lg" className="bg-cyan-500" onClick={handleClick}>
        <CirclePlus /> New Payment
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Payment</DialogTitle>
          <DialogDescription>Create a new payment.</DialogDescription>
        </DialogHeader>
        <PaymentForm
          form={form}
          values={formValues}
          onSubmit={createPayment}
          loadingMsg="Creating payment..."
          setIsDialogOpen={setIsDialogOpen}
          activity={activity}
          isSuccess={isSuccess}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  );
}

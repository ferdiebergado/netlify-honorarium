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
import type { PaymentFormValues } from '../../lib/schema';
import PaymentForm from './PaymentForm';
import { useCreatePayment, usePaymentForm } from './payments';

export default function CreatePaymentForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formValues: PaymentFormValues = useMemo(
    () => ({
      activityId: 0,
      payeeId: 0,
      roleId: 0,
      honorarium: 0,
      salaryId: 0,
      taxRate: 10,
      accountId: 0,
    }),
    []
  );

  const form = usePaymentForm(formValues);
  const { mutateAsync: createPayment } = useCreatePayment();

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
        />
      </DialogContent>
    </Dialog>
  );
}

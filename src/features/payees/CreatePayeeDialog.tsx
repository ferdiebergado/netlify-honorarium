import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import type { CreatePayeeFormValues } from '../../shared/schema';
import { useCreatePayee, usePayeeForm } from './payee';
import PayeeForm from './PayeeForm';

export default function CreatePayeeDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formData: CreatePayeeFormValues = {
    name: '',
    office: '',
    position: '',
    salary: 0,
    bankId: 0,
    bankBranch: '',
    accountNo: '',
    accountName: '',
    tin: '',
  };

  const form = usePayeeForm(formData);
  const { isError, isSuccess, mutateAsync: createPayee } = useCreatePayee();

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleClick}
        className="text-muted-foreground w-full text-center"
      >
        (Payee not in the list? Click here to add a new payee...)
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Payee</DialogTitle>
          <DialogDescription>Create a new payee.</DialogDescription>
        </DialogHeader>
        <PayeeForm
          form={form}
          values={formData}
          onSubmit={createPayee}
          loadingMsg="Creating payee..."
          setIsDialogOpen={setIsDialogOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  );
}

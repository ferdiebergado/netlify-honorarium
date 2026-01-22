import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconPlus } from '@tabler/icons-react';
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
  const { isSuccess, mutateAsync: createPayee } = useCreatePayee();

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button variant="ghost" className="w-full justify-start font-normal" onClick={handleClick}>
        <IconPlus className="-ms-2 opacity-60" aria-hidden="true" />
        New payee
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Payee</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new payee.
          </DialogDescription>
        </DialogHeader>
        <PayeeForm
          form={form}
          onSubmit={createPayee}
          loadingMsg="Creating payee..."
          setIsDialogOpen={setIsDialogOpen}
          isSuccess={isSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

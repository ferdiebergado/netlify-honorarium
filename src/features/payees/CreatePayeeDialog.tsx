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
  const { isError, isSuccess, mutateAsync: createPayee } = useCreatePayee();

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button
        size="icon"
        variant="outline"
        onClick={handleClick}
        className="text-muted-foreground h-9 text-center"
      >
        <IconPlus />
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

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import type { CreateAccountFormValues } from '../../shared/schema';
import AccountForm from './AccountForm';
import { useAccountForm, useCreateAccount } from './accounts';

type CreateAccountDialog = {
  payeeId: number;
};

export default function CreateAccountDialog({ payeeId }: CreateAccountDialog) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formData: CreateAccountFormValues = {
    payeeId,
    bankId: 0,
    bankBranch: '',
    accountNo: '',
    accountName: '',
  };

  const form = useAccountForm(formData);
  const { isError, isSuccess, mutateAsync: createAccount } = useCreateAccount();

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
        (Account not in the list? Click here to add a new account...)
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Account</DialogTitle>
          <DialogDescription>Create a new account.</DialogDescription>
        </DialogHeader>
        <AccountForm
          form={form}
          values={formData}
          onSubmit={createAccount}
          loadingMsg="Creating account..."
          setIsDialogOpen={setIsDialogOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  );
}

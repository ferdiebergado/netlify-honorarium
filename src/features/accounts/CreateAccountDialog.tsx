import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
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
    <Popover open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <PopoverTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            onClick={handleClick}
            className="text-muted-foreground text-center"
          >
            <IconPlus />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">New Account</h1>
        <h2 className="text-muted-foreground">Create a new account.</h2>
        <AccountForm
          form={form}
          values={formData}
          onSubmit={createAccount}
          loadingMsg="Creating account..."
          setIsDialogOpen={setIsDialogOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </PopoverContent>
    </Popover>
  );
}

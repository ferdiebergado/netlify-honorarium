import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useBankForm, useCreateBank } from '.';
import type { BankFormValues } from '../../shared/schema';
import BankForm from './BankForm';

export default function CreateBankPopover() {
  const [isOpen, setIsOpen] = useState(false);

  const formData: BankFormValues = {
    name: '',
  };

  const form = useBankForm(formData);
  const { isSuccess, mutateAsync: createBank } = useCreateBank();

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className="w-full justify-start font-normal"
            onClick={handleClick}
          >
            <IconPlus className="-ms-2 opacity-60" aria-hidden="true" />
            New bank...
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add Bank</h1>
        <h2 className="text-muted-foreground">Add a bank.</h2>
        <BankForm
          form={form}
          onSubmit={createBank}
          loadingMsg="Creating bank..."
          setIsPopoverOpen={setIsOpen}
          isSuccess={isSuccess}
        />
      </PopoverContent>
    </Popover>
  );
}

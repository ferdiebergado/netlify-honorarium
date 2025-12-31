import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { TinFormValues } from '../../shared/schema';
import TinForm from './TinForm';
import { useCreateTin, useCreateTinForm } from './tins';

type CreateTinPopoverProps = {
  payeeId: number;
};

export default function CreateTinPopover({ payeeId }: CreateTinPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formData: TinFormValues = {
    payeeId,
    tin: '',
  };

  const form = useCreateTinForm(formData);
  const { isError, isSuccess, mutateAsync: createTin } = useCreateTin();

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            onClick={handleClick}
            className="text-muted-foreground text-center"
            disabled={!payeeId}
          >
            <IconPlus />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add TIN</h1>
        <h2 className="text-muted-foreground">Add a new tin for the payee.</h2>
        <TinForm
          form={form}
          values={formData}
          onSubmit={createTin}
          loadingMsg="Creating TIN..."
          setIsPopoverOpen={setIsOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </PopoverContent>
    </Popover>
  );
}

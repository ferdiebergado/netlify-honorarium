import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { PositionFormValues } from '../../shared/schema';
import { useCreatePosition, usePositionForm } from './position';
import PositionForm from './PositionForm';

export default function CreatePositionPopover() {
  const [isOpen, setIsOpen] = useState(false);

  const formData: PositionFormValues = {
    name: '',
  };

  const form = usePositionForm(formData);
  const { isError, isSuccess, mutateAsync: createPosition } = useCreatePosition();

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
            New position
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add Position</h1>
        <h2 className="text-muted-foreground">Add a new position for the focal persons.</h2>
        <PositionForm
          form={form}
          onSubmit={createPosition}
          loadingMsg="Creating venue..."
          setIsPopoverOpen={setIsOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </PopoverContent>
    </Popover>
  );
}

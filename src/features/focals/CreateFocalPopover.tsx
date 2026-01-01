import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { FocalFormValues } from '../../shared/schema';
import { useCreateFocal, useFocalForm } from './focal';
import FocalForm from './FocalForm';

export default function CreateFocalPopover() {
  const [isOpen, setIsOpen] = useState(false);

  const formData: FocalFormValues = {
    name: '',
    positionId: 0,
  };

  const form = useFocalForm(formData);
  const { isError, isSuccess, mutateAsync: createFocal } = useCreateFocal();

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
            New focal person
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add Focal Person</h1>
        <h2 className="text-muted-foreground">Add a new focal person.</h2>
        <FocalForm
          form={form}
          onSubmit={createFocal}
          loadingMsg="Creating focal..."
          setIsPopoverOpen={setIsOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </PopoverContent>
    </Popover>
  );
}

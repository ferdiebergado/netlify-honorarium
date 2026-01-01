import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { VenueFormValues } from '../../shared/schema';
import { useCreateVenue, useVenueForm } from './venue';
import VenueForm from './VenueForm';

export default function CreateVenuePopover() {
  const [isOpen, setIsOpen] = useState(false);

  const formData: VenueFormValues = {
    name: '',
  };

  const form = useVenueForm(formData);
  const { isError, isSuccess, mutateAsync: createVenue } = useCreateVenue();

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
            New venue
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add Venue</h1>
        <h2 className="text-muted-foreground">Add a new venue.</h2>
        <VenueForm
          form={form}
          onSubmit={createVenue}
          loadingMsg="Creating venue..."
          setIsPopoverOpen={setIsOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </PopoverContent>
    </Popover>
  );
}

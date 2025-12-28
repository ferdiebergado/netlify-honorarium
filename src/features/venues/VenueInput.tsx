import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useVenues } from '../../features/venues/venue';
import { cn } from '../../lib/utils';

type VenueInputProps = {
  form: ActivityHookForm;
};

export default function VenueInput({ form }: VenueInputProps) {
  const [isVenueOpen, setIsVenueOpen] = useState(false);

  const { isPending, isError, error, data: venues } = useVenues();

  if (isPending)
    return (
      <div className="flex items-center gap-3 text-sm">
        <Spinner />
        Loading venues...
      </div>
    );

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <Controller
      name="venueId"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="venue">Venue</FieldLabel>

          <Popover open={isVenueOpen} onOpenChange={setIsVenueOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isVenueOpen}
                className="w-auto justify-between"
              >
                {field.value
                  ? venues.find(venue => venue.id === field.value)?.name
                  : 'Select venue...'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Command>
                <CommandInput
                  id="venue"
                  placeholder="Search venue..."
                  className="h-9"
                  aria-invalid={fieldState.invalid}
                />
                <CommandList>
                  <CommandEmpty>No venues found.</CommandEmpty>
                  <CommandGroup>
                    {venues.map(venue => (
                      <CommandItem
                        key={venue.id}
                        value={venue.name}
                        onSelect={() => {
                          field.onChange(venue.id);
                          setIsVenueOpen(false);
                        }}
                      >
                        {venue.name}
                        <Check
                          className={cn(
                            'ml-auto',
                            field.value === venue.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

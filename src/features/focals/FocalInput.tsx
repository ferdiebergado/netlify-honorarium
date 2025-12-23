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
import type { ActivityHookForm } from '@/features/activities/activity';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useFocals } from './focal';

type FocalInputProps = {
  form: ActivityHookForm;
};

const FocalInput: FC<FocalInputProps> = ({ form }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isPending, isError, error, isSuccess, data: focals } = useFocals();

  return (
    <Controller
      name="focalId"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="focal">Focal Person</FieldLabel>

          {isPending && (
            <div className="flex items-center gap-3 text-sm">
              <Spinner />
              Loading focal persons...
            </div>
          )}

          {isError && <FieldError errors={[{ message: error.message }]} />}

          {isSuccess && (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="w-auto justify-between"
                >
                  {field.value
                    ? focals.find(focal => focal.id === field.value)?.name
                    : 'Select focal person...'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Command>
                  <CommandInput
                    id="focal"
                    placeholder="Search focal..."
                    className="h-9"
                    aria-invalid={fieldState.invalid}
                  />
                  <CommandList>
                    <CommandEmpty>No focals found.</CommandEmpty>
                    <CommandGroup>
                      {focals.map(focal => (
                        <CommandItem
                          key={focal.id}
                          value={focal.name}
                          onSelect={() => {
                            field.onChange(focal.id);
                            setIsOpen(false);
                          }}
                        >
                          {focal.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === focal.id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FocalInput;

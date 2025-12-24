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
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Controller, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';

type ComboboxOption = {
  id: number | string;
  label: string;
};

type ComboboxFieldProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;

  options: ComboboxOption[];
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
};

export function ComboboxField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  options,
  isPending,
  isError,
  errorMessage,
}: ComboboxFieldProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          {isPending && (
            <div className="flex items-center gap-3 text-sm">
              <Spinner />
              Loading…
            </div>
          )}

          {isError && errorMessage && <FieldError errors={[{ message: errorMessage }]} />}

          {!isPending && !isError && (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="w-auto justify-between text-left wrap-break-word whitespace-break-spaces"
                >
                  {field.value ? options.find(o => o.id === field.value)?.label : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    id={name}
                    placeholder={searchPlaceholder}
                    className="h-9"
                    aria-invalid={fieldState.invalid}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {options.map(option => (
                        <CommandItem
                          key={option.id}
                          value={option.label}
                          onSelect={() => {
                            field.onChange(option.id);
                            setIsOpen(false);
                          }}
                          className="wrap-break-word whitespace-break-spaces"
                        >
                          {option.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === option.id ? 'opacity-100' : 'opacity-0'
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
}

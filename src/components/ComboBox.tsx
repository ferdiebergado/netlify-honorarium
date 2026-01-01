import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconSelector } from '@tabler/icons-react';
import { CommandLoading } from 'cmdk';
import { useState, type ReactNode } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type ComboboxOption = {
  id: number | string;
  label: string;
};

type ComboboxFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;

  options: ComboboxOption[];
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
  children?: ReactNode;
};

export function ComboboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  options,
  isPending,
  isError,
  errorMessage,
  children,
}: ComboboxFieldProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

          {isError && errorMessage && <FieldError errors={[{ message: errorMessage }]} />}

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between text-left wrap-break-word whitespace-break-spaces"
                  aria-expanded={isOpen}
                >
                  {field.value
                    ? options.find(option => option.id === field.value)?.label
                    : placeholder}
                  <IconSelector className="opacity-50" />
                </Button>
              }
            ></PopoverTrigger>

            <PopoverContent align="start" sideOffset={4} className="p-0 sm:w-88">
              <Command>
                <CommandInput
                  id={field.name}
                  placeholder={searchPlaceholder}
                  aria-invalid={fieldState.invalid}
                />
                <CommandList>
                  {children && <CommandGroup>{children}</CommandGroup>}
                  <CommandSeparator />
                  {isPending && <CommandLoading>Loading...</CommandLoading>}

                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {!isPending &&
                      !isError &&
                      options.map(option => (
                        <CommandItem
                          key={option.id}
                          value={option.label}
                          data-checked={field.value === option.id}
                          onSelect={() => {
                            field.onChange(option.id);
                            setIsOpen(false);
                          }}
                        >
                          {option.label}
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

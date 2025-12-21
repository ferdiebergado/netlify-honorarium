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
import { Controller } from 'react-hook-form';
import type { PayeeHookForm } from '../payees/payee';
import { useAccounts } from './banks';

interface BankInputProps {
  form: PayeeHookForm;
}

export default function BankInput({ form }: BankInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { isPending, isError, error, isSuccess, data: banks } = useAccounts();

  return (
    <Controller
      name="bankId"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="bank">Bank Name</FieldLabel>

          {isPending && (
            <div className="flex items-center gap-3 text-sm">
              <Spinner />
              Loading banks...
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
                    ? banks?.find(bank => bank.id === field.value)?.name
                    : 'Select bank...'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Command>
                  <CommandInput
                    id="bank"
                    placeholder="Search bank..."
                    className="h-9"
                    aria-invalid={fieldState.invalid}
                  />
                  <CommandList>
                    <CommandEmpty>No banks found.</CommandEmpty>
                    <CommandGroup>
                      {banks?.map(bank => (
                        <CommandItem
                          key={bank.id}
                          value={bank.name}
                          onSelect={() => {
                            field.onChange(bank.id);
                            setIsOpen(false);
                          }}
                        >
                          {bank.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === bank.id ? 'opacity-100' : 'opacity-0'
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

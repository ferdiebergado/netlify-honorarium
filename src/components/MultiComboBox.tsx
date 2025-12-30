import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
} from '@/components/ui/combobox';
import type { ReactNode } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Field, FieldLabel } from './ui/field';

type Option = {
  label: string;
  value: number;
};

type MultiComboboxProps<T extends FieldValues> = {
  name: keyof T & string;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  children?: ReactNode;
};

export function MultiCombobox<T extends FieldValues>({
  name,
  control,
  options,
  placeholder = 'Select options…',
  children,
}: MultiComboboxProps<T>) {
  return (
    <Controller
      name={name as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Payees</FieldLabel>

          <Combobox
            items={options}
            multiple
            value={field.value ?? []}
            onValueChange={field.onChange}
          >
            <div className="flex w-full flex-col gap-3">
              <ComboboxChips>
                <ComboboxValue>
                  {(value: number[]) => {
                    const selectedOptions = options.filter(opt => value.includes(opt.value));

                    return (
                      <>
                        {selectedOptions.map(opt => (
                          <ComboboxChip
                            key={opt.value}
                            aria-label={opt.label}
                            className="bg-secondary"
                          >
                            {opt.label}
                          </ComboboxChip>
                        ))}

                        <ComboboxInput
                          id={field.name}
                          placeholder={value.length > 0 ? '' : placeholder}
                          className="h-6 flex-1 border-none bg-transparent pl-2 text-base shadow-none outline-none focus-visible:ring-0"
                        />
                      </>
                    );
                  }}
                </ComboboxValue>
              </ComboboxChips>
            </div>
            <ComboboxContent className="z-50 outline-none" sideOffset={6}>
              <div>{children}</div>
              <ComboboxEmpty>No records found.</ComboboxEmpty>

              <ComboboxSeparator />
              <ComboboxList>
                {(opt: Option) => (
                  <ComboboxItem key={opt.value} value={opt.value}>
                    <div className="col-start-2">{opt.label}</div>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      )}
    /> // Controller
  );
}

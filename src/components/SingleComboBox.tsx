import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
} from '@/components/ui/combobox';
import type { ComboboxRoot } from '@base-ui/react';
import { type ReactNode } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from './ui/field';

type Option = {
  label: string;
  value: number;
};

type SingleComboboxProps<T extends FieldValues> = {
  name: keyof T & string;
  label: string;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  children?: ReactNode;
  props?: ComboboxRoot.Props<Option>;
};

export function SingleCombobox<T extends FieldValues>({
  name,
  control,
  options,
  placeholder = 'Select options…',
  children,
  label,
  props,
}: SingleComboboxProps<T>) {
  return (
    <Controller
      name={name as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <div className="flex w-full items-center gap-2">
            <div className="flex-1">
              <Combobox
                {...props}
                name={field.name}
                items={options}
                value={field.value}
                onValueChange={value => {
                  if (!value) return;

                  if (value.value === 0) return;

                  field.onChange(value);
                }}
                isItemEqualToValue={(item, selected) => item.value === selected.value}
                itemToStringLabel={opt => opt.label}
              >
                <div className="flex w-full flex-col gap-3">
                  <ComboboxValue>
                    <ComboboxInput
                      id={field.name}
                      placeholder={placeholder}
                      className="h-6 flex-1 bg-transparent text-base shadow-none outline-none focus-visible:ring-0"
                    />
                  </ComboboxValue>
                </div>
                <ComboboxContent className="z-50 outline-none" sideOffset={6}>
                  <ComboboxEmpty>No records found.</ComboboxEmpty>

                  <ComboboxSeparator />
                  <ComboboxList>
                    {(option: Option) => (
                      <ComboboxItem key={option.value} index={option.value} value={option}>
                        {option.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            {children}
          </div>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    /> // Controller
  );
}

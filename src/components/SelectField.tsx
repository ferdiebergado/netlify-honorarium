import type { ReactNode } from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import Loader from './Loader';
import { Field, FieldError, FieldLabel } from './ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type SelectOption = {
  value: number;
  label: string;
};

type ControlledSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  triggerClassName?: string;
  id?: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  children?: ReactNode;
};

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Select an option...',
  options,
  triggerClassName,
  id,
  isLoading,
  isError,
  error,
  children,
}: ControlledSelectProps<T>) {
  const fieldId = id ?? name;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>

          {isLoading && <Loader text="Loading..." />}

          {isError && <span className="text-destructive">Error: {error?.message}</span>}

          {!isLoading && !isError && (
            <Select
              name={field.name}
              value={String(field.value) === '0' ? '' : String(field.value)}
              onValueChange={value => {
                field.onChange(Number(value));
              }}
            >
              <SelectTrigger
                id={fieldId}
                className={triggerClassName}
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="0">{children}</SelectItem>
                <SelectSeparator />
                {options.map(opt => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

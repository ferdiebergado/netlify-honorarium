import { IconLoader } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
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
          <div className="flex w-full items-center gap-2">
            <div className="flex-1">
              <Select
                name={field.name}
                items={options}
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
                  <SelectValue>
                    {isLoading ? (
                      <>
                        <IconLoader className="text-muted-foreground h-4 w-4 animate-spin" />{' '}
                        Loading...
                      </>
                    ) : isError ? (
                      <span className="text-destructive">{error?.message}</span>
                    ) : (
                      (options.find(o => o.value === field.value)?.label ?? placeholder)
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectSeparator />
                  {!isLoading &&
                    !isError &&
                    options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {children}
          </div>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

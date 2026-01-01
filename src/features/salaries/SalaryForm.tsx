import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { SalaryFormValues } from '../../shared/schema';
import type { SalaryHookForm } from './salaries';

type SalaryFormProps = {
  form: SalaryHookForm;
  onSubmit: (data: SalaryFormValues) => Promise<{ message: string }>;
  setIsPopoverOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
  isError: boolean;
  payeeId?: number;
};

export default function SalaryForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
  isError,
  payeeId,
}: SalaryFormProps) {
  const handleSubmit = (formData: SalaryFormValues) => {
    setIsPopoverOpen(false);

    toast.promise(onSubmit(formData), {
      loading: loadingMsg,
    });
  };

  const handleReset = () => {
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    setIsPopoverOpen(false);
  };

  useEffect(() => {
    if (isError) setIsPopoverOpen(true);
  }, [isError, setIsPopoverOpen]);

  useEffect(() => {
    if (isSuccess) form.reset();
  }, [isSuccess, form]);

  return (
    <form id="salary-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <FieldGroup className="@container/field-group flex flex-row">
          {payeeId && (
            <Controller
              name="payeeId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Input {...field} type="hidden" value={payeeId} />
                </Field>
              )}
            />
          )}

          {/*  BASIC SALARY */}
          <Controller
            name="salary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="salary">Basic Salary</FieldLabel>
                <Input
                  {...field}
                  id="salary"
                  aria-invalid={fieldState.invalid}
                  placeholder="98000"
                  autoComplete="off"
                  type="number"
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '') {
                      field.onChange();
                    } else {
                      field.onChange(Number(value));
                    }
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF BASIC SALARY */}
        </FieldGroup>

        <div className="flex w-full justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>

          <Button type="submit" form="salary-form">
            Submit
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

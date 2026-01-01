import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { TinFormValues } from '../../shared/schema';
import type { TinHookForm } from './tins';

type TinFormProps = {
  form: TinHookForm;
  onSubmit: (data: TinFormValues) => Promise<{ message: string }>;
  setIsPopoverOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
  isError: boolean;
  payeeId?: number;
};

export default function TinForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
  isError,
  payeeId,
}: TinFormProps) {
  const handleSubmit = (formData: TinFormValues) => {
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

          {/*  TIN */}
          <Controller
            name="tin"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tax Identification Number (TIN)</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  onChange={field.onChange}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF TIN */}
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

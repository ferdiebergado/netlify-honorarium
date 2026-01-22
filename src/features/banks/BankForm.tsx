import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { BankHookForm } from '.';
import type { BankFormValues } from '../../shared/schema';

type BankFormProps = {
  form: BankHookForm;
  onSubmit: (data: BankFormValues) => Promise<{ message: string }>;
  setIsPopoverOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
};

export default function BankForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
}: BankFormProps) {
  const handleSubmit = (formData: BankFormValues) => {
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
    if (isSuccess) {
      form.reset();
      setIsPopoverOpen(false);
    }
  }, [isSuccess, form, setIsPopoverOpen]);

  return (
    <FieldGroup>
      {/*  BANK */}
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Bank</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              onChange={field.onChange}
              placeholder="Landbank of the Philippines (LBP)"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* END OF BANK */}

      <div className="flex w-full justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>

        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>

        <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
          Submit
        </Button>
      </div>
    </FieldGroup>
  );
}

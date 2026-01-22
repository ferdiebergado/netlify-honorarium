import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { FocalFormValues } from '../../shared/schema';
import PositionInput from '../positions/PositionInput';
import type { FocalHookForm } from './focal';

type FocalFormProps = {
  form: FocalHookForm;
  onSubmit: (data: FocalFormValues) => Promise<{ message: string }>;
  setIsPopoverOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
  isError: boolean;
  payeeId?: number;
};

export default function FocalForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
  isError,
}: FocalFormProps) {
  const handleSubmit = (formData: FocalFormValues) => {
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
    <FieldGroup>
      {/*  NAME */}
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enrique de Guzman"
              autoComplete="off"
              onChange={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* END OF NAME */}

      <PositionInput form={form} />

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

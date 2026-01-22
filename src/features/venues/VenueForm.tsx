import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { VenueFormValues } from '../../shared/schema';
import type { VenueHookForm } from './venue';

type VenueFormProps = {
  form: VenueHookForm;
  onSubmit: (data: VenueFormValues) => Promise<{ message: string }>;
  setIsPopoverOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
};

export default function VenueForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
}: VenueFormProps) {
  const handleSubmit = (formData: VenueFormValues) => {
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
      {/*  NAME */}
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              onChange={field.onChange}
            />
            <FieldDescription>Ex. Ecotech Center, Cebu City</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* END OF NAME */}

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

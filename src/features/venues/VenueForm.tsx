import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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
  isError: boolean;
};

export default function VenueForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
  isError,
}: VenueFormProps) {
  const handleSubmit = (formData: VenueFormValues) => {
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
    <form id="venue-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                placeholder="Ecotech Center, Cebu City"
              />
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

          <Button type="submit" form="venue-form">
            Submit
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

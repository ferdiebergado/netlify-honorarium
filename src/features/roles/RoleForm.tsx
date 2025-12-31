import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { RoleFormValues } from '../../shared/schema';
import type { RoleHookForm } from './roles';

type RoleFormProps = {
  form: RoleHookForm;
  values: RoleFormValues;
  onSubmit: (data: RoleFormValues) => Promise<{ message: string }>;
  setIsPopoverOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
  isError: boolean;
};

export default function RoleForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
  isError,
}: RoleFormProps) {
  const handleSubmit = (formData: RoleFormValues) => {
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
    <form id="role-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <FieldGroup className="@container/field-group flex flex-row">
          {/*  ROLE */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Role</FieldLabel>
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
          {/* END OF ROLE */}
        </FieldGroup>

        <div className="flex w-full justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>

          <Button type="submit" form="role-form">
            Submit
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import type { RoleFormValues } from '../../shared/schema';
import type { RoleHookForm } from './roles';

type RoleFormProps = {
  form: RoleHookForm;
  onSubmit: (data: RoleFormValues) => Promise<{ message: string }>;
  setIsPopoverOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
};

export default function RoleForm({
  form,
  onSubmit,
  loadingMsg,
  setIsPopoverOpen,
  isSuccess,
}: RoleFormProps) {
  const handleSubmit = (formData: RoleFormValues) => {
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
            <FieldDescription>Ex. Resource Person</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* END OF ROLE */}

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

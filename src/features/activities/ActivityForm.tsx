import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import FocalInput from '../../features/focals/FocalInput';
import VenueInput from '../../features/venues/VenueInput';
import type { ActivityFormValues } from '../../shared/schema';
import { type ActivityHookForm } from './activity';

type ActivityFormProps = {
  form: ActivityHookForm;
  onSubmit: (data: ActivityFormValues) => Promise<{ message: string }>;
  setIsDialogOpen: (open: boolean) => void;
  isSuccess: boolean;
};

export default function ActivityForm({
  form,
  onSubmit,
  setIsDialogOpen,
  isSuccess,
}: ActivityFormProps) {
  const handleSubmit = (formData: ActivityFormValues) => {
    toast.promise(onSubmit(formData), {
      loading: 'Creating activity...',
    });
  };

  const handleReset = () => {
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setIsDialogOpen(false);
    }
  }, [isSuccess, form, setIsDialogOpen]);

  return (
    <form id="activity-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {/*  TITLE */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="title"
                  placeholder="Workshop on the Development of..."
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/150 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF TITLE */}

        {/* VENUE */}
        <VenueInput form={form} />
        {/* END OF VENUE */}

        <FieldGroup className="@container/field-group flex flex-row">
          {/* START DATE */}
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                <Input type="date" {...field} id={field.name} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF START DATE */}

          {/* END DATE */}
          <Controller
            name="endDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                <Input type="date" {...field} id={field.name} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF END DATE */}
        </FieldGroup>

        {/* ACTIVITY CODE */}
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="code">Activity Code</FieldLabel>
              <Input
                {...field}
                id="code"
                aria-invalid={fieldState.invalid}
                placeholder="AC-25-BLD-TLD-BEC-001"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF ACTIVITY CODE */}

        {/* FOCAL */}
        <FocalInput form={form} />
        {/* END OF FOCAL */}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>

          <Button type="submit" form="activity-form">
            Submit
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}

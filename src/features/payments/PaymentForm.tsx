import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import AccountInput from '../../features/accounts/AccountInput';
import PayeeInput from '../../features/payees/PayeeInput';
import RoleInput from '../../features/roles/RoleInput';
import SalaryInput from '../../features/salaries/SalaryInput';
import TinInput from '../../features/tins/TinInput';
import type { Activity, PaymentFormValues } from '../../shared/schema';
import ActivityInput from '../activities/ActivityInput';
import { type PaymentHookForm } from './payments';

type PaymentFormProps = {
  form: PaymentHookForm;
  values: PaymentFormValues;
  onSubmit: (data: PaymentFormValues) => Promise<{ message: string }>;
  setIsDialogOpen: (open: boolean) => void;
  loadingMsg: string;
  activity?: Pick<Activity, 'id' | 'title'>;
  isSuccess: boolean;
  isError: boolean;
};

export default function PaymentForm({
  values,
  form,
  onSubmit,
  loadingMsg,
  setIsDialogOpen,
  activity,
  isSuccess,
  isError,
}: PaymentFormProps) {
  const handleSubmit = (formData: PaymentFormValues) => {
    setIsDialogOpen(false);
    toast.promise(onSubmit(formData), {
      loading: loadingMsg,
    });
  };

  const handleReset = () => {
    form.reset(values);
  };

  const handleCancel = () => {
    form.reset(values);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (isError) setIsDialogOpen(true);
  }, [isError, setIsDialogOpen]);

  useEffect(() => {
    if (isSuccess) form.reset(values);
  });

  return (
    <form id="payment-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {activity ? (
          <Controller
            name="activityId"
            control={form.control}
            render={() => (
              <Field>
                <FieldLabel htmlFor="activity">Activity</FieldLabel>
                <Input type="hidden" disabled value={activity.id} />
                <span className="font-semibold">{activity.title}</span>
              </Field>
            )}
          />
        ) : (
          <ActivityInput control={form.control} />
        )}

        <PayeeInput control={form.control} />
        <RoleInput form={form} />

        <FieldGroup className="items @container/field-group flex flex-row">
          <div className="w-6/10">
            <SalaryInput form={form} />
          </div>

          {/*  HONORARIUM */}
          <div className="flex-1">
            <Controller
              name="honorarium"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="flex-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="honorarium">Honorarium</FieldLabel>
                  <Input
                    {...field}
                    id="honorarium"
                    aria-invalid={fieldState.invalid}
                    placeholder="30000"
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
          </div>
          {/* END OF HONORARIUM */}
        </FieldGroup>

        <FieldGroup className="@container/field-group flex flex-row items-end gap-1">
          {/*  TAX RATE */}
          <Controller
            name="taxRate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tax">Withholding Tax Rate (%)</FieldLabel>
                <Input
                  {...field}
                  id="tax"
                  aria-invalid={fieldState.invalid}
                  placeholder="10"
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
          {/* END OF TAX RATE */}

          <TinInput form={form} />
        </FieldGroup>

        <AccountInput form={form} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>

          <Button type="submit" form="payment-form">
            Submit
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}

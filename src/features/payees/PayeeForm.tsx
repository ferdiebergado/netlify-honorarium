import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import BankInput from '../../features/banks/BankInput';
import type { CreatePayeeFormValues } from '../../shared/schema';
import { type PayeeHookForm } from './payee';

type PayeeFormProps = {
  form: PayeeHookForm;
  values: CreatePayeeFormValues;
  onSubmit: (data: CreatePayeeFormValues) => Promise<{ message: string }>;
  setIsDialogOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
  isError: boolean;
};

export default function PayeeForm({
  values,
  form,
  onSubmit,
  loadingMsg,
  setIsDialogOpen,
  isSuccess,
  isError,
}: PayeeFormProps) {
  const handleSubmit = (formData: CreatePayeeFormValues) => {
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
    if (isSuccess) form.reset();
  }, [isSuccess, form]);

  return (
    <form id="payee-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {/*  NAME */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Andres A. Bonifacio"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF NAME */}

        {/*  OFFICE */}
        <Controller
          name="office"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="office">Office</FieldLabel>
              <Input
                {...field}
                id="office"
                aria-invalid={fieldState.invalid}
                placeholder="Tambunting University"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF NAME */}

        {/*  POSITION */}
        <Controller
          name="position"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="position">Position</FieldLabel>
              <Input
                {...field}
                id="position"
                aria-invalid={fieldState.invalid}
                placeholder="Professor"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF POSITION */}

        <FieldGroup className="@container/field-group flex flex-row">
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
                      field.onChange(); // Handle empty input
                    } else {
                      field.onChange(Number(value)); // Parse to number
                    }
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF BASIC SALARY */}

          {/*  TIN */}
          <Controller
            name="tin"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tin">Tax Identification Number (TIN)</FieldLabel>
                <Input
                  {...field}
                  id="tin"
                  aria-invalid={fieldState.invalid}
                  placeholder="987-654-3210"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF TIN */}
        </FieldGroup>

        {/*  BANK */}
        <BankInput form={form} />
        {/* END OF BANK */}

        <FieldGroup className="@container/field-group flex flex-row">
          {/*  BANK */}
          <Controller
            name="bankBranch"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bank-branch">Bank Branch</FieldLabel>
                <Input
                  {...field}
                  id="bank-branch"
                  aria-invalid={fieldState.invalid}
                  placeholder="Baclaran"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF BANK BRANCH */}

          {/*  ACCOUNT NO. */}
          <Controller
            name="accountNo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="account-no">Account Number</FieldLabel>
                <Input
                  {...field}
                  id="account-no"
                  aria-invalid={fieldState.invalid}
                  placeholder="1234-5678-90"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* END OF ACCOUNT NO. */}
        </FieldGroup>

        {/*  ACCOUNT NAME */}
        <Controller
          name="accountName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="account-name">Account Name</FieldLabel>
              <Input
                {...field}
                id="account-name"
                aria-invalid={fieldState.invalid}
                placeholder="Apolinario Mabini"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF ACCOUNT NAME */}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>

          <Button type="submit" form="payee-form">
            Submit
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}

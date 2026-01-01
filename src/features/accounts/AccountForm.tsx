import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import BankInput from '../../features/banks/BankInput';
import type { CreateAccountFormValues } from '../../shared/schema';
import type { AccountHookForm } from './accounts';

type AccountFormProps = {
  form: AccountHookForm;
  onSubmit: (data: CreateAccountFormValues) => Promise<{ message: string }>;
  setIsDialogOpen: (open: boolean) => void;
  loadingMsg: string;
  isSuccess: boolean;
  isError: boolean;
};

export default function AccountForm({
  form,
  onSubmit,
  loadingMsg,
  setIsDialogOpen,
  isSuccess,
  isError,
}: AccountFormProps) {
  const handleSubmit = (formData: CreateAccountFormValues) => {
    setIsDialogOpen(false);

    toast.promise(onSubmit(formData), {
      loading: loadingMsg,
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
    if (isError) setIsDialogOpen(true);
  }, [isError, setIsDialogOpen]);

  useEffect(() => {
    if (isSuccess) form.reset();
  }, [isSuccess, form]);

  return (
    <form id="payee-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
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

        <div className="flex w-full justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" form="payee-form">
            Submit
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

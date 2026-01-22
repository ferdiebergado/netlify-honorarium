import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import type { CreateAccountFormValues } from '../../shared/schema';
import BankInput from '../banks/BankInput';
import { useAccountForm, useCreateAccount } from './accounts';

type CreateAccountFormProps = {
  payeeId: number;
};

export default function CreateAccountForm({ payeeId }: CreateAccountFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formData: CreateAccountFormValues = {
    bankId: 0,
    bankBranch: '',
    accountNo: '',
    accountName: '',
  };

  const form = useAccountForm(formData);
  const { isPending, isError, error, mutateAsync: createAccount } = useCreateAccount();

  const handleSubmit = (formData: CreateAccountFormValues) => {
    createAccount({ payeeId, formData });
    form.reset();
    setIsOpen(false);
  };

  const handleReset = useCallback(() => {
    form.reset();
  }, [form]);

  const handleCancel = useCallback(() => {
    form.reset();
    setIsOpen(false);
  }, [form, setIsOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            className="text-muted-foreground text-center"
            disabled={!payeeId}
            title="Click to add a new account."
          >
            <IconPlus />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">New Account</h1>
        <h2 className="text-muted-foreground">Create a new account.</h2>

        {isError && <p className="text-destructive">{error.message}</p>}

        <FieldGroup>
          {/*  BANK */}
          <BankInput form={form} />
          {/* END OF BANK */}

          <FieldGroup className="flex flex-row">
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
            <Button type="button" onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
              {isPending ? <Loader text="Saving..." /> : 'Submit'}
            </Button>
          </div>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}

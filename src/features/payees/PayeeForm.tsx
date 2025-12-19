import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect, type FC } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreatePayee, usePayeeForm, type PayeeFormData } from './payee';

type PayeeFormProps = {
  data: PayeeFormData;
  setIsDialogOpen: (open: boolean) => void;
};

const PayeeForm: FC<PayeeFormProps> = ({ data, setIsDialogOpen }) => {
  const form = usePayeeForm(data);
  const { mutate, isError, error, isSuccess, data: response } = useCreatePayee();

  const handleSubmit = (data: PayeeFormData) => {
    mutate(data);
  };

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setIsDialogOpen(false);
      toast.success(response.message);
    }
  }, [form, isSuccess, response, setIsDialogOpen]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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

        {/*  BANK */}
        <Controller
          name="bank"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="bank">Bank</FieldLabel>
              <Input
                {...field}
                id="bank"
                aria-invalid={fieldState.invalid}
                placeholder="LBP"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF BANK */}

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
                placeholder="Maragondon"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF BANK BRANCH */}

        <Field orientation="horizontal">
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
        </Field>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
            }}
          >
            Reset
          </Button>

          <Button type="submit" form="payee-form">
            Submit
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
};

export default PayeeForm;

import { ComboboxField } from '@/components/ComboBox';
import type { PaymentHookForm } from '../payments/payments';
import { usePayees } from './payee';

type PayeeInputProps = {
  form: PaymentHookForm;
};

export default function PayeeInput({ form }: PayeeInputProps) {
  const { isPending, isError, error, isSuccess, data: payees } = usePayees();

  return (
    <ComboboxField
      form={form}
      name="payeeId"
      label="Payee"
      placeholder="Select payee..."
      searchPlaceholder="Search payee..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={
        isSuccess
          ? payees.map(payee => ({
              id: payee.id,
              label: payee.name,
            }))
          : []
      }
    />
  );
}

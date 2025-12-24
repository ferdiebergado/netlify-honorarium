import { ComboboxField } from '@/components/ComboBox';
import type { PaymentHookForm } from '@/features/payments/payments';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { useAccounts } from './accounts';

type AccountInputProps = {
  form: PaymentHookForm;
};

export default function AccountInput({ form }: AccountInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, isSuccess, data: accounts = [] } = useAccounts();

  const filteredAccounts = useMemo(
    () => accounts.filter(account => account.payeeId === payeeId),
    [payeeId, accounts]
  );

  useEffect(() => {
    form.setValue('bankId', 0);
  }, [form, payeeId]);

  return (
    <ComboboxField
      form={form}
      name="bankId"
      label="Bank Account"
      placeholder="Select bank account..."
      searchPlaceholder="Search bank account..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={
        isSuccess
          ? filteredAccounts.map(({ id, accountNo, bank, bankBranch }) => ({
              id,
              label: `${bank} ${bankBranch} ${accountNo} `,
            }))
          : []
      }
    />
  );
}

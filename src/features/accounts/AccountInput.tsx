import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../../features/payments/payments';
import { useAccounts } from './accounts';

type AccountInputProps = {
  form: PaymentHookForm;
};

export default function AccountInput({ form }: AccountInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, data: accounts = [] } = useAccounts();

  const filteredAccounts = useMemo(
    () => accounts.filter(account => account.payeeId === payeeId),
    [payeeId, accounts]
  );

  useEffect(() => {
    form.setValue('accountId', 0);
  }, [form, payeeId]);

  return (
    <SelectField
      name="accountId"
      control={form.control}
      label="Bank Account"
      placeholder="Select account..."
      triggerClassName="w-[180px]"
      options={filteredAccounts.map(({ id, accountNo, bank, bankBranch }) => ({
        value: id,
        label: `${bank} ${bankBranch} ${accountNo}`,
      }))}
      isLoading={isPending}
      isError={isError}
      error={error}
    />
  );
}

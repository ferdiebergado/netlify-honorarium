import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../../features/payments/payments';
import { usePayeeAccounts } from './accounts';
import CreateAccountPopover from './CreateAccountPopover';

type AccountInputProps = {
  form: PaymentHookForm;
};

export default function AccountInput({ form }: AccountInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, data: accounts = [] } = usePayeeAccounts(payeeId);

  const options = useMemo(
    () =>
      accounts.map(({ id, accountNo, bank, bankBranch }) => ({
        value: id,
        label: `${bank} ${bankBranch} ${accountNo}`,
      })),
    [accounts]
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
      triggerClassName="w-78"
      options={options}
      isLoading={isPending}
      isError={isError}
      error={error}
    >
      <CreateAccountPopover payeeId={payeeId} />
    </SelectField>
  );
}

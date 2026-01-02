import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../../features/payments/payments';
import { usePayees } from '../payees/payee';
import CreateAccountPopover from './CreateAccountPopover';

type AccountInputProps = {
  form: PaymentHookForm;
};

export default function AccountInput({ form }: AccountInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, data: payees = [] } = usePayees();

  const payee = payees.find(payee => payee.id === payeeId);

  const options = useMemo(() => {
    if (payee && payee.accounts.length > 0)
      return payee.accounts.map(({ id, accountNo, bank, bankBranch }) => ({
        value: id,
        label: `${bank} ${bankBranch} ${accountNo}`,
      }));
    return [];
  }, [payee]);

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

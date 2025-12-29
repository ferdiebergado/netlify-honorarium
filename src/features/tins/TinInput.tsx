import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../payments/payments';
import { usePayeeTins } from './tins';

type TinInputProps = {
  form: PaymentHookForm;
};

export default function TinInput({ form }: TinInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, data: tins = [] } = usePayeeTins(payeeId.toString());

  const filteredTins = useMemo(() => tins.filter(tin => tin.payeeId === payeeId), [payeeId, tins]);

  useEffect(() => {
    form.setValue('tinId', 0);
  }, [form, payeeId]);

  return (
    <SelectField
      name="tinId"
      control={form.control}
      label="Tax Identification Number (TIN)"
      placeholder="Select TIN..."
      triggerClassName="w-[180px]"
      options={filteredTins.map(tin => ({
        value: tin.id,
        label: tin.tin,
      }))}
      isLoading={isPending}
      isError={isError}
      error={error}
    />
  );
}

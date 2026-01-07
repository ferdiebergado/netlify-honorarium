import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { usePayees } from '../payees/payee';
import type { PaymentHookForm } from '../payments/payments';
import CreateTinForm from './CreateTinForm';

type TinInputProps = {
  form: PaymentHookForm;
};

export default function TinInput({ form }: TinInputProps) {
  const fieldName = 'tinId';

  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, data: payees = [] } = usePayees();

  const payee = payees.find(payee => payee.id === payeeId);

  const options = useMemo(() => {
    if (payee && payee.tins && payee.tins.length > 0)
      return payee.tins.map(tin => ({
        value: tin.id,
        label: tin.tin,
      }));
    return [];
  }, [payee]);

  useEffect(() => {
    form.setValue(fieldName, form.getValues(fieldName));
  }, [form, payeeId]);

  return (
    <SelectField
      name={fieldName}
      control={form.control}
      label="Tax Identification Number (TIN)"
      placeholder="Select TIN..."
      triggerClassName="w-[180px]"
      options={options}
      isLoading={isPending}
      isError={isError}
      error={error}
    >
      <CreateTinForm payeeId={payeeId} />
    </SelectField>
  );
}

import { ComboboxField } from '@/components/ComboBox';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../payments/payments';
import { useTins } from './tins';

type TinInputProps = {
  form: PaymentHookForm;
};

export default function TinInput({ form }: TinInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, isSuccess, data: tins = [] } = useTins();

  const filteredTins = useMemo(() => tins.filter(tin => tin.payeeId === payeeId), [payeeId, tins]);

  useEffect(() => {
    form.setValue('tinId', 0);
  }, [form, payeeId]);

  return (
    <ComboboxField
      form={form}
      name="tinId"
      label="Tax Identification Number (TIN)"
      placeholder="Select tin..."
      searchPlaceholder="Search tin..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={
        isSuccess
          ? filteredTins.map(tin => ({
              id: tin.id,
              label: tin.tin,
            }))
          : []
      }
    />
  );
}

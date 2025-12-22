import { ComboboxField } from '@/components/ComboBox';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../payments/payments';
import { useSalaries } from './salaries';

type SalaryInputProps = {
  form: PaymentHookForm;
};

export default function SalaryInput({ form }: SalaryInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, isSuccess, data: salaries = [] } = useSalaries();

  const filteredSalaries = useMemo(
    () => salaries.filter(s => s.payeeId === payeeId),
    [payeeId, salaries]
  );

  useEffect(() => {
    form.setValue('salaryId', 0);
  }, [form, payeeId]);

  return (
    <ComboboxField
      form={form}
      name="salaryId"
      label="Basic Salary"
      placeholder="Select salary..."
      searchPlaceholder="Search salary..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={
        isSuccess
          ? filteredSalaries.map(salary => ({
              id: salary.id,
              label: salary.salary.toString(),
            }))
          : []
      }
    />
  );
}

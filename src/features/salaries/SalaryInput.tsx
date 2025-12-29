import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../payments/payments';
import { useSalary } from './salaries';

type SalaryInputProps = {
  form: PaymentHookForm;
};

export default function SalaryInput({ form }: SalaryInputProps) {
  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, data: salaries = [] } = useSalary(payeeId.toString());

  const filteredSalaries = useMemo(
    () => salaries.filter(s => s.payeeId === payeeId),
    [payeeId, salaries]
  );

  useEffect(() => {
    form.setValue('salaryId', 0);
  }, [form, payeeId]);

  return (
    <SelectField
      name="salaryId"
      control={form.control}
      label="Basic Salary"
      placeholder="Select salary..."
      triggerClassName="w-[180px]"
      options={filteredSalaries.map(salary => ({
        value: salary.id,
        label: salary.salary.toString(),
      }))}
      isLoading={isPending}
      isError={isError}
      error={error}
    />
  );
}

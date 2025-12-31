import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import type { PaymentHookForm } from '../payments/payments';
import CreateSalaryPopover from './CreateSalaryPopover';
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

  const options = useMemo(
    () =>
      salaries.map(salary => ({
        value: salary.id,
        label: salary.salary.toString(),
      })),
    [salaries]
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
      triggerClassName="w-full"
      options={options}
      isLoading={isPending}
      isError={isError}
      error={error}
    >
      <CreateSalaryPopover payeeId={payeeId} />
    </SelectField>
  );
}

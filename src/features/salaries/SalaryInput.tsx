import { SelectField } from '@/components/SelectField';
import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { usePayees } from '../payees/payee';
import type { PaymentHookForm } from '../payments/payments';
import CreateSalaryForm from './CreateSalaryForm';

type SalaryInputProps = {
  form: PaymentHookForm;
};

export default function SalaryInput({ form }: SalaryInputProps) {
  const fieldName = 'salaryId';

  const payeeId = useWatch({
    control: form.control,
    name: 'payeeId',
  });

  const { isPending, isError, error, data: payees = [] } = usePayees();

  const payee = payees.find(payee => payee.id === payeeId);

  const options = useMemo(() => {
    if (payee && payee.salaries.length > 0)
      return payee.salaries.map(salary => ({
        value: salary.id,
        label: salary.salary.toString(),
      }));
    return [];
  }, [payee]);

  useEffect(() => {
    let fieldValue = form.getValues(fieldName);

    if (options.length === 1) fieldValue = options[0].value;

    form.setValue(fieldName, fieldValue);
  }, [form, options, payeeId]);

  return (
    <SelectField
      name={fieldName}
      control={form.control}
      label="Basic Salary"
      placeholder="Select salary..."
      triggerClassName="w-full"
      options={options}
      isLoading={isPending}
      isError={isError}
      error={error}
    >
      <CreateSalaryForm payeeId={payeeId} />
    </SelectField>
  );
}

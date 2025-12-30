import { ComboboxField } from '@/components/ComboBox';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import CreatePayeeDialog from './CreatePayeeDialog';
import { usePayees } from './payee';

type HasPayeeId = {
  payeeId: number;
};

type PayeeInputProps<T extends FieldValues & HasPayeeId> = {
  form: UseFormReturn<T>;
};

export default function PayeeInput<T extends FieldValues & HasPayeeId>({
  form,
}: PayeeInputProps<T>) {
  const { isPending, isError, error, data: payees = [] } = usePayees();

  return (
    <ComboboxField
      form={form}
      name={'payeeId' as Path<T>}
      label="Payee"
      placeholder="Select payee..."
      searchPlaceholder="Search payee..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={payees.map(payee => ({
        id: payee.id,
        label: payee.name,
      }))}
    >
      <CreatePayeeDialog />
    </ComboboxField>
  );
}

import { SingleCombobox } from '@/components/SingleComboBox';
import { useMemo } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import CreatePayeeDialog from './CreatePayeeDialog';
import { usePayees } from './payee';

type HasPayeeId = {
  payeeId: number;
};

type PayeeInputProps<T extends FieldValues & HasPayeeId> = {
  control: Control<T>;
};

export default function PayeeInput<T extends FieldValues & HasPayeeId>({
  control,
}: PayeeInputProps<T>) {
  const { data: payees = [] } = usePayees();

  const options = useMemo(
    () =>
      payees.map(payee => ({
        value: payee.id,
        label: payee.name,
      })),
    [payees]
  );

  return (
    <SingleCombobox
      control={control}
      name={'payeeId' as Path<T>}
      label="Payee"
      placeholder="Select payee..."
      options={options}
    >
      <CreatePayeeDialog />
    </SingleCombobox>
  );
}

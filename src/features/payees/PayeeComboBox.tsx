import Loader from '@/components/Loader';
import { MultiCombobox } from '@/components/MultiComboBox';
import { Button } from '@/components/ui/button';
import { type Control, type FieldValues } from 'react-hook-form';
import { usePayees } from './payee';

type HasPayees = {
  payees: number[];
};

type PayeeComboBoxProps<T extends FieldValues & HasPayees> = {
  control: Control<T>;
};

export default function PayeeComboBox<T extends FieldValues & HasPayees>({
  control,
}: PayeeComboBoxProps<T>) {
  const { isPending, isError, error, data: payees = [] } = usePayees();

  if (isPending) return <Loader text="Loading payees..." />;

  if (isError) return <span>Error: {error.message}</span>;

  return (
    <MultiCombobox
      name="payees"
      control={control}
      options={payees.map(p => ({ label: p.name, value: p.id }))}
    >
      <Button variant="ghost">Add</Button>
    </MultiCombobox>
  );
}

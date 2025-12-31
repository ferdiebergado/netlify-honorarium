import { SingleCombobox } from '@/components/SingleComboBox';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useBanks } from './banks';

type WithBankId = {
  bankId: number;
};

type BankInputProps<T extends FieldValues & WithBankId> = {
  form: UseFormReturn<T>;
};

export default function BankInput<T extends FieldValues & WithBankId>({ form }: BankInputProps<T>) {
  const { data: banks = [] } = useBanks();

  const options = banks.map(bank => ({
    value: bank.id,
    label: bank.name,
  }));

  return (
    <SingleCombobox
      control={form.control}
      name={'bankId' as Path<T>}
      label="Bank Name"
      placeholder="Select bank..."
      options={options}
    />
  );
}

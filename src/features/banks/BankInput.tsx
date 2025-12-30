import { ComboboxField } from '@/components/ComboBox';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useBanks } from './banks';

type WithBankId = {
  bankId: number;
};

type BankInputProps<T extends FieldValues & WithBankId> = {
  form: UseFormReturn<T>;
};

export default function BankInput<T extends FieldValues & WithBankId>({ form }: BankInputProps<T>) {
  const { isPending, isError, error, data: banks = [] } = useBanks();

  return (
    <ComboboxField
      form={form}
      name={'bankId' as Path<T>}
      label="Bank Name"
      placeholder="Select bank..."
      searchPlaceholder="Search bank..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={banks.map(bank => ({
        id: bank.id,
        label: bank.name,
      }))}
    />
  );
}

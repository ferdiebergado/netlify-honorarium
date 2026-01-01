import { ComboboxField } from '@/components/ComboBox';
import { useMemo } from 'react';
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

  const options = useMemo(
    () =>
      banks.map(bank => ({
        id: bank.id,
        label: bank.name,
      })),
    [banks]
  );

  return (
    <ComboboxField
      control={form.control}
      name={'bankId' as Path<T>}
      label="Bank Name"
      placeholder="Select bank..."
      options={options}
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
    />
  );
}

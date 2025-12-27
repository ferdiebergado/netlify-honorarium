import { ComboboxField } from '@/components/ComboBox';
import type { PayeeHookForm } from '../../features/payees/payee';
import { useBanks } from './banks';

type BankInputProps = {
  form: PayeeHookForm;
};

export default function BankInput({ form }: BankInputProps) {
  const { isPending, isError, error, isSuccess, data: banks } = useBanks();

  return (
    <ComboboxField
      form={form}
      name="bankId"
      label="Bank Name"
      placeholder="Select bank..."
      searchPlaceholder="Search bank..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={
        isSuccess
          ? banks.map(bank => ({
              id: bank.id,
              label: bank.name,
            }))
          : []
      }
    />
  );
}

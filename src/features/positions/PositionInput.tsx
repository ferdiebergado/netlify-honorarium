import { ComboboxField } from '@/components/ComboBox';
import { useMemo } from 'react';
import { usePositions, type PositionHookForm } from './position';

type PositionInputProps = {
  form: PositionHookForm;
};

export default function PositionInput({ form }: PositionInputProps) {
  const { isPending, isError, error, data: positions = [] } = usePositions();

  const options = useMemo(
    () =>
      positions.map(({ id, name }) => ({
        id,
        label: name,
      })),
    [positions]
  );

  return (
    <ComboboxField
      control={form.control}
      name="name"
      label="Name"
      placeholder="Select name..."
      options={options}
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
    ></ComboboxField>
  );
}

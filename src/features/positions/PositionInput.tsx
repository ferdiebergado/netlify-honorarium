import { ComboboxField } from '@/components/ComboBox';
import { useMemo } from 'react';
import type { FocalHookForm } from '../focals/focal';
import CreatePositionPopover from './CreatePositionPopover';
import { usePositions } from './position';

type PositionInputProps = {
  form: FocalHookForm;
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
      name="positionId"
      label="Position"
      placeholder="Select position..."
      options={options}
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
    >
      <CreatePositionPopover />
    </ComboboxField>
  );
}

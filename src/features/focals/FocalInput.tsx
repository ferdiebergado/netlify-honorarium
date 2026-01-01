import { ComboboxField } from '@/components/ComboBox';
import { useMemo, type FC } from 'react';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useFocals } from './focal';

type FocalInputProps = {
  form: ActivityHookForm;
};

const FocalInput: FC<FocalInputProps> = ({ form }) => {
  const { isPending, isError, error, data: focals = [] } = useFocals();

  const options = useMemo(
    () =>
      focals.map(({ id, name }) => ({
        id,
        label: name,
      })),
    [focals]
  );

  return (
    <ComboboxField
      control={form.control}
      name="focalId"
      label="Focal Person"
      placeholder="Select focal..."
      options={options}
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
    />
  );
};

export default FocalInput;

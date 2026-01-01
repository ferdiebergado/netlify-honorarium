import { ComboboxField } from '@/components/ComboBox';
import type { FC } from 'react';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useFocals } from './focal';

type FocalInputProps = {
  form: ActivityHookForm;
};

const FocalInput: FC<FocalInputProps> = ({ form }) => {
  const { isPending, isError, error, data: focals = [] } = useFocals();

  const options = focals.map(focal => ({
    id: focal.id,
    label: focal.name,
  }));

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

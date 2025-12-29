import { ComboboxField } from '@/components/ComboBox';
import type { FC } from 'react';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useFocals } from './focal';

type FocalInputProps = {
  form: ActivityHookForm;
};

const FocalInput: FC<FocalInputProps> = ({ form }) => {
  const { isPending, isError, error, data: focals = [] } = useFocals();

  return (
    <ComboboxField
      form={form}
      name="focalId"
      label="Focal Person"
      placeholder="Select focal..."
      searchPlaceholder="Search focal..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={focals.map(focal => ({
        id: focal.id,
        label: focal.name,
      }))}
    />
  );
};

export default FocalInput;

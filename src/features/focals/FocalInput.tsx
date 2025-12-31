import { SingleCombobox } from '@/components/SingleComboBox';
import type { FC } from 'react';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useFocals } from './focal';

type FocalInputProps = {
  form: ActivityHookForm;
};

const FocalInput: FC<FocalInputProps> = ({ form }) => {
  const { data: focals = [] } = useFocals();

  const options = focals.map(focal => ({
    value: focal.id,
    label: focal.name,
  }));

  return (
    <SingleCombobox
      control={form.control}
      name="focalId"
      label="Focal Person"
      placeholder="Select focal..."
      options={options}
    />
  );
};

export default FocalInput;

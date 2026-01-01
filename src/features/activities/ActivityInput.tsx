import { ComboboxField } from '@/components/ComboBox';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useActivities } from '../../features/activities/activity';

type WithActivityId = {
  activityId: number;
};

type ActivityInputProps<T extends FieldValues & WithActivityId> = {
  control: Control<T>;
};

export default function ActivityInput<T extends FieldValues & WithActivityId>({
  control,
}: ActivityInputProps<T>) {
  const { data: activities = [] } = useActivities();

  const options = activities.map(activity => ({
    id: activity.id,
    label: activity.title,
  }));

  return (
    <ComboboxField
      control={control}
      name={'activityId' as Path<T>}
      label="Activity"
      placeholder="Select activity..."
      options={options}
    />
  );
}

import { SingleCombobox } from '@/components/SingleComboBox';
import type { Control, FieldValues } from 'react-hook-form';
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
    value: activity.id,
    label: activity.title,
  }));

  return (
    <SingleCombobox
      control={control}
      name="activityId"
      label="Activity"
      placeholder="Select activity..."
      options={options}
    />
  );
}

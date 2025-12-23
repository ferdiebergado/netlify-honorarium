import { ComboboxField } from '@/components/ComboBox';
import { useActivities } from '@/features/activities/activity';
import type { PaymentHookForm } from '@/features/payments/payments';

type ActivityInputProps = {
  form: PaymentHookForm;
};

export default function ActivityInput({ form }: ActivityInputProps) {
  const { isPending, isError, error, isSuccess, data: activities } = useActivities();

  return (
    <ComboboxField
      form={form}
      name="activityId"
      label="Activity"
      placeholder="Select activity..."
      searchPlaceholder="Search activity..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={
        isSuccess
          ? activities.map(activity => ({
              id: activity.id,
              label: activity.title,
            }))
          : []
      }
    />
  );
}

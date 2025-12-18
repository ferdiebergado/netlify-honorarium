import { useActivityForm, useCreateActivity, type ActivityFormdata } from './activity';
import ActivityDialog from './ActivityDialog';
import ActivityForm from './ActivityForm';

export default function CreateActivityForm() {
  const form = useActivityForm();
  const { isPending, mutate } = useCreateActivity(form);

  const onSubmit = (data: ActivityFormdata) => mutate(data);

  return (
    <ActivityDialog
      title="New Activity"
      description="Create a new activity"
      btnTitle="New Activity"
    >
      <ActivityForm form={form} isLoading={isPending} onSubmit={onSubmit} />
    </ActivityDialog>
  );
}

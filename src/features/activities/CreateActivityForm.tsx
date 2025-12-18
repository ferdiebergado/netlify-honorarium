import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useActivityForm, type ActivityFormdata } from './activity';
import ActivityDialog from './ActivityDialog';
import ActivityForm from './ActivityForm';

async function createActivity(formData: ActivityFormdata) {
  console.log('formData', formData);

  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error('request failed');

  const data = await res.json();
  return data;
}

export default function CreateActivityForm() {
  const form = useActivityForm();

  const { mutate, isPending } = useMutation({
    mutationFn: createActivity,
    onSuccess: async (data, _variables, _onMutateResult, context) => {
      await context.client.invalidateQueries({ queryKey: ['activities'] });
      form.reset();
      toast.success(data.message);
    },
    onError: err => toast.error(err.message),
  });

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

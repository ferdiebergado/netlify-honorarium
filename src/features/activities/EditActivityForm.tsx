import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FilePenLine } from 'lucide-react';
import { useState } from 'react';
import {
  useActivityForm,
  useUpdateActivity,
  type Activity,
  type ActivityFormValues,
} from './activity';
import ActivityForm from './ActivityForm';

type EditActivityProps = {
  activity: Activity;
};

export default function EditActivityForm({ activity }: EditActivityProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useActivityForm(activity);
  const { mutateAsync: updateActivity } = useUpdateActivity();

  const handleSubmit = (formData: ActivityFormValues) => {
    return updateActivity({ id: activity.id, formData });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" title="Edit">
          <FilePenLine />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Activity</DialogTitle>
          <DialogDescription>Update activity details.</DialogDescription>
        </DialogHeader>
        <ActivityForm
          form={form}
          values={activity}
          onSubmit={handleSubmit}
          setIsDialogOpen={setIsDialogOpen}
          loadingMsg="Updating Activity..."
        />
      </DialogContent>
    </Dialog>
  );
}

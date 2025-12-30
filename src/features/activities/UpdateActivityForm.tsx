import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconFilePencil } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { Activity, ActivityFormValues } from '../../shared/schema';
import { useActivityForm, useUpdateActivity } from './activity';
import ActivityForm from './ActivityForm';

type UpdateActivityProps = {
  activity: Activity;
};

export default function UpdateActivityForm({ activity }: UpdateActivityProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useActivityForm(activity);
  const { isSuccess, isError, mutateAsync: updateActivity } = useUpdateActivity();

  const handleSubmit = (formData: ActivityFormValues) =>
    updateActivity({ activityId: activity.id, formData });

  useEffect(() => {
    form.reset(activity);
  }, [activity, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        render={
          <Button type="button" size="icon" variant="outline" title="Update">
            <IconFilePencil />
          </Button>
        }
      ></DialogTrigger>
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
          isSuccess={isSuccess}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  );
}

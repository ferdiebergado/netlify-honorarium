import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconCirclePlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { ActivityFormValues } from '../../shared/schema';
import { useActivityForm, useCreateActivity } from './activity';
import ActivityForm from './ActivityForm';

export default function CreateActivityForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formValues: ActivityFormValues = {
    title: '',
    venueId: 0,
    startDate: '',
    endDate: '',
    code: '',
    focalId: 0,
  };

  const form = useActivityForm(formValues);
  const { isError, isSuccess, mutateAsync: createActivity } = useCreateActivity();

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button size="lg" className="bg-cyan-500" onClick={handleClick}>
        <IconCirclePlus /> New Activity
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Activity</DialogTitle>
          <DialogDescription>Create a new activity.</DialogDescription>
        </DialogHeader>
        <ActivityForm
          form={form}
          onSubmit={createActivity}
          setIsDialogOpen={setIsDialogOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </DialogContent>
    </Dialog>
  );
}

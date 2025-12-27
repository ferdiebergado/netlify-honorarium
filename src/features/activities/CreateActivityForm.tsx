import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CirclePlus } from 'lucide-react';
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
  const { mutateAsync: createActivity } = useCreateActivity();

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button size="lg" className="bg-cyan-500" onClick={handleClick}>
        <CirclePlus /> New Activity
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Activity</DialogTitle>
          <DialogDescription>Create a new activity.</DialogDescription>
        </DialogHeader>
        <ActivityForm
          form={form}
          values={formValues}
          onSubmit={createActivity}
          setIsDialogOpen={setIsDialogOpen}
          loadingMsg="Creating Activity..."
        />
      </DialogContent>
    </Dialog>
  );
}

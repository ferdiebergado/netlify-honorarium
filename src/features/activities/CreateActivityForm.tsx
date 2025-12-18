import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CirclePlus } from 'lucide-react';
import { useActivityForm, useCreateActivity, type ActivityFormdata } from './activity';
import ActivityForm from './ActivityForm';

export default function CreateActivityForm() {
  const form = useActivityForm();
  const { isPending, mutate } = useCreateActivity(form);

  const onSubmit = (data: ActivityFormdata) => mutate(data);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-cyan-500">
          <CirclePlus /> New Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Activity</DialogTitle>
          <DialogDescription>Create a new activity.</DialogDescription>
        </DialogHeader>
        <ActivityForm form={form} isLoading={isPending} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

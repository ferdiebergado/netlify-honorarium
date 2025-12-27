import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Activity } from '../../lib/schema';
import { useDeleteActivity } from './activity';

type DeleteActivityDialogProps = {
  activity: Activity;
};

export default function DeleteActivityDialog({ activity }: DeleteActivityDialogProps) {
  const { mutateAsync: deleteActivity } = useDeleteActivity();

  const handleAction = () => {
    toast.promise(deleteActivity(activity.id), {
      loading: 'Deleting Activity...',
      success: ({ message }: { message: string }) => message,
      error: (err: Error) => err.message,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="text-destructive"
          title="Delete"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action will delete the activity.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive" onClick={handleAction}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

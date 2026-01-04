import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Activity } from '../../shared/schema';
import { useDeleteActivity } from './activity';

type DeleteActivityDialogProps = {
  activity: Activity;
};

export default function DeleteActivityDialog({ activity }: DeleteActivityDialogProps) {
  const [open, setIsOpen] = useState(false);
  const { mutateAsync: deleteActivity } = useDeleteActivity();

  const handleClick = () => {
    setIsOpen(false);

    toast.promise(deleteActivity(activity.id), {
      loading: 'Deleting Activity...',
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="text-destructive"
        title="Delete"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <IconTrash />
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <IconAlertTriangle className="text-destructive size-6" />
          </div>
          <AlertDialogTitle>Are you absolutely sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This will delete the record from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive dark:bg-destructive/60 hover:bg-destructive focus-visible:ring-destructive text-white"
            onClick={handleClick}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

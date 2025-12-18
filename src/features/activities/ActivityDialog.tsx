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
import type { ReactNode } from 'react';

type ActivityDialogProps = {
  btnTitle: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function ActivityDialog({
  btnTitle,
  title,
  description,
  children,
}: ActivityDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-cyan-500">
          <CirclePlus /> {btnTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

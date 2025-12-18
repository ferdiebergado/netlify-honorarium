import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

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
      <div className="flex w-full justify-end mb-8">
        <DialogTrigger asChild>
          <Button className="bg-cyan-500">{btnTitle}</Button>
        </DialogTrigger>
      </div>
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

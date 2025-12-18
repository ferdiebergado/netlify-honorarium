import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, Info, Landmark, MapPin, Tag } from 'lucide-react';
import { type Activity } from './activity';

type ViewActivityProps = {
  activity: Activity;
};

export default function ViewActivityDialog({ activity }: ViewActivityProps) {
  const { title, venue, startDate, endDate, code, fund } = activity;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" title="Info">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3" /> {venue}
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="grid gap-4 py-4">
          {/* Date Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Start Date
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 opacity-70" />
                <span>{startDate}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                End Date
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 opacity-70" />
                <span>{endDate}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Activity Code</span>
              </div>
              <span className="font-mono font-medium bg-muted px-2 py-0.5 rounded">{code}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Landmark className="h-4 w-4" />
                <span>Fund Source</span>
              </div>
              <span className="font-medium text-foreground">{fund}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import Loader from '@/components/Loader.tsx';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconBriefcase, IconBuilding, IconInfoCircle } from '@tabler/icons-react';
import type { Payee } from '../../shared/schema.ts';
import { usePayeeAccounts } from '../accounts/accounts.ts';

type ViewPayeeProps = {
  payee: Payee;
};

export default function ViewPayeeDialog({ payee }: ViewPayeeProps) {
  const { name, position, office } = payee;
  const { isPending, isError, error, isSuccess, data: accounts } = usePayeeAccounts(payee.id);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="icon" title="Info">
            <IconInfoCircle />
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="w-full max-w-5xl pt-12">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-sm">
            <IconBuilding className="h-3 w-3" /> {office}
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="grid gap-4 py-4">
          {/* Date Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Position
              </p>
              <div className="flex items-center gap-2 text-sm">
                <IconBriefcase className="h-4 w-4 opacity-70" />
                <span>{position}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Bank Accounts
              </p>
            </div>
          </div>

          {/* Accounts Section */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Bank Branch</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending && <Loader text="Loading accounts..." />}
                {isError && <p>Error: {error.message}</p>}
                {isSuccess &&
                  accounts.map(({ bank, bankBranch, accountNo, accountName }) => (
                    <TableRow key={accountNo}>
                      <TableCell className="font-medium">{bank}</TableCell>
                      <TableCell>{bankBranch}</TableCell>
                      <TableCell>{accountName}</TableCell>
                      <TableCell className="text-right">{accountNo}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

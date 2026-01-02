import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney } from '@/lib/utils';
import type { PaymentData } from '@/shared/schema';
import { IconBriefcase } from '@tabler/icons-react';
import { useMemo } from 'react';
import { usePayee } from '../payees/payee';

type PaymentDetailsDialogProps = {
  payment: PaymentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PaymentDetailsDialog({
  payment,
  open,
  onOpenChange,
}: PaymentDetailsDialogProps) {
  const { isPending, isError, error, isSuccess, data: payee } = usePayee(payment.payeeId);

  const { account, salary } = useMemo(
    () => ({
      account: payee?.accounts.find(a => a.id === payment.accountId),
      salary: payee?.salaries.find(s => s.id === payment.salaryId),
    }),
    [payee, payment.salaryId, payment.accountId]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-1/2">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Payment Details</DialogTitle>
          <DialogDescription>View payees and payment details.</DialogDescription>
        </DialogHeader>
        {isPending && <Skeleton className="w-1/3" />}
        {isError && <p>Error: {error.message}</p>}
        {isSuccess && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Position
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconBriefcase className="h-4 w-4 opacity-70" />
                  <span>{payee.position}</span>
                </div>
              </div>
              {salary && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Salary
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <IconBriefcase className="h-4 w-4 opacity-70" />
                    <span>{formatMoney(salary.salary)}</span>
                  </div>
                </div>
              )}
              {account && (
                <>
                  <p>Bank: {account.bank} </p>
                  <p>Branch: {account.bankBranch}</p>
                  <p>Account Name: {account.accountName}</p>
                  <p>Account No.: {account.accountNo}</p>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

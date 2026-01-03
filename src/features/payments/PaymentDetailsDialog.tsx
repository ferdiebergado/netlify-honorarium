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
import {
  IconBriefcase,
  IconBuilding,
  IconBuildingBank,
  IconBuildingCottage,
  IconClock,
  IconId,
  IconMoneybag,
  IconMoneybagMove,
  IconMoneybagMoveBack,
  IconMoneybagPlus,
  IconNumber123,
  IconPercentage,
  IconUser,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { usePayee } from '../payees/payee';

type PaymentDetailsDialogProps = {
  payment: PaymentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function maskAccountNo(accountNo: string): string {
  const length = accountNo.length - 4;
  const suffix = accountNo.substring(length);

  const mask = Array.from({ length: length }, () => '*');

  return mask.join('') + suffix;
}

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
                  Payee
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconUser className="h-4 w-4 opacity-70" />
                  <span>{payee.name}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Office
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconBuilding className="h-4 w-4 opacity-70" />
                  <span>{payee.office}</span>
                </div>
              </div>

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
                    <IconMoneybag className="h-4 w-4 opacity-70" />
                    <span>{formatMoney(salary.salary)}</span>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  No. of hours rendered
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconClock className="h-4 w-4 opacity-70" />
                  <span>{payment.hoursRendered}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Computed honorarium
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconMoneybagPlus className="h-4 w-4 opacity-70" />
                  <span>{formatMoney(payment.actualHonorarium)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Honorarium
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconMoneybagMove className="h-4 w-4 opacity-70" />
                  <span>{formatMoney(payment.honorarium)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Tax Rate
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconPercentage className="h-4 w-4 opacity-70" />
                  <span>{payment.taxRate}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Net honorarium
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <IconMoneybagMoveBack className="h-4 w-4 opacity-70" />
                  <span>{formatMoney(payment.netHonorarium)}</span>
                </div>
              </div>
              {account && (
                <>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Bank
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <IconBuildingBank className="h-4 w-4 opacity-70" />
                      <span>{account.bank}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Bank branch
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <IconBuildingCottage className="h-4 w-4 opacity-70" />
                      <span>{account.bankBranch}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Account Name
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <IconId className="h-4 w-4 opacity-70" />
                      <span>{account.accountName}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Account No.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <IconNumber123 className="h-4 w-4 opacity-70" />
                      <span>{maskAccountNo(account.accountNo)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

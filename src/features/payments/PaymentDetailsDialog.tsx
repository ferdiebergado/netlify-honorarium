import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
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
  IconNumber,
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

  const { account, salary, tin } = useMemo(
    () => ({
      account: payee?.accounts.find(a => a.id === payment.accountId),
      salary: payee?.salaries.find(s => s.id === payment.salaryId),
      tin: payee?.tins?.find(t => t.id === payment.tinId),
    }),
    [payee, payment.salaryId, payment.accountId, payment.tinId]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Payment Details</DialogTitle>
          <DialogDescription>View payee, account and payment details.</DialogDescription>
        </DialogHeader>
        {isPending && <Skeleton className="w-1/3" />}
        {isError && <p>Error: {error.message}</p>}
        {isSuccess && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Payee</CardTitle>
              </CardHeader>
              <CardContent>
                <Item>
                  <ItemMedia>
                    <IconUser />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{payee.name}</ItemTitle>
                    <ItemDescription>Name</ItemDescription>
                  </ItemContent>
                </Item>
                <div className="flex">
                  <Item>
                    <ItemMedia>
                      <IconBuilding />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{payee.office}</ItemTitle>
                      <ItemDescription>Office</ItemDescription>
                    </ItemContent>
                  </Item>

                  <Item>
                    <ItemMedia>
                      <IconBriefcase />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{payee.position}</ItemTitle>
                      <ItemDescription>Position</ItemDescription>
                    </ItemContent>
                  </Item>
                </div>
                <div className="flex">
                  {salary && (
                    <Item>
                      <ItemMedia>
                        <IconMoneybag />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{formatMoney(salary.salary)}</ItemTitle>
                        <ItemDescription>Basic Salary</ItemDescription>
                      </ItemContent>
                    </Item>
                  )}

                  {tin && (
                    <Item>
                      <ItemMedia>
                        <IconNumber />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{tin.tin}</ItemTitle>
                        <ItemDescription>TIN</ItemDescription>
                      </ItemContent>
                    </Item>
                  )}
                </div>
              </CardContent>
            </Card>
            {account && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex">
                    <Item>
                      <ItemMedia>
                        <IconBuildingBank />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{account.bank}</ItemTitle>
                        <ItemDescription>Bank</ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item>
                      <ItemMedia>
                        <IconBuildingCottage />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{account.bankBranch}</ItemTitle>
                        <ItemDescription>Bank Branch</ItemDescription>
                      </ItemContent>
                    </Item>
                  </div>
                  <div className="flex">
                    <Item>
                      <ItemMedia>
                        <IconId />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{account.accountName}</ItemTitle>
                        <ItemDescription>Account Name</ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item>
                      <ItemMedia>
                        <IconNumber123 />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{maskAccountNo(account.accountNo)}</ItemTitle>
                        <ItemDescription>Account No.</ItemDescription>
                      </ItemContent>
                    </Item>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex">
                  <Item>
                    <ItemMedia>
                      <IconClock />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{payment.hoursRendered}</ItemTitle>
                      <ItemDescription>Hours Rendered</ItemDescription>
                    </ItemContent>
                  </Item>

                  <Item>
                    <ItemMedia>
                      <IconMoneybagPlus />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{formatMoney(payment.actualHonorarium)}</ItemTitle>
                      <ItemDescription>Computed Honorarium</ItemDescription>
                    </ItemContent>
                  </Item>
                </div>
                <div className="flex">
                  <Item>
                    <ItemMedia>
                      <IconMoneybagMove />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{formatMoney(payment.honorarium)}</ItemTitle>
                      <ItemDescription>Honorarium</ItemDescription>
                    </ItemContent>
                  </Item>
                  <Item>
                    <ItemMedia>
                      <IconPercentage />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{payment.taxRate}</ItemTitle>
                      <ItemDescription>Tax Rate</ItemDescription>
                    </ItemContent>
                  </Item>
                </div>
                <Item>
                  <ItemMedia>
                    <IconMoneybagMoveBack />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{formatMoney(payment.netHonorarium)}</ItemTitle>
                    <ItemDescription>Net Honorarium</ItemDescription>
                  </ItemContent>
                </Item>
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

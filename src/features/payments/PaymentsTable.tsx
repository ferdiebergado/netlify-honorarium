import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatMoney } from '@/lib/utils';
import type { PaymentData } from '@/shared/schema';

type PaymentsTableProps = {
  payments: PaymentData[];
};

export default function PaymentsTable({ payments }: PaymentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Payee</TableHead>
          <TableHead className="font-bold">Role</TableHead>
          <TableHead className="text-right font-bold">Hours Rendered</TableHead>
          <TableHead className="text-right font-bold">Actual Honorarium</TableHead>
          <TableHead className="text-right font-bold">Honorarium</TableHead>
          <TableHead className="text-right font-bold">Tax (%)</TableHead>
          <TableHead className="text-right font-bold">Net Honorarium</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length > 0 ? (
          payments.map(payment => (
            <TableRow>
              <TableCell>{payment.payee}</TableCell>
              <TableCell>{payment.role}</TableCell>
              <TableCell className="text-right">{payment.hoursRendered}</TableCell>
              <TableCell className="text-right">{formatMoney(payment.actualHonorarium)}</TableCell>
              <TableCell className="text-right">{formatMoney(payment.honorarium)}</TableCell>
              <TableCell className="text-right">{payment.taxRate}</TableCell>
              <TableCell className="text-right">{formatMoney(payment.netHonorarium)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-muted-foreground p-6 text-center">
              No records found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

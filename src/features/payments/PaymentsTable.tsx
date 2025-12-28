import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
          <TableHead className="font-bold">Hours Rendered</TableHead>
          <TableHead className="font-bold">Actual Honorarium</TableHead>
          <TableHead className="font-bold">Honorarium</TableHead>
          <TableHead className="font-bold">Tax (%)</TableHead>
          <TableHead className="font-bold">Net Honorarium</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map(payment => (
          <TableRow>
            <TableCell>{payment.payee}</TableCell>
            <TableCell>{payment.role}</TableCell>
            <TableCell>{payment.hoursRendered}</TableCell>
            <TableCell>{payment.actualHonorarium}</TableCell>
            <TableCell>{payment.honorarium}</TableCell>
            <TableCell>{payment.taxRate}</TableCell>
            <TableCell>{payment.netHonorarium}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

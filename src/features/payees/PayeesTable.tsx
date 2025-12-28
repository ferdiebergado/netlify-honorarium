import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Payee } from '@/shared/schema';

type PayeesTableProps = {
  payees: Payee[];
};

export default function PayeesTable({ payees }: PayeesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Name</TableHead>
          <TableHead className="font-bold">Office</TableHead>
          <TableHead className="font-bold">Position</TableHead>
          <TableHead className="font-bold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payees.map(payee => (
          <TableRow>
            <TableCell>{payee.name}</TableCell>
            <TableCell>{payee.office}</TableCell>
            <TableCell>{payee.position}</TableCell>
            <TableCell>View</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import { DataTable } from '@/components/DataTable';
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import SkeletonCard from '@/components/SkeletonCard';
import type { ColumnDef } from '@tanstack/react-table';
import type { Payment } from '../../lib/schema';
import { formatMoney } from '../../lib/utils';
import { usePayments } from './payments';

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'payee',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payee" />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: 'hoursRendered',
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-end" column={column} title="Hours Rendered" />
    ),
    cell: ({ row }) => <div className="pr-3 text-right">{row.getValue('hoursRendered')}</div>,
  },
  {
    accessorKey: 'actualHonorarium',
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-end" column={column} title="Actual Honorarium" />
    ),
    cell: ({ getValue }) => (
      <div className="pr-3 text-right">{formatMoney(getValue<number>())}</div>
    ),
  },
  {
    accessorKey: 'honorarium',
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-end" column={column} title="Honorarium" />
    ),
    cell: ({ getValue }) => (
      <div className="pr-3 text-right">{formatMoney(getValue<number>())}</div>
    ),
  },
  {
    accessorKey: 'taxRate',
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-end" column={column} title="Tax (%)" />
    ),
    cell: ({ getValue }) => <div className="pr-3 text-right">{getValue<number>()}</div>,
  },
  {
    accessorKey: 'netHonorarium',
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-end" column={column} title="Net Honorarium" />
    ),
    cell: ({ getValue }) => (
      <div className="pr-3 text-right">{formatMoney(getValue<number>())}</div>
    ),
  },
];

export default function PaymentList() {
  const { isPending, isError, error, data: payments } = usePayments();

  if (isPending) return <SkeletonCard />;

  if (isError) return <p className="text-destructive">Error: {error.message}</p>;

  return <DataTable columns={columns} filterColumn="payee" data={payments} />;
}

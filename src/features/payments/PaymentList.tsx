import { DataTable } from '@/components/DataTable';
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import { Spinner } from '@/components/ui/spinner';
import { formatMoney } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { usePayments, type Payment } from './payments';

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

  if (isPending)
    return (
      <div className="m-3 flex items-center gap-3">
        <Spinner /> Loading payments...
      </div>
    );

  if (isError) return <p>Error: {error.message}</p>;

  return <DataTable columns={columns} filterColumn="payee" data={payments} />;
}

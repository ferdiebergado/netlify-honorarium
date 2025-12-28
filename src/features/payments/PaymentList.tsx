import { DataTable } from '@/components/DataTable';
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import type { ColumnDef } from '@tanstack/react-table';
import { formatMoney } from '../../lib/utils';
import type { Payment, PaymentData } from '../../shared/schema';

const columns: ColumnDef<PaymentData>[] = [
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

type PaymentListProps = {
  payments: Payment[] | PaymentData[];
};

export default function PaymentList({ payments }: PaymentListProps) {
  return <DataTable columns={columns} filterColumn="payee" data={payments} />;
}

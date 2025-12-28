import { DataTable } from '@/components/DataTable';
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import type { ColumnDef } from '@tanstack/react-table';
import type { Payee } from '../../shared/schema';
import ViewPayeeDialog from './ViewPayeeDialog';

const columns: ColumnDef<Payee>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'office',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Office" />,
  },
  {
    accessorKey: 'position',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ViewPayeeDialog payee={row.original} />,
  },
];

type PayeeListProps = {
  payees: Payee[];
};

export default function PayeeList({ payees }: PayeeListProps) {
  return <DataTable columns={columns} filterColumn="name" data={payees} />;
}

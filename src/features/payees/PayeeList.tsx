import { DataTable } from '@/components/DataTable';
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import SkeletonCard from '@/components/SkeletonCard';
import type { ColumnDef } from '@tanstack/react-table';
import { usePayees, type Payee } from './payee';
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

export default function PayeeList() {
  const { isPending, isError, error, data: payees } = usePayees();

  if (isPending) return <SkeletonCard />;

  if (isError) return <p>Error: {error.message}</p>;

  return <DataTable columns={columns} filterColumn="name" data={payees} />;
}

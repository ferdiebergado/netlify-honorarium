import { DataTable } from '@/components/DataTable';
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import type { ColumnDef } from '@tanstack/react-table';
import { usePayees, type Payee } from './payee';

const columns: ColumnDef<Payee>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
];

export default function PayeeList() {
  const { isPending, isError, error, data: payees } = usePayees();

  if (isPending) return <p>Loading payees...</p>;

  if (isError) return <p>Error: {error.message}</p>;

  return <DataTable columns={columns} data={payees} />;
}

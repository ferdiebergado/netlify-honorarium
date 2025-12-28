import { DataTable } from '@/components/DataTable';
import { DataTableColumnHeader } from '@/components/DataTableColumnHeader';
import SkeletonCard from '@/components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { Link } from 'react-router';
import { type Activity } from '../../shared/schema.ts';
import { useActivities } from './activity.ts';
import DeleteActivityDialog from './DeleteActivityDialog';
import UpdateActivityForm from './UpdateActivityForm';

const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ getValue }) => (
      <div className="max-w-[300px] wrap-break-word whitespace-normal">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: 'venue',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Venue" />,
    cell: ({ getValue }) => (
      <div className="max-w-[200px] wrap-break-word whitespace-normal">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Activity Code" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-3">
        <Button variant="outline" size="icon" title="Details" asChild>
          <Link to={'/activities/' + row.getValue<string>('id')}>
            <Info />
          </Link>
        </Button>
        <UpdateActivityForm activity={row.original} />
        <DeleteActivityDialog activity={row.original} />
      </div>
    ),
  },
];

export default function ActivityList() {
  const { isPending, isError, error, data: activities } = useActivities();

  if (isPending) return <SkeletonCard />;

  if (isError) return <p className="text-destructive m-3">Error: {error.message}</p>;

  return <DataTable columns={columns} filterColumn="title" data={activities} />;
}

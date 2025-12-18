import { Spinner } from '@/components/ui/spinner';
import type { ColumnDef } from '@tanstack/react-table';
import { useActivityList, type Activity } from './activity';
import ActivityList from './ActivityList';
import CreateActivityForm from './CreateActivityForm';
import ViewActivityDialog from './ViewActivityDialog';

const columns: ColumnDef<Activity>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'venue', header: 'Venue' },
  { accessorKey: 'startDate', header: 'Start Date' },
  { accessorKey: 'endDate', header: 'End Date' },
  { accessorKey: 'code', header: 'Activity Code' },
  { accessorKey: 'fund', header: 'Fund Source' },
  { id: 'actions', cell: ({ row }) => <ViewActivityDialog activity={row.original} /> },
];

export default function ActivitiesPage() {
  const { isPending, isError, error, data } = useActivityList();

  return (
    <>
      <h1 className="text-3xl font-bold">Activities</h1>
      <h2 className="text-muted-foreground">List of Activities</h2>
      <CreateActivityForm />
      {isError && <p className="m-3 text-destructive">Error: {error.message}</p>}
      {isPending ? (
        <div className="flex m-3 gap-3 items-center">
          <Spinner /> Fetching activities...
        </div>
      ) : (
        <ActivityList columns={columns} data={data} />
      )}
    </>
  );
}

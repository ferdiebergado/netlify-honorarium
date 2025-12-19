import { Spinner } from '@/components/ui/spinner';
import type { ColumnDef } from '@tanstack/react-table';
import { useActivities, type Activity } from './activity';
import ActivityList from './ActivityList';
import CreateActivityForm from './CreateActivityForm';
import ViewActivityDialog from './ViewActivityDialog';

const columns: ColumnDef<Activity>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ getValue }) => (
      <div className="max-w-[300px] wrap-break-word whitespace-normal">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: 'venue',
    header: 'Venue',
    cell: ({ getValue }) => (
      <div className="max-w-[200px] wrap-break-word whitespace-normal">{getValue<string>()}</div>
    ),
  },
  { accessorKey: 'startDate', header: 'Start Date' },
  { accessorKey: 'endDate', header: 'End Date' },
  { accessorKey: 'code', header: 'Activity Code' },
  { accessorKey: 'fund', header: 'Fund Source' },
  { id: 'actions', cell: ({ row }) => <ViewActivityDialog activity={row.original} /> },
];

export default function ActivitiesPage() {
  const { isPending, isError, error, isSuccess, data: activities } = useActivities();

  return (
    <>
      <div className="mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-3xl font-bold">Activities</h1>
          <h2 className="text-muted-foreground">List of Activities</h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreateActivityForm />
        </div>
      </div>
      {isPending && (
        <div className="m-3 flex items-center gap-3">
          <Spinner /> Fetching activities...
        </div>
      )}
      {isError && <p className="text-destructive m-3">Error: {error.message}</p>}
      {isSuccess && <ActivityList columns={columns} data={activities} />}
    </>
  );
}

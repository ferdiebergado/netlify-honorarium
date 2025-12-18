import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { ColumnDef } from "@tanstack/react-table";
import { useActivityList, type Activity } from "./activity";
import ActivityList from "./ActivityList";
import CreateActivityForm from "./CreateActivityForm";

const columns: ColumnDef<Activity>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "venue", header: "Venue" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
  { accessorKey: "code", header: "Activity Code" },
  { accessorKey: "fund", header: "Fund Source" },
];

export default function ActivitiesPage() {
  const { isPending, isError, error, data } = useActivityList();

  return (
    <Card className="m-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Activities</CardTitle>
        <CardDescription>List of Activities</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateActivityForm />
        {isError && (
          <p className="m-3 text-destructive">Error: {error.message}</p>
        )}
        {isPending ? (
          <div className="flex m-3 gap-3">
            <Spinner /> Fetching activities...
          </div>
        ) : (
          <ActivityList columns={columns} data={data} />
        )}
      </CardContent>
    </Card>
  );
}

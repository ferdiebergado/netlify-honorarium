import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateActivityForm from "./CreateActivityForm";

export default function ActivitiesPage() {
  return (
    <Card className="m-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Activities</CardTitle>
        <CardDescription>List of Activities</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateActivityForm />
      </CardContent>
    </Card>
  );
}

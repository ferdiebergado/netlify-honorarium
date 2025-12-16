import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityForm } from "./ActivityForm";

export default function CreateActivityPage() {
  return (
    <Card className="w-full md:max-w-lg">
      <CardHeader>
        <CardTitle>New Activity</CardTitle>
        <CardDescription>Create a new Activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityForm />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

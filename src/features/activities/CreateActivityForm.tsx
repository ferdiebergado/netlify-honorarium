import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useActivityForm, type ActivityFormdata } from "./activity";
import ActivityDialog from "./ActivityDialog";
import ActivityForm from "./ActivityForm";

async function createActivity(formData: ActivityFormdata) {
  console.log("formData", formData);

  const res = await fetch("/create-activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("request failed");

  const data = await res.json();
  return data;
}

export default function CreateActivityForm() {
  const form = useActivityForm();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createActivity,
    onSuccess: (data) => {
      form.reset();
      toast.success(data.message);
    },
  });

  const onSubmit = (data: ActivityFormdata) => mutate(data);

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <ActivityDialog
      title="New Activity"
      description="Create a new activity"
      btnTitle="Create"
    >
      <ActivityForm form={form} isLoading={isPending} onSubmit={onSubmit} />
    </ActivityDialog>
  );
}

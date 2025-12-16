import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(150, "Title must be at most 150 characters."),
  venue: z
    .string()
    .min(20, "Venue must be at least 20 characters.")
    .max(100, "Venue must be at most 100 characters."),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  code: z.string(),
  fund: z.string(),
});

type ActivityFormdata = z.infer<typeof formSchema>;

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

export function ActivityForm() {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const form = useForm<ActivityFormdata>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      code: "",
    },
  });

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
    <form id="activity-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="title"
                  placeholder="Workshop on the Development of Idols"
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/150 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Complete title of the activity
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="venue"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="venue">Venue</FieldLabel>
              <Input
                {...field}
                id="venue"
                aria-invalid={fieldState.invalid}
                placeholder="Lime Hotel, Pasay City"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="startDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    id="start-date"
                    mode="single"
                    selected={new Date(field.value)}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (!date) return;

                      field.onChange(date?.toISOString().slice(0, 10));
                      setStartDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="endDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="end-date">End Date</FieldLabel>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {field.value
                      ? new Date(field.value).toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    id="end-date"
                    mode="single"
                    selected={new Date(field.value)}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (!date) return;
                      field.onChange(date?.toISOString().slice(0, 10));
                      setEndDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="code">Activity Code</FieldLabel>
              <Input
                {...field}
                id="code"
                aria-invalid={fieldState.invalid}
                placeholder="AC-25-BLD-TLD-BEC-000"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fund"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fund">Fund Source</FieldLabel>
              <Input
                {...field}
                id="fund"
                aria-invalid={fieldState.invalid}
                placeholder="2025 BEC Current"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          {isPending ? (
            <Button disabled>
              <Spinner />
              Submitting...
            </Button>
          ) : (
            <Button type="submit" form="activity-form">
              Submit
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}

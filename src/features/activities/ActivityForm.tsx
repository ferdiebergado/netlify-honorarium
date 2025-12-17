import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import type { ActivityFormdata, useActivityForm } from "./activity";

type ActivityFormProps = {
  form: ReturnType<typeof useActivityForm>;
  isLoading: boolean;
  onSubmit: (data: ActivityFormdata) => void;
};

export default function ActivityForm({
  form,
  isLoading,
  onSubmit,
}: ActivityFormProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          {isLoading ? (
            <Button disabled>
              <Spinner />
              Submitting...
            </Button>
          ) : (
            <Button type="submit" form="activity-form">
              Submit
            </Button>
          )}
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}

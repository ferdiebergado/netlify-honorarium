import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const formSchema = z.object({
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

export type ActivityFormdata = z.infer<typeof formSchema>;

export const useActivityForm = () =>
  useForm<ActivityFormdata>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      venue: "",
      startDate: "",
      endDate: "",
      code: "",
      fund: "",
    },
  });

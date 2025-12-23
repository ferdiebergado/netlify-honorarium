import * as z from 'zod';

// TODO: validate range and length
export const schema = z.object({
  title: z.string().min(1),
  venueId: z.number().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  code: z.string().min(1),
  focalId: z.number().min(1),
});

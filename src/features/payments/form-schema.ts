import * as z from 'zod';

export const formSchema = z.object({
  activityId: z.number().min(1, 'Activity is required.'),
  payeeId: z.number().min(1, 'Payee is required.'),
  roleId: z.number().min(1, 'Role is required.'),
  honorarium: z.number().min(1, 'Honorarium is required.'),
  salaryId: z.number().min(1, 'Basic salary is required.'),
  taxRate: z.number().min(1, 'Withholding tax rate is required.'),
  tinId: z.number().optional(),
  bankId: z.number().min(1, 'Bank account is required.'),
});

import * as z from 'zod';

export type Activity = {
  id: number;
  title: string;
  venueId: number;
  venue: string;
  startDate: string;
  endDate: string;
  code: string;
  focalId: number;
  focal: string;
};

// TODO: validate range and length
export const activitySchema = z
  .object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters.')
      .max(150, 'Title must be at most 150 characters.'),
    venueId: z.number().min(1, 'Venue is required.'),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    code: z.string().min(17, 'Activity Code must be at least 17 characters.'),
    focalId: z.number().min(1, 'Focal Person is required.'),
  })
  .refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    path: ['endDate'],
    message: 'End date must be on or after start date',
  });

export type ActivityFormValues = z.infer<typeof activitySchema>;

export type Account = {
  id: number;
  payeeId: number;
  payee: string;
  accountNo: string;
  bank: string;
  bankBranch: string;
  accountName: string;
};

export type Payee = {
  id: number;
  name: string;
  position: string;
  office: string;
};

export const createPayeeSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  office: z.string(),
  position: z.string(),
  salary: z.number().min(1, 'Basic salary is required.'),
  tin: z.string().optional(),
  bankId: z.number().min(1, 'Bank name is required.'),
  bankBranch: z.string().min(1, 'Bank branch is required.'),
  accountName: z.string().min(1, 'Account name is required.'),
  accountNo: z.string().min(1, 'Account number is required.'),
});

export type CreatePayeeFormValues = z.infer<typeof createPayeeSchema>;

export type Bank = {
  id: number;
  name: string;
};

export type Focal = {
  id: number;
  name: string;
};

export type Role = {
  id: number;
  name: string;
};

export type Salary = {
  id: number;
  salary: number;
  payeeId: number;
};

export type Tin = {
  id: number;
  tin: string;
  payeeId: number;
};

export type Venue = {
  id: number;
  name: string;
};

export const paymentSchema = z.object({
  activityId: z.number().min(1, 'Activity is required.'),
  payeeId: z.number().min(1, 'Payee is required.'),
  roleId: z.number().min(1, 'Role is required.'),
  honorarium: z.number().min(1, 'Honorarium is required.'),
  salaryId: z.number().min(1, 'Basic salary is required.'),
  taxRate: z.number().min(1, 'Withholding tax rate is required.'),
  tinId: z.number().optional(),
  accountId: z.number().min(1, 'Bank account is required.'),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export type Payment = {
  id: number;
  payee: string;
  activity: string;
  role: string;
  honorarium: number;
  updatedAt: string;
  hoursRendered: number;
  actualHonorarium: number;
  netHonorarium: number;
  activityCode: string;
  taxRate: number;
  venue: string;
  startDate: string;
  endDate: string;
  focal: string;
  position: string;
  tin: string;
  bank: string;
  bankBranch: string;
  accountName: string;
  accountNo: string;
  salary: number;
};

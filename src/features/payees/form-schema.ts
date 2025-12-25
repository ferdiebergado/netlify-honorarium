import * as z from 'zod';
import type { Account } from '../accounts/accounts';

export type Payee = {
  id: number;
  name: string;
  position: string;
  office: string;
  accounts: Omit<Account, 'payeeId'>[];
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

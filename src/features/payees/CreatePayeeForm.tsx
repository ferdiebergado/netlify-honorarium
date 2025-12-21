import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { usePayeeForm, type CreatePayeeFormData } from './payee';
import PayeeForm from './PayeeForm';

export default function CreatePayeeForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formData: CreatePayeeFormData = {
    name: '',
    office: '',
    position: '',
    salary: 0,
    bankId: 0,
    bankBranch: '',
    accountNo: '',
    accountName: '',
    tin: '',
  };

  const form = usePayeeForm(formData);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button size="lg" className="bg-cyan-500" onClick={handleClick}>
        <CirclePlus /> New Payee
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Payee</DialogTitle>
          <DialogDescription>Create a new payee.</DialogDescription>
        </DialogHeader>
        <PayeeForm form={form} data={formData} setIsDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}

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
import type { PayeeFormData } from './payee';
import PayeeForm from './PayeeForm';

export default function CreatePayeeForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formData: PayeeFormData = {
    name: '',
    positionId: 0,
    bank: '',
    bankBranch: '',
    accountNo: '',
    accountName: '',
    tin: '',
  };

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
        <PayeeForm data={formData} setIsDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}

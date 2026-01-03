import { IconLoader } from '@tabler/icons-react';
import { Toaster } from './ui/sonner';

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      expand
      richColors
      icons={{ loading: <IconLoader size={18} className="animate-spin" /> }}
    />
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Logged in.');
    navigate('/', { replace: true });
  }, []);

  return null;
}

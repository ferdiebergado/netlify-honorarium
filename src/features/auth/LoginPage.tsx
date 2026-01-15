import Splash from '@/components/Splash';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';
import { useIdToken } from '../../features/auth/auth';

export default function LoginPage() {
  const app = import.meta.env.VITE_APP_TITLE;
  const { isPending, mutate: verifyIdToken } = useIdToken();

  const handleSuccess = ({ credential }: CredentialResponse) => {
    if (!credential) return;
    verifyIdToken(credential);
  };

  const handleError = () => {
    toast.error('Login failed.');
  };

  if (isPending) return <Splash />;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold">Welcome to {app}</CardTitle>
              <CardDescription>Continue with your Google account</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <GoogleLogin
                size="large"
                theme="filled_blue"
                text="continue_with"
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

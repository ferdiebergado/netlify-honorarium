import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIdToken } from '@/features/auth/auth';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';
import Loader from './Loader';

export default function LoginPage() {
  const app = import.meta.env.VITE_APP_TITLE;
  const { isPending, mutate: verifyIdToken } = useIdToken();

  const handleSuccess = ({ credential }: CredentialResponse) => {
    if (!credential) return;
    verifyIdToken(credential);
  };

  const handleError = () => {
    toast.error('login failed');
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="text-primary flex items-center gap-2 self-center text-3xl font-extrabold"
        >
          {app}
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold">Welcome</CardTitle>
              <CardDescription>Login with your Google account</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {isPending ? (
                <Loader text="Logging in..." />
              ) : (
                <GoogleLogin
                  size="large"
                  theme="filled_blue"
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

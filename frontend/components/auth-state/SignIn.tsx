import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { AuthService } from '@/lib/service/auth.service';
import { tokenInstance } from '@/api/auth.api';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/features/user/userSlice';
import { useRouter } from 'next/navigation';
// import { LocalStorageManager } from '@/lib/localstorage';

interface SignInProps {
  setIsLoggin: Dispatch<SetStateAction<boolean>>;
}

function SignIn({ setIsLoggin }: SignInProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  // const localStorage = new LocalStorageManager('token');

  const signInHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data = await AuthService.signIn({ email, password });
      if (data) {
        tokenInstance.set(data.token);
        dispatch(login(data));
        toast.success('Sign in successfully');
        router.push('/');
        setIsLoggin(true);
      }
    } catch (ex) {
      if (ex instanceof Error) {
        toast.error(ex.message);
      }
    }
  };

  return (
    <form onSubmit={signInHandler}>
      <div className="grid gap-6">
        {/* <div className="flex flex-col gap-4">
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div> */}
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a> */}
            </div>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <a
            href="#"
            onClick={() => setIsLoggin(false)}
            className="underline underline-offset-4"
          >
            Sign up
          </a>
        </div>
      </div>
    </form>
  );
}

export default SignIn;

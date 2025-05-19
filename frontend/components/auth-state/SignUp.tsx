import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { AuthService } from '@/lib/service/auth.service';
import { toast } from 'sonner';
import axios from 'axios';

interface SignUpProps {
  setIsLoggin: Dispatch<SetStateAction<boolean>>;
}

function SignUp({ setIsLoggin }: SignUpProps) {
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordRep, setPasswordRep] = useState<string>('');

  const signUpHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (password !== passwordRep) throw new Error('Password must be equal');
      const data = await AuthService.signUp({ nickname, email, password });
      if (data) {
        toast.success('Account has been created');
        setIsLoggin(true);
      }
    } catch (ex) {
      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(ex)) {
        errorMessage =
          ex.response?.data?.message || ex.message || 'Network error occurred';
      } else if (ex instanceof Error) {
        errorMessage = ex.message;
      }

      toast.error(errorMessage);
      console.error('Signup error:', ex);
    }
  };

  return (
    <form onSubmit={signUpHandler}>
      <div className="grid gap-6">
        {/* <div className="flex flex-col gap-4">
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Register with Google
          </Button>
        </div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div> */}
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Nickname</Label>
            <Input
              id="name"
              type="name"
              placeholder="Jhon Smith"
              className="autofill:bg-transparent"
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="autofill:bg-transparent"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              className="autofill:bg-foreground"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Repeat password</Label>
            </div>
            <Input
              id="passwordRep"
              type="password"
              className="autofill:bg-transparent"
              onChange={(e) => setPasswordRep(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </div>
        <div className="text-center text-sm">
          Do you have an account?{' '}
          <a
            href="#"
            onClick={() => setIsLoggin(true)}
            className="underline underline-offset-4"
          >
            Sign in
          </a>
        </div>
      </div>
    </form>
  );
}

export default SignUp;

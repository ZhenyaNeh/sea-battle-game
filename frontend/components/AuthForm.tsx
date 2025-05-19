'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import SignIn from './auth-state/SignIn';
import SignUp from './auth-state/SignUp';

export function AuthForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [isLoggin, setIsLoggin] = useState<boolean>(true);

  return (
    <div className={cn('flex flex-col gap-6 ', className)} {...props}>
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isLoggin ? 'Welcome back' : 'Create new account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoggin ? (
            <SignIn setIsLoggin={setIsLoggin} />
          ) : (
            <SignUp setIsLoggin={setIsLoggin} />
          )}
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

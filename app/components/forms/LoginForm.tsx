import { getFormProps, getInputProps, type SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, Link, useActionData } from '@remix-run/react';
import React from 'react';
import { z } from 'zod';
import { classNames as cn } from '~/utils';
import { Button, FieldError, FormErrors, Input, Label } from '../ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import ProviderConnectionForm, { providerNames } from './ProviderConnectionForm';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [form, fields] = useForm({
    id: 'login-form',
    lastResult: useActionData<SubmissionResult<string[]>>(),
    constraint: getZodConstraint(LoginSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    },
  });

  return (
    <div className={cn('flex w-full max-w-md flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Meta or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              {providerNames.map(providerName => (
                <ProviderConnectionForm providerName={providerName} type="Log in" key={providerName} />
              ))}
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
            <Form method="POST" {...getFormProps(form)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor={fields.email.id}>Email</Label>
                  <Input
                    {...getInputProps(fields.email, {
                      type: 'email',
                    })}
                    autoFocus
                    placeholder="name@example.com"
                    autoComplete="off"
                  />
                  <FieldError field={fields.email} />
                </div>
                <div className="-mt-1 grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor={fields.password.id}>Password</Label>
                    <Link
                      to="/forgot-password"
                      prefetch="intent"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input {...getInputProps(fields.password, { type: 'password' })} />
                  <FieldError field={fields.password} />
                </div>
              </div>
              <div className="grid gap-3">
                <Button type="submit" className="-mt-1 w-full">
                  Login
                </Button>
                <FormErrors errors={form.errors} errorId={form.errorId} />
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link to="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

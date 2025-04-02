import { getFormProps, getInputProps, type SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, Link, useActionData } from '@remix-run/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { z } from 'zod';
import { useIsPending } from '~/hooks';
import { classNames as cn } from '~/utils';
import { EmailSchema } from '~/utils/schemas';
import { Button, FieldError, FormErrors, Input, Label } from '../ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import ProviderConnectionForm, { providerNames } from './ProviderConnectionForm';

export const SignUpSchema = z.object({
  email: EmailSchema,
});

export default function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const isPending = useIsPending();
  const [form, fields] = useForm({
    id: 'sign-up-form',
    constraint: getZodConstraint(SignUpSchema),
    lastResult: useActionData<SubmissionResult<string[]>>(),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignUpSchema });
    },
  });

  return (
    <div className={cn('flex w-full max-w-[480px] flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your free account</CardTitle>
          <CardDescription>
            Join Notely! Register using your email or create an account using a social login for a quick and easy setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
            <Form method="POST" action="/sign-up" {...getFormProps(form)}>
              <div className="grid gap-2">
                <Label htmlFor={fields.email.id}>Email</Label>
                <Input {...getInputProps(fields.email, { type: 'email' })} placeholder="name@example.com" autoFocus />
                <div>
                  <FieldError field={fields.email} />
                  <FormErrors errors={form.errors} errorId={form.errorId} />
                </div>
                <Button type="submit" disabled={isPending} className="-mt-1 w-full">
                  {isPending ? <LoaderCircle className="animate-spin" /> : 'Sign up'}
                </Button>
              </div>
            </Form>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {providerNames.map(providerName => (
                <ProviderConnectionForm providerName={providerName} type="Sign up" key={providerName} />
              ))}
            </div>
            <div className="grid text-sm gap-6">
              <div className="text-center">
                Already have an account?{' '}
                <Link to="/login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
              <Link
                to="/privacy-policy"
                className=" text-center text-muted-foreground hover:text-foreground text-xs hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

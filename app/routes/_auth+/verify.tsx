import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import type { SubmissionResult } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { validateRequest } from '~/.server/verification';
import { Button, FieldError, Label } from '~/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '~/components/ui/OneTimePasswordInput';
import { useDelayedIsPending } from '~/hooks';

export const TYPES = ['sign-up'] as const; // add more types of verification here
const VerificationTypeSchema = z.enum(TYPES);
export const TYPE_QUERY_PARAM = 'type';
export const TARGET_QUERY_PARAM = 'target';
export const CODE_QUERY_PARAM = 'code';
export const REDIRECT_TO_QUERY_PARAM = 'redirectTo';
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>;

export const VerifySchema = z.object({
  [CODE_QUERY_PARAM]: z.string().min(6).max(6),
  [TYPE_QUERY_PARAM]: VerificationTypeSchema,
  [TARGET_QUERY_PARAM]: z.string(),
  [REDIRECT_TO_QUERY_PARAM]: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  return await validateRequest(request, formData);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;

  if (!params.has(CODE_QUERY_PARAM)) {
    // if the user decides not to use the magic link
    return {};
  }

  return validateRequest(request, params);
}

export default function VerifyRoute() {
  const [searchParams] = useSearchParams();
  const [validationCode, setValidationCode] = useState('');
  const isPending = useDelayedIsPending();

  const [form, fields] = useForm({
    id: 'one-time-password-form',
    lastResult: useActionData<SubmissionResult<string[]>>(),
    constraint: getZodConstraint(VerifySchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onSubmit',
    defaultValue: {
      [TARGET_QUERY_PARAM]: searchParams.get(TARGET_QUERY_PARAM) ?? '',
      [TYPE_QUERY_PARAM]: searchParams.get(TYPE_QUERY_PARAM) ?? '',
      [REDIRECT_TO_QUERY_PARAM]: searchParams.get(REDIRECT_TO_QUERY_PARAM),
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifySchema });
    },
  });

  return (
    <main className="flex-grow mx-auto py-20 sm:py-56">
      <Card className="w-full max-w-lg pt-6 sm:px-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Please verify your account</CardTitle>
          <CardDescription>
            We&apos;ve sent you an email with a verification code. You can either click the magic link in the email or
            enter the code below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" {...getFormProps(form)} className="flex flex-col items-center gap-y-3 pt-3">
            <input {...getInputProps(fields[TARGET_QUERY_PARAM], { type: 'hidden' })} />
            <input {...getInputProps(fields[TYPE_QUERY_PARAM], { type: 'hidden' })} />
            <input {...getInputProps(fields[REDIRECT_TO_QUERY_PARAM], { type: 'hidden' })} />
            <Label htmlFor={fields[CODE_QUERY_PARAM].id} className="justify-start">
              Enter one-time passcode
            </Label>
            <InputOTP
              {...getInputProps(fields[CODE_QUERY_PARAM], { type: 'text' })}
              maxLength={6}
              autoFocus={true}
              autoComplete="one-time-code"
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={validationCode}
              onChange={curr => setValidationCode(curr)}
              disabled={isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldError field={fields[CODE_QUERY_PARAM]} />
            <Button type="submit" disabled={isPending} variant="secondary" className="w-24">
              {isPending ? <LoaderCircle className="animate-spin" /> : 'Submit'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import type { SubmissionResult } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { z } from 'zod';
import { validateRequest } from '~/.server/verification';
import { Button, FieldError, FormErrors, Label } from '~/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/ui/OneTimePasswordInput';

export const TYPE_QUERY_PARAM = 'type';
export const TARGET_QUERY_PARAM = 'target';
export const CODE_QUERY_PARAM = 'code';
export const REDIRECT_TO_QUERY_PARAM = 'redirectTo';

export const VerifySchema = z.object({
  [CODE_QUERY_PARAM]: z.string().min(5).max(5),
  [TYPE_QUERY_PARAM]: z.enum(['sign-up']), // add more types of verification here
  [TARGET_QUERY_PARAM]: z.string(),
  [REDIRECT_TO_QUERY_PARAM]: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(formData.get(CODE_QUERY_PARAM));
  return validateRequest(request, formData);
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

  const [form, fields] = useForm({
    id: 'one-time-password-form',
    lastResult: useActionData<SubmissionResult<string[]>>(),
    constraint: getZodConstraint(VerifySchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onSubmit',
    defaultValue: {
      [TARGET_QUERY_PARAM]: searchParams.get(TARGET_QUERY_PARAM) ?? '',
      [TYPE_QUERY_PARAM]: searchParams.get(TYPE_QUERY_PARAM) ?? '',
      ...(searchParams.has(REDIRECT_TO_QUERY_PARAM)
        ? { [REDIRECT_TO_QUERY_PARAM]: searchParams.get(REDIRECT_TO_QUERY_PARAM) }
        : {}),
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifySchema });
    },
  });
  return (
    <main className="flex-grow mx-auto py-44 sm:py-64">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Please verify your account</CardTitle>
          <CardDescription>
            We&apos;ve sent you an email with a verification code. You can either click the magic link in the email or
            enter the code below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" {...getFormProps(form)} className="flex flex-col items-center gap-y-3 pt-3">
            <input
              {...getInputProps(fields[TARGET_QUERY_PARAM], { type: 'hidden' })}
              key={fields[TARGET_QUERY_PARAM].id}
            />
            <input {...getInputProps(fields[TYPE_QUERY_PARAM], { type: 'hidden' })} key={fields[TYPE_QUERY_PARAM].id} />
            <input
              {...getInputProps(fields[REDIRECT_TO_QUERY_PARAM], { type: 'hidden' })}
              key={fields[REDIRECT_TO_QUERY_PARAM].id}
            />

            <Label htmlFor={fields[CODE_QUERY_PARAM].id} className="justify-start">
              Enter one-time password
            </Label>
            <InputOTP
              maxLength={5}
              {...getInputProps(fields[CODE_QUERY_PARAM], { type: 'text' })}
              autoFocus
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              key={fields[CODE_QUERY_PARAM].id}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
            <FieldError field={fields[CODE_QUERY_PARAM]} />
            <Button type="submit">Submit</Button>
            <FormErrors errors={form.errors} errorId={form.errorId} />
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

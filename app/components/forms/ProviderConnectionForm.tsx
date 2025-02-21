import { Form } from '@remix-run/react';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { z } from 'zod';
import { Button } from '~/components/ui';
import { useIsPending } from '~/hooks';

export const FACEBOOK_PROVIDER_NAME = 'facebook';
export const GOOGLE_PROVIDER_NAME = 'google';

export const providerNames = [FACEBOOK_PROVIDER_NAME, GOOGLE_PROVIDER_NAME] as const;
export const ProviderNamesSchema = z.enum(providerNames);
export type ProviderName = z.infer<typeof ProviderNamesSchema>;

export const providerLabels: Record<ProviderName, string> = {
  [FACEBOOK_PROVIDER_NAME]: 'Facebook',
  [GOOGLE_PROVIDER_NAME]: 'Google',
};

export const providerIcons: Record<ProviderName, React.ReactNode> = {
  [FACEBOOK_PROVIDER_NAME]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
    </svg>
  ),
  [GOOGLE_PROVIDER_NAME]: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  ),
} as const;

export default function ProviderConnectionForm({
  type,
  providerName,
}: {
  type: 'Connect' | 'Log in' | 'Sign up';
  providerName: ProviderName;
}) {
  const formAction = `/auth/${providerName}`;
  const isPending = useIsPending({ formAction });
  return (
    <Form method="POST" action={formAction} className="col-start-2 w-full">
      <Button type="submit" disabled={isPending} variant="outline" className="w-full">
        {isPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <span className="inline-flex items-center gap-1.5">
            {providerIcons[providerName]}
            {type} with {providerLabels[providerName]}
          </span>
        )}
      </Button>
    </Form>
  );
}

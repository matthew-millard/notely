import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/.server/connections';
import { ProviderNamesSchema } from '~/components/forms/ProviderConnectionForm';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const providerName = ProviderNamesSchema.parse(params.provider);

  const authResult = await authenticator.authenticate(providerName, request).then(
    data =>
      ({
        success: true,
        data,
      } as const),
    error =>
      ({
        success: false,
        error,
      } as const)
  );

  if (!authResult.success) {
    console.error(authResult.error);
    throw redirect('/login');
  }

  console.log('authResults data:', authResult.data);

  return redirect('/sign-up');
}

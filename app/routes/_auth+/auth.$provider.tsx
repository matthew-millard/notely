import { ActionFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/.server/connections';
import { ProviderNamesSchema } from '~/components/forms/ProviderConnectionForm';

export async function action({ request, params }: ActionFunctionArgs) {
  const providerName = ProviderNamesSchema.parse(params.provider);

  try {
    return await authenticator.authenticate(providerName, request);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw error;
  }
}

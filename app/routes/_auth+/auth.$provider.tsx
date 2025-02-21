import { ActionFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/.server/connections';
import { ProviderNamesSchema } from '~/components/forms/ProviderConnectionForm';

export async function action({ request, params }: ActionFunctionArgs) {
  const providerName = ProviderNamesSchema.parse(params.provider);

  const connection = await authenticator.authenticate(providerName, request);
  console.log('connection', connection);

  return connection;
}

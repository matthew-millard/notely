import { LoaderFunctionArgs } from '@remix-run/node';
import { ProviderNamesSchema } from '~/components/forms/ProviderConnectionForm';

export async function loader({ params }: LoaderFunctionArgs) {
  const providerName = ProviderNamesSchema.parse(params.provider);
  console.log('providerName', providerName);
  return {};
}

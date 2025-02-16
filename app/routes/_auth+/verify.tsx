import { LoaderFunctionArgs } from '@remix-run/node';
import { requireAnonymous } from '~/.server/auth';
import { CODE_QUERY_PARAM, validateRequest } from '~/.server/verification';
import { H1 } from '~/components/typography';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);

  const url = new URL(request.url);
  const params = url.searchParams;

  // The user could either verify by clicking the magic link or by entering the otp
  if (!params.has(CODE_QUERY_PARAM)) {
    return {};
  }

  return validateRequest(request, params);
}

export default function VerifyRoute() {
  return <H1>Verfiy route</H1>;
}

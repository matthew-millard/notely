import { LoaderFunctionArgs } from '@remix-run/node';
import { requireAnonymous } from '~/.server/auth';
import { H1 } from '~/components/typography';

export const TYPE_QUERY_PARAM = 'type';
export const TARGET_QUERY_PARAM = 'target';
export const CODE_QUERY_PARAM = 'code';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);

  const url = new URL(request.url);
  const params = url.searchParams;
  const type = params.get(TYPE_QUERY_PARAM);
  const target = params.get(TARGET_QUERY_PARAM);

  //   Two things can happen here. The user could either verify by clicking the magic link or by entering the otp
  if (!params.has(CODE_QUERY_PARAM)) {
    return {};
  }

  return {};
}

export default function VerifyRoute() {
  return <H1>Verfiy route</H1>;
}

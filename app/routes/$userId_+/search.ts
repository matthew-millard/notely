import { json, LoaderFunctionArgs } from '@remix-run/node';

export async function action() {
  throw new Response('Not allowed', { status: 405 });
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Next step is to query the database and search for relative notes and return them to the client
  const query = new URL(request.url).searchParams.get('query');
  console.log('query', query);

  return json({ query });
}

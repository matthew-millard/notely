import { ArrowRightIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { requireAnonymous } from '~/.server/auth';
import { Emphasis, H1, Lead, P } from '~/components/typography';
import { Button } from '~/components/ui';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return null;
}

export default function IndexRoute() {
  return (
    <main className="mx-auto max-w-2xl flex-grow py-10 sm:py-48">
      <div>
        <div className="text-center">
          <H1>Save, organize, and access your ideas anytime, anywhere.</H1>
          <Lead>
            <Emphasis>Notely</Emphasis> is your cloud-based digital notebook that keeps your notes safe, secure, and at
            your fingertips—completely <Emphasis>free</Emphasis>.
          </Lead>
          <div className="mt-6">
            <P>
              Enjoy seamless synchronization across devices, a clean and intuitive interface, and peace of mind knowing
              your ideas are always within reach.
            </P>
          </div>
          <div className="mt-10">
            <Link to="/sign-up" prefetch="viewport">
              <Button>
                Get Started <ArrowRightIcon />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export const meta = () => {
  const siteName = 'Notely';
  const author = 'Matt Millard';
  const description = 'Your cloud-based digital notebook that keeps your notes safe, secure, and at your fingertips.';
  const ogImage =
    'https://res.cloudinary.com/hospohub/image/upload/v1743782436/screen_shot_1024x1024_icon-1_iiipmf.png';
  const ogAltText = 'Matt sitting at his computer coding.';

  return [
    // Basic Metadata
    {
      title: siteName,
    },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'author',
      content: author,
    },

    // Open Graph Metadata
    {
      name: 'og:title',
      content: siteName,
    },
    {
      name: 'og:description',
      content: description,
    },
    {
      name: 'og:image',
      content: ogImage,
    },
    {
      name: 'og:image:alt',
      content: ogAltText,
    },
    {
      name: 'og:site_name',
      content: siteName,
    },
    {
      name: 'og:type',
      content: 'website',
    },
  ];
};

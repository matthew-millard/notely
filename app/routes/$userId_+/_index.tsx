import { FilePlusIcon, PlusIcon } from '@radix-ui/react-icons';
import { Link } from '@remix-run/react';
import { H4 } from '~/components/typography';
import { Button } from '~/components/ui';

export default function UserDashboardRoute() {
  return (
    <main className="flex justify-center">
      <div className="flex flex-col items-center w-full border rounded-md border-dashed p-10 mx-6 gap-y-1">
        <FilePlusIcon className="h-8 w-8" />
        <H4>Create a new note</H4>
        <Link to="notes/new" className="mt-2">
          <Button>
            <PlusIcon />
            New note
          </Button>
        </Link>
      </div>
    </main>
  );
}

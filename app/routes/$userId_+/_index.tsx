import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { Link } from '@remix-run/react';
import { Button } from '~/components/ui';

export default function UserDashboardRoute() {
  return (
    <main className="flex justify-center">
      <div className="flex flex-col items-center w-full border rounded-md border-dashed p-10 mx-6">
        <Pencil1Icon className="h-6 w-6 text-muted-foreground" />
        <h5 className="font-medium text-foreground text-base mt-2">Create a new note</h5>
        <p className="font-light text-sm text-muted-foreground mt-1">Get started by creating your first note</p>
        <Link to="notes/new" className="mt-6">
          <Button>
            <PlusIcon />
            New Note
          </Button>
        </Link>
      </div>
    </main>
  );
}

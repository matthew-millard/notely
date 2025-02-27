import { randomUUID } from 'node:crypto';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
import { Button } from '~/components/ui';

const SUCCESS = 'success';
const ERROR = 'error';
const INFO = 'info';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const type = formData.get('type');

  let toastSession;

  switch (type) {
    case SUCCESS:
      toastSession = await setToastCookie(request, {
        id: randomUUID(),
        type: SUCCESS,
        title: 'Success',
        description: 'Currently displaying a successful message',
      });
      break;
    case ERROR:
      toastSession = await setToastCookie(request, {
        id: randomUUID(),
        type: ERROR,
        title: 'Error',
        description: 'Currently displaying a error message',
      });
      break;
    case INFO:
      toastSession = await setToastCookie(request, {
        id: randomUUID(),
        type: INFO,
        title: 'Info',
        description: 'Currently displaying an info message',
      });
      break;
    default: {
      throw new Error('Invalid type');
    }
  }

  return redirect('/test-toast', {
    headers: {
      'Set-Cookie': await toastSessionStorage.commitSession(toastSession),
    },
  });
}

export default function TestToastRoute() {
  return (
    <main className="flex w-full justify-center items-center min-h-svh">
      <Form method="POST">
        <div className="grid grid-cols-3 gap-2">
          <Button type="submit" name="type" value={SUCCESS} variant={'secondary'} className="w-24">
            Success
          </Button>
          <Button type="submit" name="type" value={ERROR} variant={'secondary'} className="w-24">
            Error
          </Button>
          <Button type="submit" name="type" value={INFO} variant={'secondary'} className="w-24">
            Info
          </Button>
        </div>
      </Form>
    </main>
  );
}

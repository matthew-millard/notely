import { ExitIcon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";
import { Button } from "../ui";

export default function LogOutForm() {
  return (
    <Form method="POST" action="/logout">
      <Button variant="secondary" size="sm">
        <ExitIcon />
        Log out
      </Button>
    </Form>
  );
}

import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "~/.server/auth";

export async function loader() {
  throw redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}

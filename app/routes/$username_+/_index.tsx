import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/.server/auth";
// import { P } from "~/components/typography";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return null;
}

export default function IndexRoute() {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] lg:grid-cols-[288px_2.5rem_minmax(0,1fr)_2.5rem]">
      {/* <div className="col-start-1 row-span-full row-start-1 max-lg:hidden">
        <P>Left aside</P>
      </div>

      <div className="col-start-2 row-span-5 row-start-1 w-10 border-x max-lg:hidden"></div>

      <div className="relative row-start-1 grid grid-cols-subgrid lg:col-start-3">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
          <main className="px-4 pb-24 pt-10 sm:px-6 xl:pr-0">
            <P>Main content</P>
          </main>
        </div>
      </div>

      <div className="col-start-4 row-span-5 row-start-1 w-10 border-x max-lg:hidden"></div> */}
    </div>
  );
}

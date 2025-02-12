import { Outlet } from "@remix-run/react";
import { Footer, Header } from "~/components/layouts";

export default function UsernameLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

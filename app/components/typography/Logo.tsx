import { Link } from "@remix-run/react";

export default function Logo() {
  return (
    <Link
      to="/"
      prefetch="intent"
      className="group inline-flex items-baseline leading-none"
    >
      <span className="text-base font-semibold group-hover:text-primary">
        Notely
      </span>
      <span className="ml-1 text-xl">🐘</span>
    </Link>
  );
}

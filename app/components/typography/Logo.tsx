import { Link } from '@remix-run/react';

export default function Logo() {
  return (
    <Link to="/" prefetch="intent" className="group leading-none tracking-wide">
      <span className="text-xl text-primary group-hover:text-primary/90">Notely</span>
    </Link>
  );
}

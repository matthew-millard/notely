import { Link } from '@remix-run/react';
import ThemeSwitch from '../ui/ThemeSwitch';

export default function Footer() {
  return (
    <footer className="hidden h-14 items-center justify-center border-t md:flex">
      <div className="container flex items-center justify-between">
        <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
          Privacy Policy
        </Link>
        <ThemeSwitch />
      </div>
    </footer>
  );
}

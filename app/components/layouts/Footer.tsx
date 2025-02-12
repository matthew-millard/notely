import ThemeSwitch from "../ui/ThemeSwitch";

export default function Footer() {
  return (
    <footer className="hidden h-14 items-center justify-center border-t md:flex">
      <div className="container flex justify-end">
        <ThemeSwitch />
      </div>
    </footer>
  );
}

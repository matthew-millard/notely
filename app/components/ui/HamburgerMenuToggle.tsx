import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { type DrawerProps } from "../layouts/Drawer";
import { Button } from "./Button";

export default function HamburgerMenuToggle({
  isDrawerOpen,
  setIsDrawerOpen,
}: DrawerProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDrawerOpen(!isDrawerOpen)}
    >
      <HamburgerMenuIcon />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );
}

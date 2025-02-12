import { NavLink } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { classNames } from "~/utils";
import { navLinks } from "./Header";

export interface DrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Drawer({ isDrawerOpen, setIsDrawerOpen }: DrawerProps) {
  return (
    <DrawerPrimitive.Root
      open={isDrawerOpen}
      onOpenChange={(open) => setIsDrawerOpen(open)}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DrawerPrimitive.Content className="bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[96%] min-h-[60%] flex-col rounded-t-[10px] border">
          <DrawerPrimitive.Title className="sr-only">
            Navigation menu
          </DrawerPrimitive.Title>
          <DrawerPrimitive.Description className="sr-only">
            A drawer used as a mobile navigation menu.
          </DrawerPrimitive.Description>
          <div className="bg-muted mx-auto mt-6 h-2 w-[100px] rounded-full" />

          <nav className="flex flex-col space-y-10 overflow-auto p-6">
            {navLinks.map((link) => (
              <NavLink
                to={link.href}
                key={link.title}
                prefetch="intent"
                className={({ isActive }) =>
                  classNames(
                    "hover:text-foreground/80 text-foreground transition-colors",
                    isActive
                      ? "hover:decoration-primary/80 underline decoration-primary underline-offset-4"
                      : "",
                  )
                }
              >
                {link.title}
              </NavLink>
            ))}
          </nav>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

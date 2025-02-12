import { Dispatch, SetStateAction } from "react";

interface CommandTriggerProps {
  isCommandDialogOpen: boolean;
  setIsCommandDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CommandTrigger({
  isCommandDialogOpen,
  setIsCommandDialogOpen,
}: CommandTriggerProps) {
  return (
    <button
      type="button"
      onClick={() => setIsCommandDialogOpen((prev) => !prev)}
      className="focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground bg-muted/50 text-muted-foreground relative inline-flex h-8 w-full items-center justify-start gap-2 whitespace-nowrap rounded-[0.5rem] border px-4 py-2 text-sm font-normal shadow-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-56 xl:w-64 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    >
      <span className="sr-only">
        {isCommandDialogOpen ? "Close command dialog" : "Open command dialog"}
      </span>
      <span className="inline-flex lg:hidden">Search...</span>
      <span className="hidden lg:inline-flex">Search notes</span>
      <kbd className="bg-muted pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>
        {"K"}
      </kbd>
    </button>
  );
}

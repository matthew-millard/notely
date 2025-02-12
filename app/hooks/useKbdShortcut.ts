import { Dispatch, SetStateAction, useEffect } from "react";

export default function useKbdShortcut(
  key: string,
  setter: Dispatch<SetStateAction<boolean>>,
) {
  return useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === key) {
        event.preventDefault();
        setter(true);
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, [key, setter]);
}

import { useEffect } from "react";

export const useKeyboardShortcut = (
  shortcutKey: string,
  callback: () => void
): void => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === shortcutKey) {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeydown, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [shortcutKey, callback]);
};

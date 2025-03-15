import React, {
  createContext,
  useState,
  useEffect,
  FC,
  ReactNode,
  useContext,
} from "react";
import { KeyBindings } from "../interfaces/KeyBindings";

const defaultKeyState: KeyBindings = {
  timer1: "q",
  timer2: "w",
  restart: "R",
  switch: "a",
  pause: "P",
  next: ".",
  previous: ",",
};

interface KeyContextType {
  keys: KeyBindings;
  updateKey: (keyName: keyof KeyBindings, value: string | null) => void;
}

export const KeyContext = createContext<KeyContextType | undefined>(undefined);

interface KeyProviderProps {
  children: ReactNode;
}

export const KeyProvider: FC<KeyProviderProps> = ({ children }) => {
  const [keys, setKeys] = useState<KeyBindings>(defaultKeyState);

  const loadDefaultKeyBindings = async (): Promise<void> => {
    try {
      const response = await fetch("../../public/defaultKeyBindings.json");
      if (!response.ok) {
        throw new Error("Failed to load default key bindings");
      }
      const data: KeyBindings = await response.json();
      setKeys({
        timer1: data.timer1,
        timer2: data.timer2,
        restart: data.restart,
        switch: data.switch,
        pause: data.pause,
        next: data.next,
        previous: data.previous, // Corrected assignment
      });
    } catch (error) {
      console.error("Error loading default settings:", error);
    }
  };

  useEffect(() => {
    loadDefaultKeyBindings();
  }, []);

  const updateKey = (keyName: keyof KeyBindings, value: string | null) => {
    setKeys((prevKeys) => ({
      ...prevKeys,
      [keyName]: value,
    }));
  };

  return (
    <KeyContext.Provider value={{ keys, updateKey }}>
      {children}
    </KeyContext.Provider>
  );
};

export const useKeyContext = (): KeyContextType => {
  const context = useContext(KeyContext);
  if (!context) {
    throw new Error("useKeyContext must be used within a KeyProvider");
  }
  return context;
};

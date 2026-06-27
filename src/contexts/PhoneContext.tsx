"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface PhoneContextType {
  phone: string;
  setPhone: (phone: string) => void;
}

const PhoneContext = createContext<PhoneContextType>({
  phone: "",
  setPhone: () => {},
});

export function PhoneProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState("");
  return (
    <PhoneContext.Provider value={{ phone, setPhone }}>
      {children}
    </PhoneContext.Provider>
  );
}

export function usePhone() {
  return useContext(PhoneContext);
}

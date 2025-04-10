import { ReactNode } from "react";
import Header from "./Header.comp";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

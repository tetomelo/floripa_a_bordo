import type { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function AppShell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen relative pb-28">
        {children}
      </div>
      {nav && <BottomNav />}
    </div>
  );
}

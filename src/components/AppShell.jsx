import BottomNav from "./BottomNav.jsx";

export default function AppShell({ children, nav = true }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen relative pb-28">
        {children}
      </div>
      {nav && <BottomNav />}
    </div>
  );
}

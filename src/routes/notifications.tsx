import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, AlertTriangle, Tag, Route as RouteIcon } from "lucide-react";
import AppShell from "@/components/AppShell";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notificações — Floripa a Bordo" }] }),
  component: Notifications,
});

const iconMap = { cloud: CloudSun, alert: AlertTriangle, tag: Tag, route: RouteIcon } as const;
const colorMap: Record<string, string> = {
  Clima: "bg-aqua/20 text-primary",
  Aviso: "bg-destructive/15 text-destructive",
  Promo: "bg-emerald-100 text-emerald-700",
  Rota: "bg-violet-100 text-violet-700",
};

function Notifications() {
  return (
    <AppShell>
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <p className="text-sm text-muted-foreground">Alertas marítimos, clima e promoções</p>
      </header>

      <div className="px-5 space-y-3">
        {notifications.map((n) => {
          const Icon = iconMap[n.icon as keyof typeof iconMap] || CloudSun;
          return (
            <div key={n.id} className="rounded-2xl bg-card border border-border p-4 shadow-card flex gap-3">
              <div className="size-10 rounded-xl bg-secondary grid place-items-center text-primary shrink-0">
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm">{n.title}</h3>
                  <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                <span className={`mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorMap[n.tag]}`}>
                  {n.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, MapPin, Navigation2, Zap, DollarSign, Sparkles, Waves, Anchor } from "lucide-react";
import AppShell from "@/components/AppShell";
import ClientOnly from "@/components/ClientOnly";
import FloripaMap from "@/components/FloripaMap";
import { suggestions, terminals } from "@/lib/mock-data";
import { store, useApp } from "@/lib/app-store";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Início — Floripa a Bordo" }] }),
  component: Home,
});

const typeMeta = {
  rapida: { icon: Zap, label: "Rápida", color: "text-amber-500" },
  economica: { icon: DollarSign, label: "Econômica", color: "text-emerald-500" },
  turistica: { icon: Sparkles, label: "Turística", color: "text-violet-500" },
  tranquila: { icon: Waves, label: "Tranquila", color: "text-sky-500" },
  melhor: { icon: Anchor, label: "Melhor", color: "text-primary" },
} as const;

function Home() {
  const { user, recentTrips } = useApp();
  const navigate = useNavigate();

  return (
    <AppShell>
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <p className="text-xs text-muted-foreground">Olá, navegante</p>
        <h1 className="text-2xl font-bold">{user?.name || "Bem-vindo"} 🌊</h1>
      </header>

      {/* Search */}
      <div className="px-5">
        <div className="glass rounded-2xl shadow-card border border-border flex items-center gap-2 px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Para onde vamos navegar?"
            className="bg-transparent outline-none text-sm flex-1"
            onFocus={() => navigate({ to: "/map" })}
          />
        </div>
      </div>

      {/* Map preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mt-4 mx-5 h-64 rounded-3xl overflow-hidden shadow-float relative"
      >
        <ClientOnly fallback={<div className="size-full bg-ocean-light animate-pulse" />}>
          <FloripaMap height="100%" interactive={false} />
        </ClientOnly>
        <Link
          to="/map"
          className="absolute bottom-3 right-3 glass rounded-full px-4 py-2 text-xs font-semibold shadow-card flex items-center gap-1"
        >
          <Navigation2 className="size-3.5" /> Abrir mapa
        </Link>
      </motion.div>

      {/* Quick actions */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Link to="/map" className="rounded-2xl bg-gradient-ocean text-white p-4 shadow-card">
          <MapPin className="size-5" />
          <div className="mt-3 font-semibold text-sm">Escolher origem</div>
          <div className="text-xs text-white/70">Toque no mapa</div>
        </Link>
        <Link to="/map" className="rounded-2xl bg-card border border-border p-4 shadow-card">
          <Navigation2 className="size-5 text-primary" />
          <div className="mt-3 font-semibold text-sm">Escolher destino</div>
          <div className="text-xs text-muted-foreground">Onde quer ir?</div>
        </Link>
      </div>

      {/* Suggestions */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Sugestões inteligentes</h2>
          <Link to="/map" className="text-xs text-primary font-medium">Ver tudo</Link>
        </div>
        <div className="space-y-3">
          {suggestions.map((s) => {
            const meta = typeMeta[s.type];
            const Icon = meta.icon;
            const from = terminals.find((t) => t.id === s.from)?.name;
            const to = terminals.find((t) => t.id === s.to)?.name;
            return (
              <motion.button
                whileTap={{ scale: 0.98 }}
                key={s.id}
                onClick={() => { store.setRoute(s); navigate({ to: "/route-result" }); }}
                className="w-full text-left rounded-2xl bg-card border border-border p-4 shadow-card flex items-center gap-3"
              >
                <div className={`size-10 rounded-xl bg-secondary grid place-items-center ${meta.color}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{meta.label}</div>
                  <div className="font-semibold text-sm truncate">{from} → {to}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.durationMin} min · {s.distanceKm} km · R$ {s.priceBRL.toFixed(2)}
                  </div>
                </div>
                <div className="text-primary text-xs font-semibold">Ver →</div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Recent trips */}
      {recentTrips.length > 0 && (
        <section className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Viagens recentes</h2>
            <button onClick={() => store.clearTrips()} className="text-xs text-muted-foreground">Limpar</button>
          </div>
          <div className="space-y-2">
            {recentTrips.slice(0, 5).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  store.setRoute({
                    ...suggestions[0],
                    label: `${t.origin} → ${t.destination}`,
                    path: [t.originCoords, t.destinationCoords],
                  });
                  navigate({ to: "/route-result" });
                }}
                className="w-full text-left rounded-2xl bg-card border border-border p-3 shadow-card flex items-center gap-3"
              >
                <div className="size-9 rounded-xl bg-secondary grid place-items-center text-primary">
                  <Navigation2 className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{t.origin} → {t.destination}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(t.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Terminals */}
      <section className="px-5 mt-6">
        <h2 className="font-semibold mb-3">Terminais próximos</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x">
          {terminals.slice(0, 5).map((t) => (
            <div key={t.id} className="min-w-[180px] snap-start rounded-2xl bg-gradient-ocean text-white p-4 shadow-card">
              <Anchor className="size-5" />
              <div className="mt-3 font-semibold">{t.name}</div>
              <div className="text-xs text-white/80">{t.area}</div>
              <div className="mt-2 text-[11px] text-white/70">⏱ {t.schedule}</div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

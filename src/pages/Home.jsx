import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Navigation2, Zap, DollarSign, Sparkles, Waves, Anchor, Ship, Heart } from "lucide-react";
import AppShell from "@/components/AppShell.jsx";
import ClientOnly from "@/components/ClientOnly.jsx";
import FloripaMap from "@/components/FloripaMap.jsx";
import { suggestions, terminals } from "@/lib/mock-data";
import { store, useApp } from "@/lib/app-store";

const typeMeta = {
  rapida: { icon: Zap, label: "Rápida", color: "text-amber-500" },
  economica: { icon: DollarSign, label: "Econômica", color: "text-emerald-500" },
  turistica: { icon: Sparkles, label: "Turística", color: "text-violet-500" },
  tranquila: { icon: Waves, label: "Tranquila", color: "text-sky-500" },
  melhor: { icon: Anchor, label: "Melhor", color: "text-primary" },
};

export default function Home() {
  const { user, recentTrips, favorites } = useApp();
  const navigate = useNavigate();

  return (
    <AppShell>
      <header className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Ship className="size-5 text-primary" />
          <span className="text-lg font-bold tracking-tight">Floripa a Bordo</span>
        </div>
        <p className="text-xs text-muted-foreground">Olá, navegante</p>
        <h1 className="text-2xl font-bold">{user?.name || "Bem-vindo"} 🌊</h1>
      </header>

      <div className="px-5">
        <div className="glass rounded-2xl shadow-card border border-border flex items-center gap-2 px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Para onde vamos navegar?"
            className="bg-transparent outline-none text-sm flex-1"
            onFocus={() => navigate("/map")}
          />
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-4 mx-5 h-64 rounded-3xl overflow-hidden shadow-float relative"
      >
        <ClientOnly fallback={<div className="size-full bg-ocean-light animate-pulse" />}>
          <FloripaMap height="100%" interactive={false} />
        </ClientOnly>
        <Link to="/map" className="absolute bottom-3 right-3 glass rounded-full px-4 py-2 text-xs font-semibold shadow-card flex items-center gap-1">
          <Navigation2 className="size-3.5" /> Abrir mapa
        </Link>
      </motion.div>

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
            const isFav = favorites.includes(s.id);
            return (
              <motion.div
                whileTap={{ scale: 0.98 }}
                key={s.id}
                className="w-full text-left rounded-2xl bg-card border border-border p-4 shadow-card flex items-center gap-3"
              >
                <button
                  onClick={() => { store.setRoute(s); navigate("/route-result"); }}
                  className="flex flex-1 items-center gap-3 min-w-0 text-left"
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
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); store.toggleFav(s.id); }}
                  aria-label={isFav ? "Remover dos favoritos" : "Favoritar rota"}
                  className={`size-9 grid place-items-center rounded-full transition-colors ${isFav ? "bg-destructive/15 text-destructive" : "bg-secondary text-muted-foreground"}`}
                >
                  <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

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
                    id: `trip-${t.id}`,
                    from: null,
                    to: null,
                    label: `${t.origin} → ${t.destination}`,
                    path: [t.originCoords, t.destinationCoords],
                  });
                  navigate("/route-result");
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

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Route as RouteIcon, DollarSign, Waves, Heart, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell.jsx";
import ClientOnly from "@/components/ClientOnly.jsx";
import FloripaMap from "@/components/FloripaMap.jsx";
import { store, useApp } from "@/lib/app-store";
import { suggestions, terminals } from "@/lib/mock-data";

export default function RouteResult() {
  const { activeRoute, favorites } = useApp();
  const navigate = useNavigate();
  const route = activeRoute ?? suggestions[0];
  const isFav = favorites.includes(route.id);

  // Prefer the explicit label set when generating the route (origin → destination).
  // Fall back to terminal lookup only when no label was provided.
  const [labelFrom, labelTo] = (route.label || "").split("→").map((s) => s.trim());
  const fromName = labelFrom || terminals.find((t) => t.id === route.from)?.name || "Origem";
  const toName = labelTo || terminals.find((t) => t.id === route.to)?.name || "Destino";

  return (
    <AppShell>
      <div className="relative h-[55vh]">
        <ClientOnly fallback={<div className="size-full bg-ocean-light animate-pulse" />}>
          <FloripaMap
            path={route.path}
            origin={route.path[0]}
            destination={route.path[route.path.length - 1]}
            showTerminals={false}
            interactive={false}
          />
        </ClientOnly>
        <button onClick={() => navigate("/map")} className="absolute top-12 left-4 size-10 glass rounded-full grid place-items-center shadow-card">
          <ArrowLeft className="size-5" />
        </button>
        <button
          onClick={() => store.toggleFav(route.id)}
          className={`absolute top-12 right-4 size-10 rounded-full grid place-items-center shadow-card ${isFav ? "bg-destructive text-white" : "glass"}`}
        >
          <Heart className={`size-5 ${isFav ? "fill-current" : ""}`} />
        </button>
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-8 bg-background rounded-t-[2.5rem] px-5 pt-6 pb-6 shadow-float"
      >
        <div className="mx-auto w-10 h-1.5 rounded-full bg-muted mb-4" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Rota sugerida</div>
            <h1 className="text-xl font-bold">{fromName} → {toName}</h1>
            <div className="text-xs text-aqua font-medium mt-1">Mar: {route.conditions}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">R$ {route.priceBRL.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">por passageiro</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat icon={<Clock className="size-4" />} label="Duração" value={`${route.durationMin} min`} />
          <Stat icon={<RouteIcon className="size-4" />} label="Distância" value={`${route.distanceKm} km`} />
          <Stat icon={<Waves className="size-4" />} label="Mar" value={route.conditions} />
        </div>

        <h2 className="mt-6 font-semibold text-sm">Alternativas</h2>
        <div className="mt-2 space-y-2">
          {suggestions.filter((s) => s.id !== route.id).slice(0, 3).map((s) => (
            <button
              key={s.id}
              onClick={() => store.setRoute(s)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card"
            >
              <div className="size-9 rounded-xl bg-secondary grid place-items-center">
                <DollarSign className="size-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.durationMin} min · R$ {s.priceBRL.toFixed(2)}</div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <Link to="/trip-details" className="mt-5 block w-full bg-gradient-ocean text-white font-semibold rounded-2xl py-4 text-center shadow-card">
          Confirmar embarque
        </Link>
      </motion.div>
    </AppShell>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-secondary p-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

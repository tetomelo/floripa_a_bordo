import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation2, ArrowLeft, Crosshair, Sparkles, Search, X, Map as MapIcon } from "lucide-react";
import AppShell from "@/components/AppShell";
import ClientOnly from "@/components/ClientOnly";
import FloripaMap from "@/components/FloripaMap";
import { suggestions, terminals, FLORIPA_CENTER } from "@/lib/mock-data";
import { store } from "@/lib/app-store";
export const Route = createFileRoute("/map")({
    head: () => ({ meta: [{ title: "Mapa — Floripa a Bordo" }] }),
    component: MapPage,
});
function MapPage() {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState({ coords: FLORIPA_CENTER, label: "Centro de Florianópolis" });
    const [destination, setDestination] = useState(null);
    const [mode, setMode] = useState("destination");
    const [originQuery, setOriginQuery] = useState("");
    const [destQuery, setDestQuery] = useState("");
    const [focused, setFocused] = useState(null);
    const [mapActive, setMapActive] = useState(false);
    const activeQuery = focused === "origin" ? originQuery : destQuery;
    const matches = useMemo(() => {
        const q = activeQuery.trim().toLowerCase();
        if (!q)
            return terminals;
        return terminals.filter((t) => t.name.toLowerCase().includes(q) || t.area.toLowerCase().includes(q));
    }, [activeQuery]);
    const handleClick = (c) => {
        const point = { coords: c, label: coordLabel(c) };
        if (mode === "origin") {
            setOrigin(point);
            setOriginQuery(point.label);
        }
        else {
            setDestination(point);
            setDestQuery(point.label);
        }
    };
    const selectTerminal = (t) => {
        const point = { coords: t.coords, label: t.name };
        if (focused === "origin") {
            setOrigin(point);
            setOriginQuery(t.name);
        }
        else {
            setDestination(point);
            setDestQuery(t.name);
        }
        setFocused(null);
    };
    const generate = () => {
        if (!origin || !destination)
            return;
        const best = suggestions[0];
        // Resolve from/to terminal IDs from the chosen coordinates so we don't
        // inherit suggestions[0]'s "t1 → t5" (which was forcing Centro → Sambaqui
        // on every generated route).
        const matchTerminal = (c) => terminals.find((t) => t.coords[0] === c[0] && t.coords[1] === c[1])?.id ?? null;
        store.setRoute({
            ...best,
            id: `gen-${Date.now()}`,
            from: matchTerminal(origin.coords),
            to: matchTerminal(destination.coords),
            label: `${origin.label} → ${destination.label}`,
            path: [origin.coords, destination.coords],
        });
        store.addTrip({
            origin: origin.label,
            destination: destination.label,
            originCoords: origin.coords,
            destinationCoords: destination.coords,
        });
        navigate({ to: "/route-result" });
    };
    return (<AppShell>
      <div className={`absolute inset-0 pb-28 transition-opacity duration-700 ${mapActive ? "opacity-100" : "opacity-40"}`}>
        <ClientOnly fallback={<div className="size-full bg-ocean-light animate-pulse"/>}>
          <FloripaMap origin={origin?.coords} destination={destination?.coords} onMapClick={handleClick}/>
        </ClientOnly>

        <AnimatePresence>
          {!mapActive && (<motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => setMapActive(true)} className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 backdrop-blur-[2px] z-[500] cursor-pointer">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="glass rounded-2xl px-6 py-4 shadow-card border border-white/40 flex flex-col items-center gap-2">
                <MapIcon className="size-8 text-white/90"/>
                <span className="text-sm font-semibold text-white/90">Toque para explorar o mapa</span>
              </motion.div>
            </motion.button>)}
        </AnimatePresence>
      </div>

      {/* Top bar */}
      <div className="relative px-4 pt-12" style={{ zIndex: 1000 }}>
        <div className="glass rounded-2xl shadow-card border border-white/40 flex items-center gap-2 p-2">
          <button onClick={() => navigate({ to: "/home" })} className="size-9 grid place-items-center rounded-xl bg-white/60">
            <ArrowLeft className="size-4"/>
          </button>
          <div className="flex-1 space-y-1">
            <InputRow icon={<MapPin className="size-3.5 text-aqua"/>} label="Origem" placeholder="De onde você sai?" value={originQuery} active={mode === "origin"} onFocus={() => { setMode("origin"); setFocused("origin"); }} onChange={(v) => { setOriginQuery(v); if (!v)
        setOrigin(null); }} onClear={() => { setOriginQuery(""); setOrigin(null); }}/>
            <InputRow icon={<Navigation2 className="size-3.5 text-primary"/>} label="Destino" placeholder="Para onde vamos navegar?" value={destQuery} active={mode === "destination"} onFocus={() => { setMode("destination"); setFocused("destination"); }} onChange={(v) => { setDestQuery(v); if (!v)
        setDestination(null); }} onClear={() => { setDestQuery(""); setDestination(null); }}/>
          </div>
        </div>

        {/* Suggestions dropdown */}
        {focused && (<div className="mt-2 glass rounded-2xl shadow-card border border-white/40 overflow-hidden max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/40">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Search className="size-3.5"/>
                Terminais e locais
              </div>
              <button onClick={() => setFocused(null)} className="text-xs text-primary font-semibold">Fechar</button>
            </div>
            {matches.length === 0 ? (<div className="px-4 py-6 text-center text-xs text-muted-foreground">
                Nenhum terminal encontrado. Toque no mapa para escolher um ponto.
              </div>) : (matches.map((t) => (<button key={t.id} onClick={() => selectTerminal(t)} className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-white/60 transition-colors border-b border-white/20 last:border-0">
                  <div className="size-8 rounded-lg bg-gradient-ocean grid place-items-center text-white text-xs">📍</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{t.area} · {t.schedule}</div>
                  </div>
                </button>)))}
          </div>)}

        {!focused && (<div className="mt-3 flex gap-2 overflow-x-auto">
            {terminals.slice(0, 4).map((t) => (<button key={t.id} onClick={() => {
                    const point = { coords: t.coords, label: t.name };
                    if (mode === "origin") {
                        setOrigin(point);
                        setOriginQuery(t.name);
                    }
                    else {
                        setDestination(point);
                        setDestQuery(t.name);
                    }
                }} className="shrink-0 glass rounded-full px-3 py-1.5 text-xs font-medium shadow-card border border-white/40">
                📍 {t.name}
              </button>))}
          </div>)}
      </div>

      {/* Bottom action */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="absolute bottom-28 inset-x-4 space-y-2" style={{ zIndex: 1000 }}>

        <button className="w-full glass rounded-full py-3 text-sm font-semibold shadow-card border border-white/40 flex items-center justify-center gap-2">
          <Crosshair className="size-4"/> Minha localização
        </button>
        <button onClick={generate} disabled={!origin || !destination} className="w-full bg-gradient-ocean text-white font-semibold rounded-full py-4 shadow-float flex items-center justify-center gap-2 disabled:opacity-50">
          <Sparkles className="size-4"/> Gerar rota inteligente
        </button>
      </motion.div>
    </AppShell>);
}
function InputRow({ icon, label, placeholder, value, active, onFocus, onChange, onClear, }) {
    return (<div className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-colors ${active ? "bg-white/80" : "bg-white/40"}`}>
      {icon}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <input value={value} onFocus={onFocus} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground/70"/>
      </div>
      {value && (<button onClick={onClear} className="size-6 grid place-items-center rounded-full bg-white/60 text-muted-foreground">
          <X className="size-3"/>
        </button>)}
    </div>);
}
function coordLabel([lat, lng]) {
    return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

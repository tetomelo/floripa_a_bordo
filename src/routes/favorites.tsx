import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Heart, Clock, Trash2, Ship } from "lucide-react";
import AppShell from "@/components/AppShell";
import { useApp, store } from "@/lib/app-store";
import { suggestions, terminals } from "@/lib/mock-data";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favoritos — Floripa a Bordo" }] }),
  component: Favorites,
});

function Favorites() {
  const { favorites } = useApp();
  const navigate = useNavigate();
  const favRoutes = suggestions.filter((s) => favorites.includes(s.id));

  return (
    <AppShell>
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Favoritos</h1>
        <p className="text-sm text-muted-foreground">Suas rotas salvas e histórico recente</p>
      </header>

      <section className="px-5">
        <h2 className="font-semibold text-sm mb-2 flex items-center gap-2"><Heart className="size-4 text-destructive" /> Rotas salvas</h2>
        {favRoutes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhuma rota salva ainda.<br />
            <Link to="/home" className="text-primary font-medium">Explorar rotas →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {favRoutes.map((s) => {
              const from = terminals.find((t) => t.id === s.from)?.name;
              const to = terminals.find((t) => t.id === s.to)?.name;
              return (
                <div key={s.id} className="rounded-2xl bg-card border border-border p-4 shadow-card flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-ocean grid place-items-center text-white">
                    <Ship className="size-5" />
                  </div>
                  <button onClick={() => { store.setRoute(s); navigate({ to: "/route-result" }); }} className="flex-1 text-left">
                    <div className="font-semibold text-sm">{from} → {to}</div>
                    <div className="text-xs text-muted-foreground">{s.durationMin} min · R$ {s.priceBRL.toFixed(2)}</div>
                  </button>
                  <button onClick={() => store.toggleFav(s.id)} className="size-9 rounded-xl grid place-items-center text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="px-5 mt-6">
        <h2 className="font-semibold text-sm mb-2 flex items-center gap-2"><Clock className="size-4 text-primary" /> Histórico de viagens</h2>
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((s, i) => {
            const from = terminals.find((t) => t.id === s.from)?.name;
            const to = terminals.find((t) => t.id === s.to)?.name;
            return (
              <button
                key={s.id}
                onClick={() => { store.setRoute(s); navigate({ to: "/route-result" }); }}
                className="w-full text-left rounded-2xl bg-secondary p-4 flex items-center gap-3"
              >
                <div className="size-9 rounded-full bg-card grid place-items-center text-xs font-bold text-primary">{i + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{from} → {to}</div>
                  <div className="text-xs text-muted-foreground">há {i + 1} {i === 0 ? "dia" : "dias"}</div>
                </div>
                <span className="text-xs text-primary font-medium">Repetir →</span>
              </button>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}

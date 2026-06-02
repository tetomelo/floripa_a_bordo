import { useNavigate } from "react-router-dom";
import { Settings, Heart, Clock, Bell, Shield, LogOut, ChevronRight, Crown, ArrowLeft, Moon, Sun } from "lucide-react";
import AppShell from "@/components/AppShell.jsx";
import { store, useApp } from "@/lib/app-store";

export default function Profile() {
  const { user, favorites, theme } = useApp();
  const navigate = useNavigate();
  const initials = (user?.name || "N N").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const isDark = theme === "dark";

  return (
    <AppShell>
      <header className="bg-gradient-deep text-white px-5 pt-12 pb-10 rounded-b-[2rem]">
        <button
          onClick={() => navigate(-1)}
          className="size-9 grid place-items-center rounded-full bg-white/15 mb-4"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-white/15 grid place-items-center font-bold text-xl">{initials}</div>
          <div>
            <h1 className="text-xl font-bold">{user?.name || "Convidado"}</h1>
            <p className="text-white/70 text-sm">{user?.email || "—"}</p>
          </div>
        </div>
      </header>

      <div className="px-5 -mt-6">
        <div className="rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 p-4 shadow-float flex items-center gap-3">
          <Crown className="size-6" />
          <div className="flex-1">
            <div className="font-bold text-sm">Floripa a Bordo Premium</div>
            <div className="text-xs">Rotas ilimitadas, sem anúncios e descontos exclusivos.</div>
          </div>
          <button className="bg-amber-950 text-amber-50 text-xs font-semibold px-3 py-2 rounded-xl">Assinar</button>
        </div>
      </div>

      <div className="px-5 mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat label="Viagens" value="12" />
        <Stat label="Favoritos" value={String(favorites.length)} />
        <Stat label="Pontos" value="340" />
      </div>

      <div className="px-5 mt-6">
        <div className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4">
          {isDark ? <Moon className="size-4 text-primary" /> : <Sun className="size-4 text-primary" />}
          <div className="flex-1">
            <div className="text-sm font-medium">Modo escuro</div>
            <div className="text-xs text-muted-foreground">
              {isDark ? "Ativado" : "Desativado"} — alterne quando quiser.
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={() => store.toggleTheme()}
            className={`relative h-7 w-12 rounded-full transition-colors ${isDark ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 size-6 rounded-full bg-card shadow transition-transform ${isDark ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      </div>

      <ul className="mt-6 px-5 space-y-1.5">
        {[
          { icon: Heart, label: "Rotas favoritas", to: "/favorites" },
          { icon: Clock, label: "Histórico", to: "/favorites" },
          { icon: Bell, label: "Notificações", to: "/notifications" },
          { icon: Settings, label: "Configurações", to: "/profile" },
          { icon: Shield, label: "Privacidade e segurança", to: "/profile" },
        ].map(({ icon: Icon, label, to }) => (
          <li key={label}>
            <button onClick={() => navigate(to)} className="w-full flex items-center gap-3 rounded-2xl bg-card border border-border p-4 text-sm">
              <Icon className="size-4 text-primary" />
              <span className="flex-1 text-left font-medium">{label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>

      <div className="px-5 mt-4">
        <button
          onClick={() => { store.logout(); navigate("/login"); }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 text-destructive font-semibold py-3 text-sm"
        >
          <LogOut className="size-4" /> Sair da conta
        </button>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-secondary p-3">
      <div className="font-bold text-lg">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

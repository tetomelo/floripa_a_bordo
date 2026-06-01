import { Link, useLocation } from "@tanstack/react-router";
import { Home, Map, Heart, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
const items = [
    { to: "/home", icon: Home, label: "Início" },
    { to: "/map", icon: Map, label: "Mapa" },
    { to: "/favorites", icon: Heart, label: "Favoritos" },
    { to: "/notifications", icon: Bell, label: "Alertas" },
    { to: "/profile", icon: User, label: "Perfil" },
];
export default function BottomNav() {
    const { pathname } = useLocation();
    return (<motion.nav initial={{ y: 80 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 24 }} className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]" aria-label="Navegação principal">
      <div className="mx-auto max-w-md px-3 pb-3">
        <ul className="glass shadow-float rounded-3xl border border-white/40 flex items-center justify-between px-2 py-2">
          {items.map(({ to, icon: Icon, label }) => {
            const active = pathname === to || (to === "/home" && pathname === "/");
            return (<li key={to} className="flex-1">
                <Link to={to} aria-label={label} className="relative flex flex-col items-center gap-0.5 py-2 rounded-2xl">
                  {active && (<motion.span layoutId="nav-active" className="absolute inset-0 rounded-2xl bg-gradient-ocean" transition={{ type: "spring", stiffness: 350, damping: 30 }}/>)}
                  <Icon className={`relative size-5 ${active ? "text-white" : "text-muted-foreground"}`} strokeWidth={2.2}/>
                  <span className={`relative text-[10px] font-medium ${active ? "text-white" : "text-muted-foreground"}`}>{label}</span>
                </Link>
              </li>);
        })}
        </ul>
      </div>
    </motion.nav>);
}

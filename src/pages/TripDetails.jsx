import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation2, Clock, Calendar, Ticket, Ship, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import AppShell from "@/components/AppShell.jsx";
import { useApp } from "@/lib/app-store";
import { suggestions, terminals } from "@/lib/mock-data";

export default function TripDetails() {
  const { activeRoute } = useApp();
  const navigate = useNavigate();
  const route = activeRoute ?? suggestions[0];

  const [labelFrom, labelTo] = (route.label || "").split("→").map((s) => s.trim());
  const fromT = terminals.find((t) => t.id === route.from);
  const toT = terminals.find((t) => t.id === route.to);
  const fromName = fromT?.name || labelFrom || "Origem";
  const fromArea = fromT?.area || "";
  const toName = toT?.name || labelTo || "Destino";
  const toArea = toT?.area || "";

  const depart = new Date();
  depart.setMinutes(depart.getMinutes() + 15);
  const arrive = new Date(depart.getTime() + route.durationMin * 60000);
  const fmt = (d) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <AppShell>
      <header className="bg-gradient-deep text-white px-5 pt-12 pb-8 rounded-b-[2rem]">
        <button onClick={() => navigate("/route-result")} className="size-10 grid place-items-center rounded-full bg-white/15">
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="mt-4 text-2xl font-bold">Sua travessia</h1>
        <p className="text-white/70 text-sm">Confirme os detalhes do embarque</p>
      </header>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="px-5 -mt-5">
        <div className="rounded-3xl bg-card border border-border shadow-float p-5">
          <Row icon={<MapPin className="size-4 text-aqua" />} label="Origem" value={fromName} sub={fromArea} />
          <div className="my-3 ml-[15px] border-l-2 border-dashed border-border h-6" />
          <Row icon={<Navigation2 className="size-4 text-primary" />} label="Destino" value={toName} sub={toArea} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Card icon={<Calendar className="size-4" />} label="Partida" value={fmt(depart)} sub="Hoje" />
          <Card icon={<Clock className="size-4" />} label="Chegada" value={fmt(arrive)} sub={`${route.durationMin} min`} />
          <Card icon={<Ship className="size-4" />} label="Distância" value={`${route.distanceKm} km`} sub={route.conditions} />
          <Card icon={<Ticket className="size-4" />} label="Valor" value={`R$ ${route.priceBRL.toFixed(2)}`} sub="por passageiro" />
        </div>

        <div className="mt-4 rounded-2xl bg-accent/30 border border-accent/40 p-4 flex items-start gap-3">
          <CheckCircle2 className="size-5 text-primary mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold">Tudo certo para zarpar!</div>
            <p className="text-muted-foreground text-xs">Chegue ao terminal 10 minutos antes do horário de partida.</p>
          </div>
        </div>

        <Link to="/home" className="mt-5 block w-full bg-gradient-ocean text-white font-semibold rounded-2xl py-4 text-center shadow-card">
          Concluir embarque
        </Link>
      </motion.div>
    </AppShell>
  );
}

function Row({ icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-full bg-secondary grid place-items-center">{icon}</div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-semibold text-sm">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

function Card({ icon, label, value, sub }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="text-primary">{icon}</div>
      <div className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

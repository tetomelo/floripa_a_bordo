import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ship, Mail, Lock, ArrowRight } from "lucide-react";
import { store } from "@/lib/app-store";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const res = store.authenticate(email, pwd);
    if (!res.ok) {
      setError(res.error || "Não foi possível entrar.");
      return;
    }
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-deep text-white relative overflow-hidden">
      <div className="absolute -top-32 -right-24 size-80 rounded-full bg-aqua/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-ocean/40 blur-3xl" />
      <div className="relative px-6 pt-16 pb-8">
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
          <div className="size-10 rounded-xl bg-white/15 grid place-items-center"><Ship className="size-5" /></div>
          <span className="font-display font-semibold">Floripa a Bordo</span>
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mt-10 text-3xl font-bold">
          Bem-vindo a bordo
        </motion.h1>
        <p className="mt-2 text-white/70 text-sm">Entre com sua conta ou crie uma nova ao continuar.</p>
      </div>
      <motion.form
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={submit}
        className="relative bg-background text-foreground rounded-t-[2.5rem] px-6 pt-8 pb-10 mt-4 min-h-[60vh] shadow-float"
      >
        <div className="space-y-4">
          <Field icon={<Mail className="size-4" />} label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" />
          <Field icon={<Lock className="size-4" />} label="Senha" type="password" value={pwd} onChange={setPwd} placeholder="••••••••" />
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
          <div className="text-right">
            <button type="button" className="text-xs text-primary font-medium hover:underline">Esqueci minha senha</button>
          </div>
        </div>
        <button type="submit" className="mt-6 w-full bg-gradient-ocean text-white font-semibold rounded-2xl py-4 shadow-card flex items-center justify-center gap-2 active:scale-[0.99] transition">
          Entrar <ArrowRight className="size-4" />
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Se ainda não tiver conta, criaremos uma automaticamente.
        </p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prefere o cadastro completo? <Link to="/signup" className="text-primary font-semibold">Criar conta</Link>
        </p>
      </motion.form>
    </div>
  );
}

function Field({ icon, label, type, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 rounded-2xl border border-border bg-input/40 px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
        <span className="text-muted-foreground">{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required placeholder={placeholder} className="w-full bg-transparent outline-none text-sm" />
      </div>
    </label>
  );
}

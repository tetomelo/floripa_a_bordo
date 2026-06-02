import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Ship } from "lucide-react";
import { store } from "@/lib/app-store";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || pwd.length < 4) {
      setError("Preencha todos os campos (senha com 4+ caracteres).");
      return;
    }
    const res = store.signup(name, email, pwd);
    if (!res.ok) {
      setError(res.error || "Não foi possível criar a conta.");
      return;
    }
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-deep text-white px-6 pt-14 pb-10 rounded-b-[2.5rem]">
        <Link to="/login" className="text-white/70 text-sm">← Voltar</Link>
        <div className="mt-6 flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-white/15 grid place-items-center"><Ship className="size-6" /></div>
          <div>
            <h1 className="text-2xl font-bold">Embarque conosco</h1>
            <p className="text-white/70 text-sm">Crie sua conta em segundos</p>
          </div>
        </div>
      </div>
      <form onSubmit={submit} className="px-6 pt-8 space-y-4">
        <Field icon={<User className="size-4" />} label="Nome completo" value={name} onChange={setName} />
        <Field icon={<Mail className="size-4" />} label="E-mail" type="email" value={email} onChange={setEmail} />
        <Field icon={<Lock className="size-4" />} label="Senha" type="password" value={pwd} onChange={setPwd} />
        <button className="mt-4 w-full bg-gradient-ocean text-white font-semibold rounded-2xl py-4 shadow-card flex items-center justify-center gap-2">
          Criar conta <ArrowRight className="size-4" />
        </button>
        <p className="text-center text-xs text-muted-foreground pt-4">
          Ao continuar você aceita os Termos de Uso e a Política de Privacidade.
        </p>
      </form>
    </div>
  );
}

function Field({ icon, label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 rounded-2xl border border-border bg-input/40 px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
        <span className="text-muted-foreground">{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required className="w-full bg-transparent outline-none text-sm" />
      </div>
    </label>
  );
}

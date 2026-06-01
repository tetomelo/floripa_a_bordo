import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ship, Anchor, Compass } from "lucide-react";
import { store } from "@/lib/app-store";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      navigate(store.get().user ? "/home" : "/login");
    }, 1900);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-deep text-white grid place-items-center">
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
          <defs>
            <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q10 10 20 20 T40 20" stroke="white" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>
      <div className="relative text-center px-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="mx-auto mb-6 size-24 rounded-3xl bg-white/15 backdrop-blur grid place-items-center shadow-float animate-wave"
        >
          <Ship className="size-12" strokeWidth={2} />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold"
        >
          Floripa a Bordo
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-white/80 text-sm tracking-wide"
        >
          Transporte marítimo inteligente
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-6 text-white/70 text-xs"
        >
          <div className="flex items-center gap-1.5"><Anchor className="size-4" /> Terminais</div>
          <div className="flex items-center gap-1.5"><Compass className="size-4" /> Rotas</div>
          <div className="flex items-center gap-1.5"><Ship className="size-4" /> Travessias</div>
        </motion.div>
      </div>
    </div>
  );
}

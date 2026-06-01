import { useEffect, useState } from "react";

export default function ClientOnly({ children, fallback = null }) {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return <>{m ? children : fallback}</>;
}

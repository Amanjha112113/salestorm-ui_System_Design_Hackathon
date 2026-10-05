import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function ReservationTimer({ expiresAt }) {
  const [remaining, setRemaining] = useState(
    Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    const t = setInterval(() => {
      const r = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemaining(r);
    }, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const danger = remaining < 60;

  return (
    <div
      className={`flex items-center gap-2 font-mono text-sm ${
        danger ? "text-alert-red" : "text-cyan-glow"
      }`}
    >
      <Clock size={14} />
      <span>Expires in</span>
      <span className="font-bold">
        {mm}:{ss}
      </span>
    </div>
  );
}
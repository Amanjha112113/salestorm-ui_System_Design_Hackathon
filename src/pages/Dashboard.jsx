import { motion } from "framer-motion";
import { Activity, Server, Zap, Shield, GitBranch } from "lucide-react";
import RequestFunnel from "../components/RequestFunnel.jsx";
import RedisCounter from "../components/RedisCounter.jsx";
import ServiceStatusGrid from "../components/ServiceStatusGrid.jsx";
import EventStream from "../components/EventStream.jsx";
import StressControls from "../components/StressControls.jsx";
import { useStore } from "../state/StoreContext.jsx";

export default function Dashboard() {
  const { state } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            CONTROL ROOM
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mt-1">
            System Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Live view of the SALESTORM architecture: request funnel, atomic
            Redis inventory, service health, and the Kafka event stream.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-alert-green/10 border border-alert-green/30">
          <span className="w-2 h-2 rounded-full bg-alert-green pulse-dot" />
          <span className="font-mono text-xs text-alert-green font-bold tracking-wider">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </motion.div>

      {/* Top stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <TopStat icon={<Zap size={14} />} label="TOTAL REQUESTS" value={state.stats.totalRequests} accent="text-cyan-glow" />
        <TopStat icon={<Activity size={14} />} label="ADMITTED" value={state.stats.admitted} accent="text-alert-green" />
        <TopStat icon={<Shield size={14} />} label="BLOCKED" value={state.stats.duplicatesBlocked + state.stats.outOfStock} accent="text-alert-red" />
        <TopStat icon={<GitBranch size={14} />} label="EVENTS" value={state.events.length} accent="text-amber-glow" />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <RequestFunnel />
          <div className="grid md:grid-cols-2 gap-4">
            <RedisCounter />
            <ServiceStatusGrid />
          </div>
        </div>
        <div className="space-y-4">
          <StressControls />
          <EventStream />
        </div>
      </div>

      {/* Architecture note */}
      <div className="mt-6 rounded-xl border border-ink-700/60 bg-ink-900/60 p-5">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-gray-500 uppercase">
          <Server size={12} />
          ARCHITECTURE FLOW
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
          {[
            "CDN/WAF",
            "Load Balancer",
            "API Gateway",
            "Checkout",
            "Inventory (Redis Lua)",
            "Payment (Idempotent)",
            "Kafka",
            "Order",
            "Fulfilment",
            "Notification",
          ].map((s, i, arr) => (
            <span key={s} className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-ink-950/80 border border-ink-700 text-gray-300">
                {s}
              </span>
              {i < arr.length - 1 && (
                <span className="text-cyan-glow">→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopStat({ icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-900/60 p-4">
      <div className={`flex items-center gap-2 text-[10px] font-mono tracking-widest ${accent}`}>
        {icon}
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-bold text-gray-100">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
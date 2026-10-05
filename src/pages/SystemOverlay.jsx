import { motion } from "framer-motion";
import { ArrowLeft, Activity, Server, Zap, Shield, GitBranch } from "lucide-react";
import RequestFunnel from "../components/RequestFunnel.jsx";
import RedisCounter from "../components/RedisCounter.jsx";
import ServiceStatusGrid from "../components/ServiceStatusGrid.jsx";
import EventStream from "../components/EventStream.jsx";
import StressControls from "../components/StressControls.jsx";
import { useStore } from "../state/StoreContext.jsx";

export default function SystemOverlay() {
  const { state, dispatch } = useStore();

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between flex-wrap gap-4"
        >
          <div>
            <button
              onClick={() => dispatch({ type: "SET_MODE", payload: "shop" })}
              className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500 hover:text-flame-500 transition-colors mb-4"
            >
              <ArrowLeft size={12} />
              BACK TO SHOP
            </button>
            <div className="text-[10px] font-mono tracking-[0.3em] text-flame-500">
              SYSTEM VIEW
            </div>
            <h1 className="mt-2 text-4xl font-black text-cream-50 tracking-tight">
              Behind the drop.
            </h1>
            <p className="text-sm text-ink-400 mt-3 max-w-2xl">
              Live view of the architecture handling this flash sale: request
              funnel, atomic Redis inventory, service health, and the Kafka
              event stream.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-acid-400/10 border border-acid-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-acid-400 pulse-dot" />
            <span className="font-mono text-[10px] text-acid-400 font-bold tracking-widest">
              ALL OPERATIONAL
            </span>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <TopStat icon={<Zap size={14} />} label="REQUESTS" value={state.stats.totalRequests} />
          <TopStat icon={<Activity size={14} />} label="ADMITTED" value={state.stats.admitted} />
          <TopStat
            icon={<Shield size={14} />}
            label="BLOCKED"
            value={state.stats.duplicatesBlocked + state.stats.outOfStock}
          />
          <TopStat icon={<GitBranch size={14} />} label="EVENTS" value={state.events.length} />
        </div>

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

        <div className="mt-6 rounded-xl border border-ink-800 bg-ink-900/40 p-6">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500">
            <Server size={12} />
            ARCHITECTURE FLOW
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-mono">
            {[
              "CDN/WAF",
              "Load Balancer",
              "API Gateway",
              "Checkout",
              "Inventory (Redis Lua)",
              "Payment",
              "Kafka",
              "Order",
              "Fulfilment",
              "Notification",
            ].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-ink-950 border border-ink-700 text-cream-50">
                  {s}
                </span>
                {i < arr.length - 1 && <span className="text-flame-500">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopStat({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-ink-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-bold text-cream-50">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
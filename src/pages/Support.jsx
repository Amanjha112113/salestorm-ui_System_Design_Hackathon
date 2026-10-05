import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Truck, RefreshCcw, Headphones, AlertTriangle, Mail, Phone, MessageSquare,
} from "lucide-react";

const TABS = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "returns", label: "Returns", icon: RefreshCcw },
  { id: "products", label: "Product Issues", icon: AlertTriangle },
  { id: "contact", label: "Contact Us", icon: Headphones },
];

export default function Support() {
  const [tab, setTab] = useState("orders");

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-[10px] font-mono tracking-[0.3em] text-flame-500">
            24×7 SUPPORT
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-cream-50 tracking-tight">
            How can we help?
          </h1>
          <p className="mt-3 text-ink-400 max-w-2xl">
            Our team is available round the clock for order issues, delivery
            tracking, returns, and product problems. Pick a topic below.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-10 border-b border-ink-800 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-flame-500 text-flame-500"
                      : "border-transparent text-ink-500 hover:text-cream-50"
                  }`}
                >
                  <Icon size={14} />
                  {t.label.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-10"
          >
            {tab === "orders" && <OrdersTab />}
            {tab === "delivery" && <DeliveryTab />}
            {tab === "returns" && <ReturnsTab />}
            {tab === "products" && <ProductsTab />}
            {tab === "contact" && <ContactTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="p-6 rounded-2xl border border-ink-800 bg-ink-900/40">
      {children}
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-black text-cream-50">Track your order</h2>
        <p className="mt-2 text-sm text-ink-400">
          Enter your order ID to see real-time status. You'll find it in your
          confirmation email or on the Order Confirmed page.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="e.g. A1B2C3D4"
            className="flex-1 px-4 py-3 rounded-xl bg-ink-950 border border-ink-800 text-sm text-cream-50 placeholder:text-ink-600 focus:outline-none focus:border-flame-500"
          />
          <button className="px-6 py-3 rounded-xl bg-cream-50 text-ink-950 font-black text-xs tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-colors">
            TRACK
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-cream-50">
          Common order questions
        </h3>
        <div className="mt-4 space-y-3 text-sm text-ink-400">
          <QA q="Can I change my order after placing it?" a="You can modify items or address within 30 minutes of placing the order. After that, it enters fulfilment and can't be changed." />
          <QA q="My order shows 'Confirmed' but I haven't paid?" a="Payment confirmation can take up to 2 minutes. Refresh your order page — if it stays pending for over 5 minutes, contact support." />
          <QA q="Where do I find my invoice?" a="Invoices are emailed within 1 hour of order confirmation and are also available in your account under Orders." />
        </div>
      </Card>
    </div>
  );
}

function DeliveryTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-black text-cream-50">Delivery timelines</h2>
        <div className="mt-4 space-y-3 text-sm text-ink-400">
          <Row label="Metro cities" value="1–2 business days" />
          <Row label="Tier 2 & 3 cities" value="2–4 business days" />
          <Row label="Remote pin codes" value="4–7 business days" />
          <Row label="Same-day delivery" value="Available in 6 metros" />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-cream-50">
          Delivery concerns
        </h3>
        <div className="mt-4 space-y-3 text-sm text-ink-400">
          <QA q="What if I'm not home when delivery arrives?" a="The courier will attempt delivery twice. After two failed attempts, the parcel returns to our hub and you'll get a callback to reschedule." />
          <QA q="Can I change the delivery address?" a="Yes, before dispatch. Once shipped, address changes aren't possible — but you can refuse delivery and reorder." />
          <QA q="Do you deliver on Sundays?" a="In most metros, yes. Remote pin codes only on business days." />
        </div>
      </Card>
    </div>
  );
}

function ReturnsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-black text-cream-50">Easy returns</h2>
        <p className="mt-2 text-sm text-ink-400">
          Return any product within 7 days of delivery for a full refund.
          Products must be unused, with original packaging and tags.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Step n="1" label="Raise request" />
          <Step n="2" label="Schedule pickup" />
          <Step n="3" label="Get refund" />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-cream-50">Return policy</h3>
        <div className="mt-4 space-y-3 text-sm text-ink-400">
          <QA q="Which items can't be returned?" a="Innerwear, cosmetics, and personal care items can't be returned for hygiene reasons." />
          <QA q="When will I receive my refund?" a="Refunds are initiated within 24 hours of pickup and reflect in your account in 3–5 business days." />
          <QA q="Do I pay for return shipping?" a="No. Return shipping is free for all eligible products." />
        </div>
      </Card>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-black text-cream-50">
          Product issue? We'll fix it.
        </h2>
        <p className="mt-2 text-sm text-ink-400">
          Damaged, defective, or wrong item? Report it within 48 hours of
          delivery for an instant replacement or full refund.
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <IssueCard icon={<AlertTriangle size={16} />} title="Damaged on arrival" text="Photo evidence within 48h" />
          <IssueCard icon={<RefreshCcw size={16} />} title="Wrong item shipped" text="Free pickup + replacement" />
          <IssueCard icon={<Package size={16} />} title="Missing accessories" text="We'll ship the missing parts" />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-cream-50">
          Warranty support
        </h3>
        <div className="mt-4 space-y-3 text-sm text-ink-400">
          <QA q="How do I claim warranty?" a="Contact us with your order ID. We'll coordinate with the brand and provide a service centre reference." />
          <QA q="Is extended warranty available?" a="Yes, at checkout for select products. Covers 2 additional years of manufacturing defects." />
          <QA q="What about refurbished items?" a="All refurbished products come with a 6-month seller warranty, clearly marked on the product page." />
        </div>
      </Card>
    </div>
  );
}

function ContactTab() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <ContactCard icon={<Phone size={20} />} title="Call us" primary="1800-123-4567" secondary="24×7 · Toll-free" />
        <ContactCard icon={<Mail size={20} />} title="Email us" primary="help@salestorm.in" secondary="Response within 4 hours" />
        <ContactCard icon={<MessageSquare size={20} />} title="Live chat" primary="Chat with us" secondary="Available on web & app" />
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-cream-50">
          Head office
        </h3>
        <div className="mt-3 text-sm text-ink-400 leading-relaxed">
          SALESTORM Retail Pvt. Ltd.
          <br />
          4th Floor, Orion Tower, Whitefield Main Road
          <br />
          Whitefield, Bengaluru 560066
          <br />
          Karnataka, India
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-cream-50">Escalations</h3>
        <div className="mt-3 text-sm text-ink-400">
          If your issue isn't resolved within 48 hours, write to{" "}
          <a href="mailto:grievance@salestorm.in" className="text-flame-500 hover:underline">
            grievance@salestorm.in
          </a>{" "}
          with your ticket ID. Our grievance officer responds within 1 business day.
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-ink-800/60 last:border-b-0">
      <span>{label}</span>
      <span className="font-mono text-cream-50">{value}</span>
    </div>
  );
}

function QA({ q, a }) {
  return (
    <div>
      <div className="text-cream-50 font-medium">{q}</div>
      <div className="text-ink-400 mt-1 leading-relaxed">{a}</div>
    </div>
  );
}

function Step({ n, label }) {
  return (
    <div className="p-3 rounded-xl border border-ink-800 bg-ink-950/40 text-center">
      <div className="w-7 h-7 mx-auto rounded-full bg-flame-500 text-ink-950 flex items-center justify-center font-black text-xs">
        {n}
      </div>
      <div className="mt-2 text-xs text-cream-50">{label}</div>
    </div>
  );
}

function IssueCard({ icon, title, text }) {
  return (
    <div className="p-4 rounded-xl border border-ink-800 bg-ink-950/40">
      <div className="text-flame-500">{icon}</div>
      <div className="mt-2 text-xs font-semibold text-cream-50">{title}</div>
      <div className="text-[11px] text-ink-400 mt-1">{text}</div>
    </div>
  );
}

function ContactCard({ icon, title, primary, secondary }) {
  return (
    <div className="p-5 rounded-2xl border border-ink-800 bg-ink-900/40">
      <div className="text-flame-500">{icon}</div>
      <div className="mt-3 text-[10px] font-mono tracking-widest text-ink-500">
        {title.toUpperCase()}
      </div>
      <div className="mt-1 text-sm font-semibold text-cream-50">{primary}</div>
      <div className="mt-0.5 text-[11px] text-ink-500">{secondary}</div>
    </div>
  );
}
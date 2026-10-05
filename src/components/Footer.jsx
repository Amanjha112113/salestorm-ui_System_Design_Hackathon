import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 mt-20">
      {/* ───── TRUST STRIP ───── */}
      <div className="border-b border-ink-800 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-mono tracking-widest text-ink-500">
          <span className="flex items-center gap-2">
            <Clock size={12} className="text-flame-500" />
            24×7 ORDER & DELIVERY SUPPORT
          </span>
          <span className="hidden sm:inline text-ink-700">·</span>
          <span className="flex items-center gap-2">
            <RotateCcw size={12} className="text-flame-500" />
            FREE RETURNS WITHIN 7 DAYS
          </span>
          <span className="hidden sm:inline text-ink-700">·</span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-flame-500" />
            SECURE PAYMENTS
          </span>
          <span className="hidden sm:inline text-ink-700">·</span>
          <span className="flex items-center gap-2">
            <Truck size={12} className="text-flame-500" />
            FREE SHIPPING ABOVE ₹999
          </span>
        </div>
      </div>

      {/* ───── MAIN GRID ───── */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-flame-500 flex items-center justify-center">
              <span className="text-ink-950 font-black text-base">S</span>
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-cream-50">
                SALESTORM
              </div>
              <div className="text-[9px] font-mono tracking-[0.2em] text-ink-600">
                DROP 01 · 2026
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm text-ink-400 leading-relaxed max-w-sm">
            A concurrency-safe flash sale platform. Atomic reservations,
            idempotent payments, traceable orders — engineered for the moment
            everyone clicks at once.
          </p>

          {/* Social icons */}
          <div className="mt-6 flex items-center gap-3">
            <SocialLink
              href="https://instagram.com"
              label="Instagram"
              icon={<Instagram size={15} />}
            />
            <SocialLink
              href="https://facebook.com"
              label="Facebook"
              icon={<Facebook size={15} />}
            />
            <SocialLink
              href="https://twitter.com"
              label="Twitter"
              icon={<Twitter size={15} />}
            />
            <SocialLink
              href="https://youtube.com"
              label="YouTube"
              icon={<Youtube size={15} />}
            />
          </div>
        </div>

        {/* Shop */}
        <FooterColumn title="SHOP">
          <FooterLink to="/">Flash Drop</FooterLink>
          <FooterLink to="/">Phones</FooterLink>
          <FooterLink to="/">Audio</FooterLink>
          <FooterLink to="/">Tops & Dresses</FooterLink>
          <FooterLink to="/">Footwear</FooterLink>
          <FooterLink to="/">Home & Living</FooterLink>
        </FooterColumn>

        {/* Support */}
        <FooterColumn title="SUPPORT">
          <FooterLink to="/support">Help Center</FooterLink>
          <FooterLink to="/support">Track Your Order</FooterLink>
          <FooterLink to="/support">Returns & Refunds</FooterLink>
          <FooterLink to="/support">Shipping Info</FooterLink>
          <FooterLink to="/support">Product Issues</FooterLink>
          <FooterLink to="/support">Contact Us</FooterLink>
        </FooterColumn>

        {/* Reach us */}
        <FooterColumn title="REACH US">
          <li className="flex items-start gap-2.5 text-sm text-ink-400 leading-snug">
            <MapPin size={14} className="text-flame-500 shrink-0 mt-0.5" />
            <span>
              4th Floor, Orion Tower
              <br />
              Whitefield Main Road
              <br />
              Bengaluru 560066, KA
            </span>
          </li>
          <li className="flex items-center gap-2.5 text-sm">
            <Phone size={14} className="text-flame-500 shrink-0" />
            <a
              href="tel:+911800123456"
              className="font-mono text-ink-400 hover:text-cream-50 transition-colors"
            >
              1800-123-4567
            </a>
          </li>
          <li className="flex items-center gap-2.5 text-sm">
            <Mail size={14} className="text-flame-500 shrink-0" />
            <a
              href="mailto:help@salestorm.in"
              className="font-mono text-ink-400 hover:text-cream-50 transition-colors"
            >
              help@salestorm.in
            </a>
          </li>
        </FooterColumn>
      </div>

      {/* ───── 24×7 CALLOUT ───── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 p-5 rounded-2xl border border-flame-500/30 bg-flame-500/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-flame-500/10 border border-flame-500/30 flex items-center justify-center text-flame-500">
              <Clock size={16} />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-flame-500">
                24×7 CUSTOMER CARE
              </div>
              <div className="mt-1 text-sm text-cream-50">
                Order, delivery, product, or refund — we're always on.
              </div>
            </div>
          </div>
          <a
            href="tel:+911800123456"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream-50 text-ink-950 text-xs font-black tracking-widest hover:bg-flame-500 hover:text-cream-50 transition-all"
          >
            <Phone size={12} />
            CALL 1800-123-4567
          </a>
        </div>
      </div>

      {/* ───── BOTTOM STRIP ───── */}
      <div className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono tracking-widest text-ink-600">
          <div>© 2026 SALESTORM · ALL RIGHTS RESERVED</div>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="hover:text-flame-500 transition-colors">
              PRIVACY
            </a>
            <a href="#" className="hover:text-flame-500 transition-colors">
              TERMS
            </a>
            <a href="#" className="hover:text-flame-500 transition-colors">
              COOKIES
            </a>
            <a href="#" className="hover:text-flame-500 transition-colors">
              GRIEVANCE
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ───── HELPERS ───── */

function FooterColumn({ title, children }) {
  return (
    <div>
      <div className="text-[10px] font-mono tracking-widest text-ink-500 mb-4">
        {title}
      </div>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-ink-400 hover:text-flame-500 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-ink-700 flex items-center justify-center text-ink-400 hover:text-flame-500 hover:border-flame-500 transition-colors"
    >
      {icon}
    </a>
  );
}
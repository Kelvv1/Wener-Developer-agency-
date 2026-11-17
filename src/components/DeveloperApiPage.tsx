import React, { useEffect, useRef, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Compass,
  Copy,
  CreditCard,
  Film,
  Globe,
  Info,
  KeyRound,
  LayoutGrid,
  ListChecks,
  MessageCircle,
  Palette,
  Pencil,
  Phone,
  PhoneCall,
  Plus,
  Receipt,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Terminal,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  Video,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import {
  API_PUBLIC_BASE,
  API_RESELLER_BASE,
  BRAND_NAME,
  PRIMARY_API_KEY,
  WHATSAPP_DISPLAY,
  getWhatsAppBuyUrl,
} from "../config/brand";
import { PageHeader } from "./PageHeader";

interface ApiKeyItem {
  id: string;
  name: string;
  fullKey?: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

const SECTIONS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "getting-key", label: "Getting an API Key", icon: KeyRound },
  { id: "auth", label: "Authentication", icon: ShieldCheck },
  { id: "billing", label: "Billing Behavior", icon: CreditCard },
  { id: "features", label: "Check Availability", icon: ListChecks },
  { id: "catalog", label: "Browsing the Catalog", icon: Compass },
  { id: "flash-requests", label: "Flash Requests", icon: Zap },
  { id: "consignment", label: "Consignment Videos", icon: Video },
  { id: "tracking-pages", label: "Tracking Pages", icon: Truck },
  { id: "sites", label: "Site Provisioning", icon: Globe },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "smm", label: "SMM Services", icon: TrendingUp },
  { id: "virtual-numbers", label: "Virtual Numbers", icon: Phone },
  { id: "errors", label: "Error Reference", icon: AlertOctagon },
] as const;

const METHOD_BADGE: Record<"GET" | "POST", string> = {
  GET: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20",
  POST: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20",
};

const CARD_SURFACE =
  "bg-white dark:bg-[#1a1a28] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl";

const INLINE_CODE_CLS =
  "font-mono text-[11px] bg-gray-50 dark:bg-[#222232] border border-gray-100 dark:border-[#2a2a3d] px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300";

function MethodBadge({ method }: { method: "GET" | "POST" }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[11px] font-bold border shrink-0 ${METHOD_BADGE[method]}`}
    >
      {method}
    </span>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className={INLINE_CODE_CLS}>{children}</code>;
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-gray-100 dark:border-[#2a2a3d] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-[#222232] border-b border-gray-100 dark:border-[#2a2a3d]">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          title="Copy"
          className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px]"
        >
          {copied ? (
            <>
              <CheckCircle2 size={12} className="text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-semibold">Copied</span>
            </>
          ) : (
            <Copy size={12} />
          )}
        </button>
      </div>
      <pre className="text-[11.5px] leading-relaxed font-mono text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1a1a28] p-3.5 overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

function Callout({
  variant,
  icon: Icon,
  children,
}: {
  variant: "info" | "warning";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs leading-relaxed ${
        variant === "warning"
          ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
          : "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400"
      }`}
    >
      <Icon size={14} className="shrink-0 mt-0.5" />
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

interface FieldRow {
  name: string;
  type: string;
  required: boolean;
  notes: React.ReactNode;
}

function ParamsTable({ rows }: { rows: FieldRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-[#2a2a3d]">
      <table className="w-full text-xs min-w-[480px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-[#222232] text-gray-400 dark:text-gray-500">
            <th className="text-left font-bold uppercase tracking-widest text-[10px] px-3 py-2">
              Field
            </th>
            <th className="text-left font-bold uppercase tracking-widest text-[10px] px-3 py-2">
              Type
            </th>
            <th className="text-left font-bold uppercase tracking-widest text-[10px] px-3 py-2">
              Required
            </th>
            <th className="text-left font-bold uppercase tracking-widest text-[10px] px-3 py-2">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a3d]">
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="px-3 py-2.5 font-mono text-[11.5px] text-gray-800 dark:text-gray-200 align-top whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 align-top whitespace-nowrap">
                {row.type}
              </td>
              <td className="px-3 py-2.5 align-top whitespace-nowrap">
                {row.required ? (
                  <span className="text-red-500 dark:text-red-400 font-semibold">yes</span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">no</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 align-top">
                {row.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KeyValueTable({
  leftHeader,
  rightHeader,
  rows,
}: {
  leftHeader: string;
  rightHeader: string;
  rows: { left: React.ReactNode; right: React.ReactNode }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-[#2a2a3d]">
      <table className="w-full text-xs min-w-[420px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-[#222232] text-gray-400 dark:text-gray-500">
            <th className="text-left font-bold uppercase tracking-widest text-[10px] px-3 py-2">
              {leftHeader}
            </th>
            <th className="text-left font-bold uppercase tracking-widest text-[10px] px-3 py-2">
              {rightHeader}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a3d]">
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="px-3 py-2.5 font-mono text-[11px] text-gray-700 dark:text-gray-300 align-top whitespace-nowrap tnum">
                {row.left}
              </td>
              <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 align-top">
                {row.right}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function BuyServiceButton({
  item,
  price,
  label = "Buy on WhatsApp",
}: {
  item: string;
  price?: string;
  label?: string;
}) {
  return (
    <a
      href={getWhatsAppBuyUrl(item, price)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-colors no-underline whitespace-nowrap shrink-0"
    >
      <MessageCircle size={13} />
      <span>{label}</span>
      {price && <span className="opacity-90 tnum">· {price}</span>}
    </a>
  );
}

function DocSection({
  id,
  icon: Icon,
  title,
  method,
  path,
  buyItem,
  buyPrice,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  method?: "GET" | "POST";
  path?: string;
  buyItem?: string;
  buyPrice?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${CARD_SURFACE} p-5 sm:p-6 space-y-4 scroll-mt-[84px]`}>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center shrink-0">
              <Icon size={15} className="text-primary" />
            </span>
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          {buyItem && <BuyServiceButton item={buyItem} price={buyPrice} />}
        </div>
        {method && path && (
          <div className="flex items-center gap-2 pl-0 sm:pl-[42px] flex-wrap">
            <MethodBadge method={method} />
            <code className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
              {path}
            </code>
          </div>
        )}
      </div>
      <div className="pl-0 sm:pl-[42px] space-y-4">{children}</div>
    </section>
  );
}

function SubEndpoint({
  title,
  method,
  path,
  buyItem,
  buyPrice,
  children,
}: {
  title: string;
  method: "GET" | "POST";
  path: string;
  buyItem?: string;
  buyPrice?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-[#2a2a3d] first:pt-0 first:border-t-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-white">
            {title}
          </h4>
          <MethodBadge method={method} />
          <code className="text-[11px] font-mono text-gray-500 dark:text-gray-400 break-all">
            {path}
          </code>
        </div>
        {buyItem && <BuyServiceButton item={buyItem} price={buyPrice} label="Order Now" />}
      </div>
      {children}
    </div>
  );
}

function NewApiKeyModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (key: ApiKeyItem) => void;
}) {
  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<{ id: string; name: string; key: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let suffix = "";
    for (let i = 0; i < 40; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const generated = `rsk_${suffix}`;
    const id = `key_${Date.now()}`;
    setCreatedKey({ id, name: trimmed, key: generated });
    onCreated({
      id,
      name: trimmed,
      fullKey: generated,
      keyPrefix: generated.slice(0, 12),
      lastUsedAt: null,
      revokedAt: null,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#161622] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100 dark:border-[#2a2a3d]">
        {createdKey ? (
          <div className="flex flex-col p-6 gap-4">
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
              <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 leading-relaxed">
                Save this key now — it will not be shown again in full. Only the prefix will be visible afterward.
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                API Key
              </p>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-[#222232] rounded-xl border border-gray-100 dark:border-[#2a2a3d]">
                <span className="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                  {createdKey.key}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(createdKey.key).catch(() => {});
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 border border-gray-200 dark:border-[#2a2a3d] text-sm font-semibold text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-[#222232] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2a2a3d] shrink-0">
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  New API Key
                </h2>
                <p className="text-xs text-gray-500">
                  Give it a name so you can recognize it later.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-[#222232] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Key Name *
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1a28] border border-gray-200 dark:border-[#2a2a3d] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 dark:text-white"
                  placeholder="e.g. Production key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2a2a3d] shrink-0">
              <button
                type="button"
                onClick={handleCreate}
                disabled={!name.trim()}
                className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Create Key
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ApiKeyRow({
  apiKey,
  onRevoke,
}: {
  apiKey: ApiKeyItem;
  onRevoke: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  const isRevoked = !!apiKey.revokedAt;

  const handleCopyKey = () => {
    const val = apiKey.fullKey || apiKey.keyPrefix;
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white dark:bg-[#1a1a28] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl ${
        isRevoked ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
          <KeyRound size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {apiKey.name}
            </p>
            {isRevoked && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded">
                Revoked
              </span>
            )}
          </div>
          <p className="text-[11.5px] font-mono text-gray-600 dark:text-gray-300 mt-0.5 break-all">
            {apiKey.fullKey ? apiKey.fullKey : `${apiKey.keyPrefix}…`}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            {apiKey.lastUsedAt
              ? `Last used ${new Date(apiKey.lastUsedAt).toLocaleDateString()}`
              : "Active key"}{" "}
            · Created {new Date(apiKey.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {!isRevoked && (
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {apiKey.fullKey && (
            <button
              type="button"
              onClick={handleCopyKey}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                copied
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-50 dark:bg-[#222232] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#2a2a3d] hover:border-primary hover:text-primary"
              }`}
            >
              {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy Key"}
            </button>
          )}

          {confirming ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onRevoke(apiKey.id);
                  setConfirming(false);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                Confirm Revoke
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-[#222232] transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Revoke ${apiKey.name}`}
              className="p-2 rounded-lg text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function DeveloperApiPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([
    {
      id: "key_wener_primary",
      name: `${BRAND_NAME} — Primary Reseller Key`,
      fullKey: PRIMARY_API_KEY,
      keyPrefix: PRIMARY_API_KEY.slice(0, 12),
      lastUsedAt: null,
      revokedAt: null,
      createdAt: "2026-11-01T10:00:00Z",
    },
  ]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    const sections = contentRef.current?.querySelectorAll("section[id]");
    sections?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleCreated = (newKey: ApiKeyItem) => {
    setKeys((prev) => [newKey, ...prev]);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k))
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Developer / API"
        subtitle={`Built for hiring a developer — use your API key below and share this page with them to connect ${BRAND_NAME} to your own site or app.`}
        buyLabel="Buy Services on WhatsApp"
        buyItem="API Services & Wallet Top-Up"
      />

      <Callout variant="info" icon={Info}>
        <span className="font-semibold">Not a developer yourself? That's fine.</span>{" "}
        This page isn't something you need to figure out alone — copy your access key below, then hand it (and this page) to whoever's building your integration, in-house or hired. To purchase any service, plan, or wallet balance directly, click any buy button to connect with our WhatsApp desk ({WHATSAPP_DISPLAY}).
      </Callout>

      {/* API Keys Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">API Keys</h2>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm shadow-lg shadow-primary/20 transition-all shrink-0 whitespace-nowrap"
          >
            <Plus size={15} />
            New Key
          </button>
        </div>

        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center bg-white dark:bg-[#1a1a28] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl">
            <KeyRound size={26} className="text-gray-300 dark:text-gray-600" />
            <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-xs">
              No API keys yet. Create one to start integrating with the reseller API.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {keys.map((item) => (
              <ApiKeyRow key={item.id} apiKey={item} onRevoke={handleRevoke} />
            ))}
          </div>
        )}
      </div>

      {/* API Reference Header */}
      <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">API Reference</h2>
        </div>
        <a
          href={getWhatsAppBuyUrl("Reseller API Integration & Wallet Funding")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5 no-underline"
        >
          <MessageCircle size={13} />
          Need help or want to buy? WhatsApp {WHATSAPP_DISPLAY}
        </a>
      </div>

      {/* Mobile Anchor Nav */}
      <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 pb-1 w-max">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-semibold border transition-colors no-underline whitespace-nowrap ${
                activeSection === s.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-[#1a1a28] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#2a2a3d]"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop Two-Column Reference Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="hidden lg:block sticky top-[76px]">
          <nav className="pr-1 max-h-[calc(100vh-92px)] overflow-y-auto no-scrollbar">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2">
              On this page
            </p>
            <ul className="space-y-0.5">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const isActive = activeSection === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors no-underline ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1c1c1c]"
                      }`}
                    >
                      <Icon size={13} className="shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div ref={contentRef} className="min-w-0 space-y-6">
          {/* 1. Overview */}
          <DocSection id="overview" icon={BookOpen} title="Overview">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              In plain terms: the Reseller API is what lets a developer connect your own website, app, or business tools directly to {BRAND_NAME}, so things happen automatically instead of someone logging into the {BRAND_NAME} dashboard by hand every time. That can mean ordering virtual numbers, placing SMM orders, buying marketplace products, or launching a tradesinc/incobase website for your own clients — all billed straight from your {BRAND_NAME} wallet.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              You're charged the exact same price a regular logged-in user pays for the same action — there's no extra fee or markup for using the API. This isn't a resale program with special pricing; it's simply a way to automate what you'd otherwise click through in the dashboard yourself.
            </p>
            <CodeBlock label="Base URL" code={API_RESELLER_BASE} />
          </DocSection>

          {/* 2. Getting an API Key */}
          <DocSection id="getting-key" icon={KeyRound} title="Getting an API Key">
            <ol className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed list-decimal list-outside pl-4">
              <li>Log in to your {BRAND_NAME} account normally.</li>
              <li>
                Go to{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Settings → Developer / API
                </span>{" "}
                (this page).
              </li>
              <li>
                Click{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  New Key
                </span>
                , and give it a label (e.g. "Production", "Staging"), or use your pre-provisioned agency key above.
              </li>
              <li>
                Copy the key immediately — store it securely in your environment variables rather than hardcoding it into public client repositories.
              </li>
              <li>
                Fund your wallet balance via our WhatsApp desk ({WHATSAPP_DISPLAY}) — that's what every reseller call debits from.
              </li>
            </ol>
            <Callout variant="warning" icon={ShieldAlert}>
              Treat your API key like a password. Anyone with it can spend your wallet balance. Revoke and rotate a key immediately if it leaks.
            </Callout>
          </DocSection>

          {/* 3. Authentication */}
          <DocSection id="auth" icon={ShieldCheck} title="Authentication">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Every request (all reseller-api endpoints require it) must include:
            </p>
            <CodeBlock label="Header" code={`X-API-Key: ${PRIMARY_API_KEY}`} />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              There is no separate login step and no token expiry — the key is valid until you revoke it yourself from this page.
            </p>
            <KeyValueTable
              leftHeader="Response"
              rightHeader="Meaning"
              rows={[
                {
                  left: (
                    <>
                      401
                      <br />
                      <span className="text-gray-400">
                        {`{ "message": "Missing X-API-Key header." }`}
                      </span>
                    </>
                  ),
                  right: "You didn't send the header at all.",
                },
                {
                  left: (
                    <>
                      401
                      <br />
                      <span className="text-gray-400">
                        {`{ "message": "Invalid or revoked API key." }`}
                      </span>
                    </>
                  ),
                  right: "The key is wrong, or has been revoked.",
                },
              ]}
            />
          </DocSection>

          {/* 4. Billing Behavior */}
          <DocSection
            id="billing"
            icon={CreditCard}
            title="Billing Behavior"
            buyItem="Wallet Balance Top-Up"
          >
            <BulletList
              items={[
                "Every successful call debits your wallet balance immediately, at the same price a normal user would pay.",
                "If a call fails (invalid input, out of stock, provider error, insufficient balance), you are not charged — debit only happens after the underlying action actually succeeds.",
                "Every successful call is logged to your transaction history the same way any other wallet spend is, tagged so you can distinguish reseller-API usage from normal in-app activity.",
                "There is currently no separate rate limit on reseller API calls beyond your wallet balance itself.",
              ]}
            />
            <KeyValueTable
              leftHeader="Response"
              rightHeader="Meaning"
              rows={[
                {
                  left: (
                    <>
                      422
                      <br />
                      <span className="text-gray-400">
                        {`{ "message": "Insufficient balance. You need $X but have $Y." }`}
                      </span>
                    </>
                  ),
                  right: (
                    <span>
                      Fund your wallet via{" "}
                      <a
                        href={getWhatsAppBuyUrl("Wallet Balance Top-Up")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        WhatsApp ({WHATSAPP_DISPLAY})
                      </a>{" "}
                      and retry.
                    </span>
                  ),
                },
                {
                  left: (
                    <>
                      403
                      <br />
                      <span className="text-gray-400">
                        {`{ "message": "This feature is not currently available." }`}
                      </span>
                    </>
                  ),
                  right: `${BRAND_NAME} has temporarily disabled this feature category for all resellers. Not specific to your account — check back later.`,
                },
              ]}
            />
          </DocSection>

          {/* 5. Check Availability */}
          <DocSection
            id="features"
            icon={ListChecks}
            title="Checking What's Available"
            method="GET"
            path="/reseller-api/features"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Returns the 4 feature categories and whether each is currently enabled. Call this first if you want to gracefully skip disabled features rather than discovering it via a 403.
            </p>
            <CodeBlock
              label="cURL"
              code={`curl ${API_RESELLER_BASE}/features \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}"`}
            />
            <CodeBlock
              label="Response — 200"
              code={`[\n  { "key": "virtual_number", "name": "Virtual Numbers", "description": "Rent SMS/OTP-capable virtual phone numbers.", "is_active": true },\n  { "key": "smm", "name": "SMM Services", "description": "Place social media marketing orders.", "is_active": true },\n  { "key": "marketplace", "name": "Marketplace", "description": "Purchase marketplace products.", "is_active": true },\n  { "key": "tenant_provision", "name": "Site Provisioning", "description": "Provision a tradesinc or incobase website.", "is_active": true }\n]`}
            />
          </DocSection>

          {/* 6. Browsing the Catalog */}
          <DocSection id="catalog" icon={Compass} title="Browsing the Catalog">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              These are the same public catalog endpoints the main {BRAND_NAME} app itself uses to render its own product pages — no{" "}
              <InlineCode>X-API-Key</InlineCode> needed, no auth at all.
            </p>
            <CodeBlock label="Base URL" code={API_PUBLIC_BASE} />

            <SubEndpoint
              title="Virtual Number Availability + Pricing"
              method="GET"
              path="/virtual-numbers/prices"
              buyItem="Virtual Number (USA / UK / Global)"
              buyPrice="From $0.60"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Nested by <InlineCode>country</InlineCode> → <InlineCode>service</InlineCode> →{" "}
                <InlineCode>operator</InlineCode>. <InlineCode>cost</InlineCode> is what you'll be charged (same price the reseller endpoint charges),{" "}
                <InlineCode>count</InlineCode> is live stock.
              </p>
              <CodeBlock
                label="Response — 200"
                code={`{\n  "prices": {\n    "usa": {\n      "whatsapp": { "any": { "cost": 2.50, "count": 340 } },\n      "telegram": { "any": { "cost": 1.80, "count": 512 } }\n    },\n    "afghanistan": {\n      "amazon": { "virtual4": { "cost": 0.6, "count": 25000 } }\n    }\n  }\n}`}
              />
              <Callout variant="info" icon={Info}>
                Use the outer key as <InlineCode>country</InlineCode>, the middle key as{" "}
                <InlineCode>service</InlineCode>, and the inner key as <InlineCode>operator</InlineCode> when calling{" "}
                <InlineCode>POST /reseller-api/virtual-numbers</InlineCode>.
              </Callout>
            </SubEndpoint>

            <SubEndpoint
              title="SMM Services"
              method="GET"
              path="/smm/services"
              buyItem="SMM Boosting Service"
              buyPrice="From $0.0063 / 1k"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Flat array, ~10,500 active services (Peakerr's catalog).{" "}
                <InlineCode>price</InlineCode> is per 1000 units — the actual charge for an order is{" "}
                <InlineCode>price × quantity / 1000</InlineCode>, matching what{" "}
                <InlineCode>POST /reseller-api/smm-orders</InlineCode> computes.
              </p>
              <CodeBlock
                label="Response — 200"
                code={`[\n  {\n    "id": 5314,\n    "name": "[ Auto ] Telegram Post Views [ Max Unlimited ] | Last 1 Post",\n    "category": "[ Auto ] Telegram Post View",\n    "price": "0.0063",\n    "min_quantity": 10,\n    "max_quantity": 2147483647,\n    "is_active": true\n  }\n]`}
              />
              <Callout variant="info" icon={Info}>
                Given the size of this list, paginate or filter it client-side by category (or a search box) rather than rendering all ~10k rows at once. Use{" "}
                <InlineCode>id</InlineCode> as <InlineCode>service_id</InlineCode>.
              </Callout>
            </SubEndpoint>

            <SubEndpoint
              title="Marketplace Products"
              method="GET"
              path="/marketplace"
              buyItem="Marketplace Account / Digital Product"
              buyPrice="From $1.49"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Grouped by category, each with its own <InlineCode>products</InlineCode> array.{" "}
                <InlineCode>stock</InlineCode> is live unsold-item count.
              </p>
              <CodeBlock
                label="Response — 200"
                code={`[\n  {\n    "id": 1,\n    "name": "Facebook",\n    "products": [\n      {\n        "id": 1,\n        "name": "USA FB 0-50 FRIENDS | YEAR 2025-2026",\n        "nation": "us",\n        "price": "1.4900",\n        "stock": 67,\n        "is_active": true\n      }\n    ]\n  }\n]`}
              />
              <Callout variant="info" icon={Info}>
                Use a product's <InlineCode>id</InlineCode> as <InlineCode>product_id</InlineCode>.
              </Callout>
            </SubEndpoint>

            <SubEndpoint
              title="Tenant / Site Plans"
              method="GET"
              path="/tenant/products"
              buyItem="Ready-Made Website (Investment Platform or Tesla Website)"
              buyPrice="$100 – $249"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Two products (<InlineCode>monolith</InlineCode> = tradesinc,{" "}
                <InlineCode>decoupled</InlineCode> = incobase), each with a nested{" "}
                <InlineCode>plans</InlineCode> array.
              </p>
              <CodeBlock
                label="Response — 200"
                code={`[\n  {\n    "id": 1,\n    "name": "Investment Platform — Full",\n    "slug": "monolith",\n    "base_domain": "tradesinc.co",\n    "plans": [\n      { "id": 4, "name": "Lifetime", "price": "100.00", "duration_days": 0, "features": { "max_users": "unlimited" }, "is_active": true }\n    ]\n  },\n  {\n    "id": 2,\n    "name": "Tesla Website",\n    "slug": "decoupled",\n    "base_domain": "incobase.pro",\n    "plans": [\n      { "id": 5, "name": "Lifetime", "price": "249.00", "duration_days": 0, "is_active": true }\n    ]\n  }\n]`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={getWhatsAppBuyUrl("Investment Platform — Full (Lifetime Plan)", "$100.00")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-[#2a2a3d] bg-gray-50/70 dark:bg-[#222232] hover:border-primary transition-colors no-underline"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      Investment Platform — Full
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 tnum">
                      Lifetime · $100.00
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-primary whitespace-nowrap">
                    Buy via WhatsApp →
                  </span>
                </a>
                <a
                  href={getWhatsAppBuyUrl("Tesla Website (Lifetime Plan)", "$249.00")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-[#2a2a3d] bg-gray-50/70 dark:bg-[#222232] hover:border-primary transition-colors no-underline"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      Tesla Website
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 tnum">
                      Lifetime · $249.00
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-primary whitespace-nowrap">
                    Buy via WhatsApp →
                  </span>
                </a>
              </div>
              <Callout variant="info" icon={Info}>
                Use a plan's <InlineCode>id</InlineCode> as <InlineCode>plan_id</InlineCode> for{" "}
                <InlineCode>POST /reseller-api/sites</InlineCode>.
              </Callout>
            </SubEndpoint>

            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed italic pt-1">
              That closes the loop — a reseller integration browses these 4 public endpoints to build its own catalog UI, then calls the billable reseller-api endpoints below with the IDs/keys it found.
            </p>
          </DocSection>

          {/* 7. Flash Requests */}
          <DocSection
            id="flash-requests"
            icon={Zap}
            title="Flash Requests"
            method="POST"
            path="/reseller-api/flash-requests"
            buyItem="Crypto Flash Request"
            buyPrice="From $15.00"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Submits a crypto flash request. The service fee is tiered based on the USD value of the amount (not a flat fee) — computed automatically, nothing to look up beforehand.
            </p>
            <ParamsTable
              rows={[
                {
                  name: "platform",
                  type: "string",
                  required: true,
                  notes: (
                    <>
                      <InlineCode>binance</InlineCode> or <InlineCode>trust-wallet</InlineCode>
                    </>
                  ),
                },
                {
                  name: "coin",
                  type: "string",
                  required: true,
                  notes: (
                    <>
                      e.g. <InlineCode>BTC</InlineCode>, <InlineCode>ETH</InlineCode>,{" "}
                      <InlineCode>USDT</InlineCode>, <InlineCode>BNB</InlineCode>,{" "}
                      <InlineCode>USDC</InlineCode>
                    </>
                  ),
                },
                {
                  name: "network",
                  type: "string",
                  required: true,
                  notes: (
                    <>
                      e.g. <InlineCode>BEP20</InlineCode>, <InlineCode>ERC20</InlineCode>
                    </>
                  ),
                },
                { name: "wallet_address", type: "string", required: true, notes: "" },
                {
                  name: "amount",
                  type: "number",
                  required: true,
                  notes: "In the coin's own units, not USD",
                },
              ]}
            />
            <CodeBlock
              label="cURL"
              code={`curl -X POST ${API_RESELLER_BASE}/flash-requests \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" -H "Content-Type: application/json" \\\n  -d '{"platform":"binance","coin":"USDT","network":"BEP20","wallet_address":"0x...","amount":500}'`}
            />
            <CodeBlock
              label="Response — 201"
              code={`{ "id": 12, "platform": "binance", "coin": "USDT", "network": "BEP20", "wallet_address": "0x...", "amount": "500.00000000", "service_fee": 15, "status": "pending" }`}
            />
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Errors
              </p>
              <BulletList
                items={[
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">
                      {`{ "message": "Insufficient balance. Your balance is $X but the service fee is $Y." }`}
                    </span>
                  </>,
                ]}
              />
            </div>
          </DocSection>

          {/* 8. Consignment Videos */}
          <DocSection
            id="consignment"
            icon={Video}
            title="Consignment Videos"
            buyItem="Consignment Video Package"
            buyPrice="$50.00"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Two-step flow: optionally get a presigned upload URL for a receiver photo, then submit the request.
            </p>
            <SubEndpoint
              title="Get Upload URL"
              method="POST"
              path="/reseller-api/consignment-requests/upload-url"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Free, no wallet impact.
              </p>
              <ParamsTable
                rows={[
                  {
                    name: "extension",
                    type: "string",
                    required: true,
                    notes: (
                      <>
                        one of <InlineCode>jpg</InlineCode>, <InlineCode>jpeg</InlineCode>,{" "}
                        <InlineCode>png</InlineCode>, <InlineCode>webp</InlineCode>
                      </>
                    ),
                  },
                  { name: "mime_type", type: "string", required: false, notes: "" },
                ]}
              />
              <CodeBlock
                label="Response"
                code={`{ "upload_url": "https://...presigned-put-url...", "public_url": "https://cdn.../consignment/photos/abc123.jpg" }`}
              />
              <Callout variant="info" icon={Info}>
                Upload the photo directly to <InlineCode>upload_url</InlineCode> (a PUT request with the raw file bytes), then pass <InlineCode>public_url</InlineCode> as{" "}
                <InlineCode>receiver_photo_url</InlineCode> below.
              </Callout>
            </SubEndpoint>

            <SubEndpoint
              title="Submit Consignment Request"
              method="POST"
              path="/reseller-api/consignment-requests"
              buyItem="Consignment Video Request"
              buyPrice="$50.00"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Base fee $50, plus $5 per item in <InlineCode>extras</InlineCode>.
              </p>
              <ParamsTable
                rows={[
                  { name: "receiver_name", type: "string", required: true, notes: "" },
                  { name: "receiver_address", type: "string", required: false, notes: "" },
                  { name: "sender_name", type: "string", required: false, notes: "" },
                  { name: "amount", type: "number", required: true, notes: "" },
                  { name: "notes", type: "string", required: false, notes: "" },
                  {
                    name: "extras",
                    type: "array",
                    required: false,
                    notes: "Each item adds $5 to the fee.",
                  },
                  {
                    name: "receiver_photo_url",
                    type: "string (url)",
                    required: false,
                    notes: (
                      <>
                        the <InlineCode>public_url</InlineCode> from the upload step
                      </>
                    ),
                  },
                ]}
              />
              <CodeBlock
                label="cURL"
                code={`curl -X POST ${API_RESELLER_BASE}/consignment-requests \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" -H "Content-Type: application/json" \\\n  -d '{"receiver_name":"Jane Doe","amount":1500,"extras":["express"],"receiver_photo_url":"https://cdn.../abc123.jpg"}'`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Success — 201: the created consignment request record.
              </p>
              <Callout variant="warning" icon={AlertTriangle}>
                <span className="font-semibold">402</span>{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  {`{ "message": "Insufficient balance. This order costs $X but your balance is $Y." }`}
                </span>{" "}
                — note this one is <span className="font-semibold">402</span>, not 422, unlike every other endpoint.
              </Callout>
            </SubEndpoint>
          </DocSection>

          {/* 9. Tracking Pages */}
          <DocSection
            id="tracking-pages"
            icon={Truck}
            title="Tracking Pages"
            buyItem="Live Shipment Tracking Page"
            buyPrice="$25.00"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Two-step: create the page, then post status events to it over time.
            </p>
            <SubEndpoint
              title="Create Tracking Page"
              method="POST"
              path="/reseller-api/tracking-pages"
              buyItem="Tracking Page Creation"
              buyPrice="$25.00"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Billable — fee is admin-configured (defaults $25; if the admin sets it to $0, page creation is free with no wallet impact at all).
              </p>
              <ParamsTable
                rows={[
                  { name: "carrier", type: "string", required: true, notes: "" },
                  { name: "status", type: "string", required: true, notes: "" },
                  { name: "recipient", type: "string", required: false, notes: "" },
                  { name: "origin", type: "string", required: false, notes: "" },
                  { name: "destination", type: "string", required: false, notes: "" },
                  { name: "eta", type: "date", required: false, notes: "" },
                  {
                    name: "template",
                    type: "string",
                    required: false,
                    notes: (
                      <>
                        one of <InlineCode>minimal</InlineCode>, <InlineCode>fedex</InlineCode>,{" "}
                        <InlineCode>dhl</InlineCode>, <InlineCode>ups</InlineCode>,{" "}
                        <InlineCode>dark</InlineCode>
                      </>
                    ),
                  },
                ]}
              />
              <CodeBlock
                label="cURL"
                code={`curl -X POST ${API_RESELLER_BASE}/tracking-pages \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" -H "Content-Type: application/json" \\\n  -d '{"carrier":"DHL","status":"In Transit","recipient":"Jane Doe","template":"dhl"}'`}
              />
              <CodeBlock
                label="Response — 201"
                code={`{ "id": 7, "code": "K3J8QZ1M9XPL", "carrier": "DHL", "status": "In Transit", "recipient": "Jane Doe", "template": "dhl" }`}
              />
              <Callout variant="info" icon={Info}>
                The public tracking page your client sees is at{" "}
                <InlineCode>https://wenerdeveloper.com/track/{`{code}`}</InlineCode> (uses the existing public{" "}
                <InlineCode>GET /tracking/{`{code}`}</InlineCode> lookup — no API key needed to view it, only to create/update it).
              </Callout>
            </SubEndpoint>

            <SubEndpoint
              title="Add Status Event"
              method="POST"
              path="/reseller-api/tracking-pages/{trackingPage}/events"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Free, adds a status update to a page you already created.
              </p>
              <ParamsTable
                rows={[
                  { name: "title", type: "string", required: true, notes: "" },
                  { name: "location", type: "string", required: false, notes: "" },
                  { name: "description", type: "string", required: false, notes: "" },
                  { name: "occurred_at", type: "date", required: true, notes: "" },
                ]}
              />
              <CodeBlock
                label="cURL"
                code={`curl -X POST ${API_RESELLER_BASE}/tracking-pages/7/events \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" -H "Content-Type: application/json" \\\n  -d '{"title":"Departed facility","location":"Lagos, NG","occurred_at":"2026-08-16T10:00:00Z"}'`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Success — 201: the created event.
              </p>
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  Errors
                </p>
                <BulletList
                  items={[
                    <>
                      <InlineCode>403</InlineCode>{" "}
                      <span className="text-gray-400">{`{ "message": "Forbidden" }`}</span> if the tracking page belongs to a different reseller.
                    </>,
                  ]}
                />
              </div>
            </SubEndpoint>
          </DocSection>

          {/* 10. Site Provisioning */}
          <DocSection
            id="sites"
            icon={Globe}
            title="Site Provisioning"
            method="POST"
            path="/reseller-api/sites"
            buyItem="Site Provisioning (Investment / Tesla Website)"
            buyPrice="From $100.00"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Provisions a full tradesinc (investment platform) or incobase (Tesla website) site for your own client, on a subdomain of your choosing. Get valid{" "}
              <InlineCode>plan_id</InlineCode>s from <InlineCode>GET /tenant/products</InlineCode>.
            </p>
            <ParamsTable
              rows={[
                {
                  name: "plan_id",
                  type: "integer",
                  required: true,
                  notes: "Which product/plan to provision.",
                },
                {
                  name: "subdomain",
                  type: "string",
                  required: true,
                  notes: "3–32 chars, letters/numbers/dashes/underscores only.",
                },
                {
                  name: "base_domain",
                  type: "string",
                  required: false,
                  notes:
                    "Defaults to the plan's own product domain; can be set to the other product's domain (see note below).",
                },
                {
                  name: "site_name",
                  type: "string",
                  required: false,
                  notes: "Display name for the site; defaults to the subdomain.",
                },
                {
                  name: "admin_password",
                  type: "string",
                  required: true,
                  notes:
                    "Min 8 chars — this becomes the login password for the site's own admin panel.",
                },
              ]}
            />
            <CodeBlock
              label="cURL"
              code={`curl -X POST ${API_RESELLER_BASE}/sites \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"plan_id":4,"subdomain":"myclient","site_name":"My Client Site","admin_password":"SecurePass123!"}'`}
            />
            <CodeBlock
              label="Response — 201"
              code={`{\n  "message": "Your site is being set up! You'll receive access details shortly.",\n  "tenant_id": "2128356d-0fa4-4b42-8e25-8ac1324f4f25",\n  "subdomain": "myclient.tradesinc.co",\n  "status": "provisioning"\n}`}
            />
            <Callout variant="info" icon={Info}>
              Provisioning happens asynchronously — poll your site's status, or just wait a minute and visit{" "}
              <InlineCode>https://{`{subdomain}`}/backend</InlineCode> to log in with your account email + the{" "}
              <InlineCode>admin_password</InlineCode> you sent.
            </Callout>
            <Callout variant="warning" icon={AlertTriangle}>
              <span className="font-semibold">Known limitation:</span> requesting the decoupled (Tesla website) plan under the other product's domain (i.e. picking{" "}
              <InlineCode>tradesinc.co</InlineCode> instead of <InlineCode>incobase.pro</InlineCode>) is not currently supported end-to-end and may fail to load after provisioning. Stick to each plan's own domain until this is resolved.
            </Callout>
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Errors
              </p>
              <BulletList
                items={[
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">
                      {`{ "subdomain": ["This subdomain is reserved and cannot be used."] }`}
                    </span>{" "}
                    / <span className="text-gray-400">{`["This subdomain is already taken."]`}</span>
                  </>,
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">
                      {`{ "message": "This plan is currently unavailable." }`}
                    </span>
                  </>,
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">
                      {`{ "message": "Insufficient wallet balance. Please fund your wallet first.", "required": 100, "balance": 42.50 }`}
                    </span>
                  </>,
                ]}
              />
            </div>
          </DocSection>

          {/* 11. Marketplace */}
          <DocSection
            id="marketplace"
            icon={ShoppingBag}
            title="Marketplace"
            method="POST"
            path="/reseller-api/marketplace-orders"
            buyItem="Marketplace Accounts & Digital Goods"
            buyPrice="From $1.49"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Purchases units of a marketplace product (digital goods — codes, accounts, etc., depending on what's listed). Get valid{" "}
              <InlineCode>product_id</InlineCode>s from the normal <InlineCode>GET /marketplace</InlineCode> catalog endpoint.
            </p>
            <ParamsTable
              rows={[
                {
                  name: "product_id",
                  type: "integer",
                  required: true,
                  notes: "Must be an active product.",
                },
                { name: "quantity", type: "integer", required: true, notes: "1–100." },
              ]}
            />
            <CodeBlock
              label="cURL"
              code={`curl -X POST ${API_RESELLER_BASE}/marketplace-orders \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"product_id":5,"quantity":2}'`}
            />
            <CodeBlock
              label="Response — 201"
              code={`{\n  "id": 201,\n  "quantity": 2,\n  "unit_price": "9.99",\n  "total_price": "19.98",\n  "status": "completed",\n  "items": [ { "id": 501, "sold": true }, { "id": 502, "sold": true } ]\n}`}
            />
            <Callout variant="info" icon={Info}>
              Purchased items are returned immediately in the <InlineCode>items</InlineCode> array — this product type has no separate delivery/fulfillment step.
            </Callout>
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Errors
              </p>
              <BulletList
                items={[
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">{`{ "message": "Only X items in stock." }`}</span>
                  </>,
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">
                      {`{ "message": "Insufficient balance. You need $X but have $Y." }`}
                    </span>
                  </>,
                ]}
              />
            </div>
          </DocSection>

          {/* 12. SMM Services */}
          <DocSection
            id="smm"
            icon={TrendingUp}
            title="SMM Services"
            method="POST"
            path="/reseller-api/smm-orders"
            buyItem="SMM Boosting Order"
            buyPrice="From $0.01"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Places a social media marketing order against an existing service. Get valid{" "}
              <InlineCode>service_id</InlineCode>s and their min/max quantity from the normal{" "}
              <InlineCode>GET /smm/services</InlineCode> catalog endpoint.
            </p>
            <ParamsTable
              rows={[
                {
                  name: "service_id",
                  type: "integer",
                  required: true,
                  notes: "Must reference an active SMM service.",
                },
                {
                  name: "quantity",
                  type: "integer",
                  required: true,
                  notes: "Must respect that service's min/max quantity.",
                },
                {
                  name: "target",
                  type: "string",
                  required: true,
                  notes: "The link/handle/URL the order applies to, max 1000 chars.",
                },
                {
                  name: "extra_fields",
                  type: "object",
                  required: false,
                  notes: "Any service-specific extra parameters.",
                },
              ]}
            />
            <CodeBlock
              label="cURL"
              code={`curl -X POST ${API_RESELLER_BASE}/smm-orders \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"service_id":12,"quantity":1000,"target":"https://instagram.com/example"}'`}
            />
            <CodeBlock
              label="Response — 201"
              code={`{\n  "success": true,\n  "order_id": 88,\n  "status": "pending",\n  "order": {\n    "id": 88,\n    "quantity": 1000,\n    "unit_price": "1.2000",\n    "total_price": "1.2000",\n    "status": "pending",\n    "target": "https://instagram.com/example",\n    "service": { "id": 12, "name": "Instagram Followers" }\n  }\n}`}
            />
            <Callout variant="info" icon={Info}>
              Orders start as <InlineCode>pending</InlineCode> and are submitted to the provider on {BRAND_NAME}'s regular processing schedule — status updates asynchronously, same as normal in-app orders.
            </Callout>
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Errors
              </p>
              <BulletList
                items={[
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">{`{ "message": "Quantity must be at least X." }`}</span> /{" "}
                    <span className="text-gray-400">{`"Quantity cannot exceed X."`}</span>
                  </>,
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">
                      {`{ "message": "Insufficient balance. You need $X but have $Y." }`}
                    </span>
                  </>,
                ]}
              />
            </div>
          </DocSection>

          {/* 13. Virtual Numbers */}
          <DocSection
            id="virtual-numbers"
            icon={Phone}
            title="Virtual Numbers"
            method="POST"
            path="/reseller-api/virtual-numbers"
            buyItem="Virtual SMS / OTP Phone Number"
            buyPrice="From $0.60"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Rents an SMS/OTP-capable phone number. Price is whatever that specific country/operator/service combination currently costs (same pricing a normal user sees).
            </p>
            <ParamsTable
              rows={[
                {
                  name: "country",
                  type: "string",
                  required: true,
                  notes: (
                    <>
                      e.g. <InlineCode>usa</InlineCode>
                    </>
                  ),
                },
                {
                  name: "operator",
                  type: "string",
                  required: true,
                  notes: (
                    <>
                      e.g. <InlineCode>any</InlineCode>
                    </>
                  ),
                },
                {
                  name: "service",
                  type: "string",
                  required: true,
                  notes: (
                    <>
                      e.g. <InlineCode>whatsapp</InlineCode>
                    </>
                  ),
                },
              ]}
            />
            <CodeBlock
              label="cURL"
              code={`curl -X POST ${API_RESELLER_BASE}/virtual-numbers \\\n  -H "X-API-Key: ${PRIMARY_API_KEY}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"country":"usa","operator":"any","service":"whatsapp"}'`}
            />
            <CodeBlock
              label="Response — 201"
              code={`{\n  "id": 42,\n  "fivesim_order_id": "1234567",\n  "phone": "+1XXXXXXXXXX",\n  "country": "usa",\n  "operator": "any",\n  "product": "whatsapp",\n  "price": "2.50",\n  "status": "PENDING",\n  "expires_at": "2026-08-14T10:20:00Z"\n}`}
            />
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Errors
              </p>
              <BulletList
                items={[
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">
                      {`{ "message": "No numbers available for this selection." }`}
                    </span>{" "}
                    — try a different country/operator.
                  </>,
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">{`{ "message": "Insufficient balance." }`}</span>
                  </>,
                  <>
                    <InlineCode>422</InlineCode>{" "}
                    <span className="text-gray-400">{`{ "message": "<provider error text>" }`}</span>{" "}
                    — the underlying provider rejected the request (e.g. temporarily out of stock for that specific combination); you were not charged.
                  </>,
                ]}
              />
            </div>
          </DocSection>

          {/* 14. Error Reference */}
          <DocSection id="errors" icon={AlertOctagon} title="Error Reference">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Applies across every endpoint.
            </p>
            <KeyValueTable
              leftHeader="Status"
              rightHeader="When"
              rows={[
                { left: "401", right: "Missing or invalid/revoked API key." },
                {
                  left: "403",
                  right: `Feature category currently disabled by ${BRAND_NAME}.`,
                },
                {
                  left: "422",
                  right:
                    "Validation failure, insufficient balance, out of stock, or provider rejected the request. Body always includes a human-readable message.",
                },
                { left: "201", right: "Success — the action completed and you were charged." },
              ]}
            />
          </DocSection>
        </div>
      </div>

      {/* Bottom Agency Tools & Modules Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Additional Agency Tools &amp; Modules
            </h2>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Click any module to open via WhatsApp ({WHATSAPP_DISPLAY})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { title: "Handwriting Editor", icon: Pencil },
            { title: "Video Call", icon: PhoneCall },
            { title: "Wallet Dashboard", icon: Wallet },
            { title: "Movie Hub", icon: Film },
            { title: "Clients Finder", icon: Users },
            { title: "Pages", icon: LayoutGrid },
            { title: "Telegram Services", icon: Send },
            { title: "Payment Safety Training", icon: ShieldCheck },
            { title: "Templates", icon: Palette },
            { title: "Receipt Templates", icon: Receipt },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.title}
                href={getWhatsAppBuyUrl(tool.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-[#1a1a28] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl hover:border-primary/60 dark:hover:border-primary/60 hover:bg-sky-50/40 dark:hover:bg-[#222232] transition-colors no-underline"
              >
                <span className="w-9 h-9 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                  <Icon size={17} className="text-primary" />
                </span>
                <div className="space-y-1">
                  <p className="text-[13.5px] font-bold text-gray-900 dark:text-white leading-snug">
                    {tool.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                    Open →
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {showNewModal && (
        <NewApiKeyModal
          onClose={() => setShowNewModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

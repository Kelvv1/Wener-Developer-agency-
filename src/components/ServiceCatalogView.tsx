import { useState } from "react";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { BRAND_NAME, WHATSAPP_DISPLAY, getWhatsAppBuyUrl } from "../config/brand";
import { CatalogItem, SERVICE_CATALOG } from "../data/services";
import { PageHeader } from "./PageHeader";

export type ServiceRouteKey =
  | "developer"
  | "marketplace"
  | "virtual-numbers"
  | "smm"
  | "site-builder"
  | "flasher"
  | "consignment"
  | "tracking"
  | "receipts"
  | "wallet";

const ROUTE_META: Record<
  Exclude<ServiceRouteKey, "developer">,
  { title: string; subtitle: string; category: CatalogItem["category"] }
> = {
  marketplace: {
    title: "Buy Accounts",
    subtitle: `Aged social, email, and business manager accounts available via ${BRAND_NAME}. Click any item to buy directly on WhatsApp.`,
    category: "marketplace",
  },
  "virtual-numbers": {
    title: "Order Virtual Number",
    subtitle: `Instant SMS/OTP virtual numbers across USA, UK, and global operators. Order directly via WhatsApp (${WHATSAPP_DISPLAY}).`,
    category: "virtual-numbers",
  },
  smm: {
    title: "SMM Boosting",
    subtitle: `Automated followers, views, and engagement packages. Select a package to order on WhatsApp.`,
    category: "smm",
  },
  "site-builder": {
    title: "Site Builder",
    subtitle: `Provision full Investment Platform (tradesinc.co) or Tesla Website (incobase.pro) instances for your clients.`,
    category: "site-builder",
  },
  flasher: {
    title: "Flasher",
    subtitle: `Submit Binance or Trust Wallet crypto flash requests across USDT, BTC, ETH, BNB, and USDC.`,
    category: "flasher",
  },
  consignment: {
    title: "Consignment Videos",
    subtitle: `Custom consignment verification video packages with receiver photo and express extras.`,
    category: "consignment",
  },
  tracking: {
    title: "Tracking & Flights",
    subtitle: `Create live shipment tracking pages with FedEx, DHL, UPS, Minimal, or Dark templates.`,
    category: "tracking",
  },
  receipts: {
    title: "Receipts Generator",
    subtitle: `Generate itemized courier, transfer, and payment receipts for client workflows.`,
    category: "receipts",
  },
  wallet: {
    title: "Fund Wallet",
    subtitle: `Top up your ${BRAND_NAME} balance via WhatsApp (${WHATSAPP_DISPLAY}) to power API and reseller orders.`,
    category: "wallet",
  },
};

export function ServiceCatalogView({
  route,
  onGoToDeveloper,
}: {
  route: Exclude<ServiceRouteKey, "developer">;
  onGoToDeveloper: () => void;
}) {
  const [query, setQuery] = useState("");
  const meta = ROUTE_META[route];
  const items = SERVICE_CATALOG.filter((item) => {
    if (item.category !== meta.category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.meta.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        buyLabel="Buy via WhatsApp"
        buyItem={meta.title}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${meta.title.toLowerCase()}...`}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1a28] border border-gray-200 dark:border-[#2a2a3d] text-xs text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={onGoToDeveloper}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <span>View API Docs & Key</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-[#1a1a28] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            No matching packages found
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Clear your search or message us directly on WhatsApp ({WHATSAPP_DISPLAY}) for custom requests.
          </p>
          <a
            href={getWhatsAppBuyUrl(`${meta.title} — Custom Request`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold no-underline"
          >
            <MessageCircle size={14} />
            Request on WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 p-5 bg-white dark:bg-[#1a1a28] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[14px] font-bold text-gray-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <span className="text-[14px] font-bold text-primary tnum whitespace-nowrap shrink-0">
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.subtitle}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 tnum">
                  {item.meta}
                  {item.badge ? ` · ${item.badge}` : ""}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-[#2a2a3d] flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400 dark:text-gray-500 tnum">
                  WhatsApp: {WHATSAPP_DISPLAY}
                </span>
                <a
                  href={getWhatsAppBuyUrl(item.title, item.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors no-underline whitespace-nowrap shrink-0"
                >
                  <MessageCircle size={13} />
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

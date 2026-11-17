export interface CatalogItem {
  id: string;
  category:
    | "site-builder"
    | "marketplace"
    | "virtual-numbers"
    | "smm"
    | "flasher"
    | "consignment"
    | "tracking"
    | "receipts"
    | "wallet";
  title: string;
  subtitle: string;
  price: string;
  meta: string;
  badge?: string;
}

export const SERVICE_CATALOG: CatalogItem[] = [
  {
    id: "site-monolith",
    category: "site-builder",
    title: "Investment Platform — Full",
    subtitle: "Complete monolith investment platform provisioned on your custom subdomain with admin backend.",
    price: "$100.00",
    meta: "Lifetime · Unlimited users",
    badge: "tradesinc.co",
  },
  {
    id: "site-decoupled",
    category: "site-builder",
    title: "Tesla Website",
    subtitle: "Decoupled EV & investment showcase storefront with full backend access and instant provisioning.",
    price: "$249.00",
    meta: "Lifetime · Custom domain ready",
    badge: "incobase.pro",
  },
  {
    id: "mkt-fb-usa",
    category: "marketplace",
    title: "USA FB 0-50 FRIENDS | YEAR 2025-2026",
    subtitle: "Aged US Facebook account with instant credential delivery after purchase.",
    price: "$1.49",
    meta: "US · 67 in stock",
  },
  {
    id: "mkt-gmail",
    category: "marketplace",
    title: "USA Aged Google / Gmail Account",
    subtitle: "Phone-verified US Gmail account ready for marketing or verification workflows.",
    price: "$2.20",
    meta: "US · 142 in stock",
  },
  {
    id: "mkt-ig-aged",
    category: "marketplace",
    title: "Instagram Aged Account (2021–2023)",
    subtitle: "Clean history Instagram profile with original email access included.",
    price: "$4.50",
    meta: "Global · 38 in stock",
  },
  {
    id: "mkt-bm",
    category: "marketplace",
    title: "Verified Ad Business Manager",
    subtitle: "Ready-to-run Business Manager asset for agency campaigns and API automation.",
    price: "$35.00",
    meta: "Verified · 14 in stock",
  },
  {
    id: "vn-usa-wa",
    category: "virtual-numbers",
    title: "USA Virtual Number — WhatsApp",
    subtitle: "SMS/OTP-capable US virtual phone number for instant WhatsApp verification.",
    price: "$2.50",
    meta: "USA · Operator: any · 340 available",
  },
  {
    id: "vn-usa-tg",
    category: "virtual-numbers",
    title: "USA Virtual Number — Telegram",
    subtitle: "High-delivery US virtual number for Telegram OTP activation.",
    price: "$1.80",
    meta: "USA · Operator: any · 512 available",
  },
  {
    id: "vn-uk-wa",
    category: "virtual-numbers",
    title: "UK Virtual Number — WhatsApp",
    subtitle: "United Kingdom SMS/OTP virtual number with instant code retrieval.",
    price: "$2.20",
    meta: "UK · Operator: any · 195 available",
  },
  {
    id: "vn-af-amz",
    category: "virtual-numbers",
    title: "Virtual Number — Amazon OTP",
    subtitle: "Affordable virtual number pool for bulk account OTP verification.",
    price: "$0.60",
    meta: "Virtual4 · 25,000 available",
  },
  {
    id: "smm-ig-followers",
    category: "smm",
    title: "Instagram Followers [Refill Guaranteed]",
    subtitle: "High-retention followers delivered smoothly to any public Instagram profile.",
    price: "$1.20 / 1k",
    meta: "Min 100 · Max 100,000",
  },
  {
    id: "smm-tg-views",
    category: "smm",
    title: "[ Auto ] Telegram Post Views",
    subtitle: "Fast automated Telegram channel post views with unlimited max cap.",
    price: "$0.01 / 1k",
    meta: "Min 10 · Instant start",
  },
  {
    id: "smm-tt-views",
    category: "smm",
    title: "TikTok Video Views & Engagement",
    subtitle: "Boost TikTok video reach and social proof with automated delivery.",
    price: "$0.15 / 1k",
    meta: "Min 500 · Fast delivery",
  },
  {
    id: "smm-yt-subs",
    category: "smm",
    title: "YouTube Channel Subscribers",
    subtitle: "Steady non-drop subscriber growth for brand and creator channels.",
    price: "$8.50 / 1k",
    meta: "Min 100 · Max 20,000",
  },
  {
    id: "flash-usdt",
    category: "flasher",
    title: "Crypto Flash Request — USDT (BEP20 / ERC20)",
    subtitle: "Binance or Trust Wallet USDT flash dispatch with tiered USD service fee.",
    price: "From $15.00",
    meta: "Binance / Trust Wallet · Tiered fee",
  },
  {
    id: "flash-btc",
    category: "flasher",
    title: "Crypto Flash Request — BTC / ETH / BNB",
    subtitle: "Multi-chain flash request supporting BTC, ETH, BNB, and USDC.",
    price: "From $15.00",
    meta: "Multi-network · Instant submission",
  },
  {
    id: "consign-std",
    category: "consignment",
    title: "Consignment Video — Standard Package",
    subtitle: "Custom consignment verification video generated with receiver details and photo.",
    price: "$50.00",
    meta: "Base package · Custom receiver photo",
  },
  {
    id: "consign-express",
    category: "consignment",
    title: "Consignment Video — Express + Extras",
    subtitle: "Priority consignment video production with express add-on formatting.",
    price: "$55.00+",
    meta: "Base $50 + $5 per extra",
  },
  {
    id: "track-page",
    category: "tracking",
    title: "Live Shipment Tracking Page",
    subtitle: "Branded tracking page (Minimal, FedEx, DHL, UPS, or Dark template) with unlimited status events.",
    price: "$25.00",
    meta: "5 templates · Free status events",
  },
  {
    id: "receipt-pack",
    category: "receipts",
    title: "Custom Receipts & Invoice Generator Access",
    subtitle: "Generate crisp itemized payment, courier, and transfer receipts on demand.",
    price: "$15.00",
    meta: "Instant access · Export ready",
  },
  {
    id: "wallet-25",
    category: "wallet",
    title: "Wallet Top-Up — Starter ($25)",
    subtitle: "Fund your Wener Developer agency API wallet balance for immediate calls.",
    price: "$25.00",
    meta: "Instant credit via WhatsApp desk",
  },
  {
    id: "wallet-100",
    category: "wallet",
    title: "Wallet Top-Up — Agency ($100)",
    subtitle: "Ideal balance for provisioning a full client site or bulk virtual numbers.",
    price: "$100.00",
    meta: "Instant credit via WhatsApp desk",
  },
  {
    id: "wallet-250",
    category: "wallet",
    title: "Wallet Top-Up — Reseller ($250)",
    subtitle: "High-volume reseller balance for automated SMM, accounts, and site builds.",
    price: "$250.00",
    meta: "Instant credit via WhatsApp desk",
  },
];

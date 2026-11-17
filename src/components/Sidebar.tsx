import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  KeyRound,
  MessageCircle,
  Phone,
  ShoppingBag,
  TrendingUp,
  Truck,
  Video,
  X,
  Zap,
} from "lucide-react";
import { BRAND_NAME, WHATSAPP_DISPLAY, getWhatsAppBuyUrl } from "../config/brand";
import { ServiceRouteKey } from "./ServiceCatalogView";

interface NavItem {
  key: ServiceRouteKey;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const MENU_ITEMS: NavItem[] = [
  { key: "developer", label: "Developer / API", icon: KeyRound },
  { key: "consignment", label: "Consignment Videos", icon: Video },
  { key: "tracking", label: "Tracking & Flights", icon: Truck },
  { key: "flasher", label: "Flasher", icon: Zap },
  { key: "receipts", label: "Receipts Generator", icon: FileText },
  { key: "smm", label: "SMM Boosting", icon: TrendingUp },
  { key: "virtual-numbers", label: "Order Virtual Number", icon: Phone },
  { key: "marketplace", label: "Buy Accounts", icon: ShoppingBag },
  { key: "site-builder", label: "Site Builder", icon: Globe },
  { key: "wallet", label: "Fund Wallet", icon: CreditCard },
];

export function Sidebar({
  activeRoute,
  onSelectRoute,
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}: {
  activeRoute: ServiceRouteKey;
  onSelectRoute: (route: ServiceRouteKey) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col
          bg-white dark:bg-[#0a0a0a]
          border-r border-[#e5e5e5] dark:border-[#262626]
          transition-[width,transform] duration-300 overflow-hidden
          ${collapsed ? "w-[68px]" : "w-[244px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div
          className={`h-[60px] shrink-0 flex items-center border-b border-[#e5e5e5]/60 dark:border-[#262626]/60 ${
            collapsed ? "justify-center px-3" : "px-4 gap-2"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onSelectRoute("developer");
              setMobileOpen(false);
            }}
            className="flex items-center gap-2.5 min-w-0 text-left"
          >
            <div className="w-8 h-8 rounded-lg shrink-0 grid place-items-center bg-primary shadow-[0_4px_14px_-4px_rgba(56,189,248,0.7)]">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6l4 12 4-8 4 8 4-12" />
              </svg>
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-[14.5px] text-[#0a0a0a] dark:text-white tracking-tight truncate">
                {BRAND_NAME}
              </span>
            )}
          </button>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="ml-auto p-1.5 rounded-md text-[#a3a3a3] hover:text-[#0a0a0a] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors hidden lg:flex shrink-0"
            >
              <ChevronLeft size={15} />
            </button>
          )}

          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="hidden lg:flex p-1.5 rounded-md text-[#a3a3a3] hover:text-[#0a0a0a] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          )}

          {mobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
              className="ml-auto lg:hidden p-1.5 rounded-md text-[#a3a3a3] hover:text-[#0a0a0a] dark:hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-3 no-scrollbar">
          {!collapsed && (
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-[#a3a3a3] px-2 mb-2 font-semibold">
              Menu
            </p>
          )}
          {collapsed && <div className="h-1" />}

          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeRoute === item.key;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRoute(item.key);
                      setMobileOpen(false);
                    }}
                    onMouseEnter={() => setHovered(item.key)}
                    onMouseLeave={() => setHovered(null)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full relative flex items-center gap-3 rounded-lg text-[13.5px] font-medium transition-colors duration-150 ${
                      collapsed ? "justify-center px-0 h-11" : "px-2.5 h-11"
                    } ${
                      active
                        ? "bg-white dark:bg-[#1c1c1c] border border-[#e5e5e5]/80 dark:border-[#262626]/80 shadow-sm text-[#0a0a0a] dark:text-white"
                        : "text-[#737373] hover:text-[#0a0a0a] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c]/60"
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={active || hovered === item.key ? 2 : 1.75}
                      className={`shrink-0 ${active ? "text-primary" : ""}`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom WhatsApp Order & Copyright */}
        <div
          className={`border-t border-[#e5e5e5]/60 dark:border-[#262626]/60 ${
            collapsed ? "px-2 py-3 flex flex-col items-center gap-2" : "px-3 py-3 pb-5 space-y-2.5"
          }`}
        >
          <a
            href={getWhatsAppBuyUrl("General Order / Inquiry")}
            target="_blank"
            rel="noopener noreferrer"
            title={`WhatsApp ${WHATSAPP_DISPLAY}`}
            className={`flex items-center justify-center gap-2 rounded-xl text-[12.5px] font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors no-underline ${
              collapsed ? "w-9 h-9" : "w-full px-3 py-2.5"
            }`}
          >
            <MessageCircle size={15} className="shrink-0" />
            {!collapsed && <span className="truncate tnum">Buy: {WHATSAPP_DISPLAY}</span>}
          </a>

          {!collapsed && (
            <p className="text-[11px] text-[#a3a3a3] text-center truncate">
              © {new Date().getFullYear()} {BRAND_NAME}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

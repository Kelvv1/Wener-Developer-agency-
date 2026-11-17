import { useEffect, useState } from "react";
import { Menu, MessageCircle, Moon, Sun } from "lucide-react";
import { BRAND_NAME, BRAND_SHORT, WHATSAPP_DISPLAY, getWhatsAppBuyUrl } from "./config/brand";
import { DeveloperApiPage } from "./components/DeveloperApiPage";
import { ServiceCatalogView, ServiceRouteKey } from "./components/ServiceCatalogView";
import { Sidebar } from "./components/Sidebar";

function resolveInitialRoute(): ServiceRouteKey {
  if (typeof window === "undefined") return "developer";
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  const valid: ServiceRouteKey[] = [
    "developer",
    "marketplace",
    "virtual-numbers",
    "smm",
    "site-builder",
    "flasher",
    "consignment",
    "tracking",
    "receipts",
    "wallet",
  ];
  return valid.includes(path as ServiceRouteKey)
    ? (path as ServiceRouteKey)
    : "developer";
}

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("wener_theme") === "dark";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState<ServiceRouteKey>(resolveInitialRoute);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("wener_theme", dark ? "dark" : "light");
  }, [dark]);

  const handleSelectRoute = (route: ServiceRouteKey) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] dark:bg-[#0a0a0a]">
      <Sidebar
        activeRoute={activeRoute}
        onSelectRoute={handleSelectRoute}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 min-w-0 flex flex-col min-h-screen transition-[margin] duration-300 ${
          collapsed ? "lg:ml-[68px]" : "lg:ml-[244px]"
        }`}
      >
        <header
          className="sticky top-0 z-20 h-[60px] flex items-center px-4 sm:px-6 gap-2
          bg-white/80 dark:bg-[#0a0a0a]/70 backdrop-blur-xl
          border-b border-[#e5e5e5]/80 dark:border-[#262626]/80"
        >
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-[#737373] hover:text-[#0a0a0a] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors shrink-0"
          >
            <Menu size={19} />
          </button>

          <span className="lg:hidden font-display font-extrabold text-[12px] tracking-[0.04em] select-none shrink-0">
            <span className="text-primary">{BRAND_SHORT[0]}</span>
            <span className="text-[#0a0a0a] dark:text-white">{BRAND_SHORT.slice(1)}</span>
          </span>

          <div className="flex-1" />

          <div className="flex items-center gap-2 min-w-0">
            <a
              href={getWhatsAppBuyUrl("Wallet Top-Up / Buy Service")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[11.5px] font-semibold rounded-full shrink-0 hover:brightness-110 active:scale-95 transition-all no-underline shadow-sm whitespace-nowrap"
              style={{ boxShadow: "0 1px 8px -2px rgba(2, 132, 199, 0.45)" }}
            >
              <MessageCircle size={13} />
              <span>Add Funds</span>
              <span className="hidden sm:inline opacity-90 tnum">· {WHATSAPP_DISPLAY}</span>
            </a>

            <button
              type="button"
              onClick={() => setDark((prev) => !prev)}
              aria-label="Toggle theme"
              title="Toggle theme"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#0a0a0a] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors shrink-0"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="px-4 pt-5 sm:px-6">
            <aside
              aria-label="Order and integration notice"
              className="max-w-7xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-[#2a2a3d] dark:bg-[#1a1a28] dark:text-slate-300"
            >
              <strong className="font-semibold text-primary">{BRAND_NAME}</strong>{" "}
              developer portal and reseller catalog. To purchase any service, API balance, or ready-made website,{" "}
              <a
                href={getWhatsAppBuyUrl("General Inquiry / Purchase")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline focus-visible:underline"
              >
                click here to message WhatsApp {WHATSAPP_DISPLAY}
              </a>
              .
            </aside>
          </div>

          {activeRoute === "developer" ? (
            <DeveloperApiPage />
          ) : (
            <ServiceCatalogView
              route={activeRoute}
              onGoToDeveloper={() => handleSelectRoute("developer")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

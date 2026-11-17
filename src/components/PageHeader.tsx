import { MessageCircle } from "lucide-react";
import { getWhatsAppBuyUrl, WHATSAPP_DISPLAY } from "../config/brand";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  buyLabel?: string;
  buyItem?: string;
}

export function PageHeader({
  title,
  subtitle,
  buyLabel = "Buy via WhatsApp",
  buyItem,
}: PageHeaderProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 mb-6 rounded-2xl
      border border-[#e5e5e5]/80 dark:border-[#262626]/80 shadow-sm
      bg-gradient-to-br from-white to-purple-500/[0.04]
      dark:from-[#141414] dark:to-purple-500/[0.08]"
    >
      <div className="min-w-0">
        <h1 className="font-display text-[20px] font-bold text-[#0a0a0a] dark:text-white leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12.5px] text-[#737373] dark:text-[#a3a3a3] mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <a
          href={getWhatsAppBuyUrl(buyItem || title)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-colors no-underline whitespace-nowrap shrink-0"
        >
          <MessageCircle size={14} />
          <span>{buyLabel}</span>
          <span className="hidden md:inline opacity-85 tnum">· {WHATSAPP_DISPLAY}</span>
        </a>
      </div>
    </div>
  );
}

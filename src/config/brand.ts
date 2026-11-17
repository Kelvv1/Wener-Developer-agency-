export const BRAND_NAME = "Wener Developer agency";
export const BRAND_SHORT = "WENER";
export const PRIMARY_API_KEY = "rsk_wS29fVJLOpZMOmeiwmGyXl62sk3hsgWxYo01AHQj";
export const WHATSAPP_DISPLAY = "0708 629 0677";
export const WHATSAPP_E164 = "2347086290677";

export const API_RESELLER_BASE = "https://api.wenerdeveloper.com/api/reseller-api";
export const API_PUBLIC_BASE = "https://api.wenerdeveloper.com/api";

export function getWhatsAppBuyUrl(item?: string, price?: string): string {
  const baseMessage = item
    ? `Hello ${BRAND_NAME}, I would like to buy: ${item}${price ? ` (${price})` : ""}.`
    : `Hello ${BRAND_NAME}, I would like to place an order or fund my reseller account.`;
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(baseMessage)}`;
}

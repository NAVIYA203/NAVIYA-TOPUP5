export const WHATSAPP_NUMBER = "94755173946";
export const WHATSAPP_DISPLAY = "+94 75 517 3946";
export const whatsappLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export type FfPackage = { name: string; label: string; price: number; art: string };

export const FF_MEMBERSHIPS: FfPackage[] = [
  { name: "Weekly Lite Membership", label: "MEMBERSHIP", price: 130, art: "💎" },
  { name: "Weekly Membership", label: "MEMBERSHIP", price: 580, art: "💎" },
  { name: "Monthly Membership", label: "MEMBERSHIP", price: 2900, art: "👑" },
  { name: "VIP Membership", label: "MEMBERSHIP", price: 3480, art: "👑" },
  { name: "Super VIP Membership", label: "MEMBERSHIP", price: 5220, art: "🏆" },
];

export const FF_DIAMONDS: FfPackage[] = [
  { name: "465 Diamonds Bonus Pack", label: "BONUS PACK · ONE TIME", price: 1180, art: "💎🎁" },
  { name: "780 Diamonds Bonus Pack", label: "BONUS PACK · ONE TIME", price: 1970, art: "💎🎁" },
  { name: "1,590 Diamonds Bonus Pack", label: "BONUS PACK · ONE TIME", price: 3960, art: "💎🎁" },
  { name: "3,270 Diamonds Bonus Pack", label: "BONUS PACK · ONE TIME", price: 7980, art: "💎🎁" },
  { name: "8,400 Diamonds Bonus Pack", label: "BONUS PACK · ONE TIME", price: 19880, art: "💎🎁" },
  { name: "25 Diamonds", label: "DIAMONDS", price: 85, art: "💎" },
  { name: "100 Diamonds", label: "DIAMONDS", price: 325, art: "💎" },
];

export const formatLkr = (n: number) =>
  `Rs. ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const ORDER_CATEGORIES = [
  "PUBG Mobile",
  "Free Fire",
  "Mobile Legends",
  "Steam Wallet",
  "Apple Gift Card",
  "Google Play",
  "Game Keys",
  "Other Services",
];

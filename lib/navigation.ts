import {
  Home,
  LineChart,
  Calculator,
  Wallet,
  Star,
  Bell,
  LayoutDashboard,
  HandHeart,
  Sparkles,
  Bitcoin,
  Newspaper,
  Coins,
  DollarSign,
  Gem,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  titleEn: string;
  titleAr: string;
  href: string;
  icon: LucideIcon;
  isVip?: boolean;
};

export type NavGroup = {
  id: string;
  sectionLabel: "MARKETS" | "PERSONAL";
  groupTitleEn: string;
  groupTitleAr: string;
  groupIcon: LucideIcon;
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    id: "gold-market",
    sectionLabel: "MARKETS",
    groupTitleEn: "Gold Market",
    groupTitleAr: "سوق الذهب",
    groupIcon: Coins,
    items: [
      {
        titleEn: "Live Prices",
        titleAr: "اسعار الذهب",
        href: "/gold",
        icon: LineChart,
      },
      {
        titleEn: "Calculator",
        titleAr: "حاسبة البيع و الشراء",
        href: "/gold/calculator",
        icon: Calculator,
      },
      {
        titleEn: "Zakat Calc",
        titleAr: "حاسبة الزكاة",
        href: "/gold/zakat",
        icon: HandHeart,
      },
    ],
  },
  {
    id: "currency-exchange",
    sectionLabel: "MARKETS",
    groupTitleEn: "Currency Exchange",
    groupTitleAr: "سوق العملات",
    groupIcon: DollarSign,
    items: [
      {
        titleEn: "Dashboard",
        titleAr: "أسعار العملات",
        href: "/currencies",
        icon: LayoutDashboard,
      },
      {
        titleEn: "Calculator",
        titleAr: "حاسبة العملات",
        href: "/currencies/calculator",
        icon: Calculator,
      },
    ],
  },
  {
    id: "silver-market",
    sectionLabel: "MARKETS",
    groupTitleEn: "Silver Market",
    groupTitleAr: "الفضة",
    groupIcon: Gem,
    items: [
      {
        titleEn: "Live Prices",
        titleAr: "اسعار الفضة",
        href: "/silver",
        icon: Sparkles,
      },
      {
        titleEn: "Calculator",
        titleAr: "حاسبة البيع و الشراء",
        href: "/silver/calculator",
        icon: Calculator,
      },
    ],
  },
  {
    id: "crypto-market",
    sectionLabel: "MARKETS",
    groupTitleEn: "Cryptocurrencies",
    groupTitleAr: "العملات الرقمية",
    groupIcon: Bitcoin,
    items: [
      {
        titleEn: "Dashboard",
        titleAr: "العملات الرقمية",
        href: "/crypto",
        icon: Bitcoin,
      },
      {
        titleEn: "Calculator",
        titleAr: "حاسبة التحويل",
        href: "/crypto/calculator",
        icon: Calculator,
      },
    ],
  },
  {
    id: "news-center",
    sectionLabel: "MARKETS",
    groupTitleEn: "News Center",
    groupTitleAr: "مركز الأخبار",
    groupIcon: Newspaper,
    items: [
      {
        titleEn: "Latest News",
        titleAr: "آخر الأخبار",
        href: "/news",
        icon: Newspaper,
      },
    ],
  },
  {
    id: "my-zone",
    sectionLabel: "PERSONAL",
    groupTitleEn: "My Zone",
    groupTitleAr: "مساحتي",
    groupIcon: Star,
    items: [
      {
        titleEn: "Portfolio",
        titleAr: "المحفظة",
        href: "/me/portfolio",
        icon: Wallet,
      },
      {
        titleEn: "Alerts",
        titleAr: "التنبيهات",
        href: "/me/alerts",
        icon: Bell,
        isVip: true,
      },
    ],
  },
];

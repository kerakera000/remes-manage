import { type LucideIcon, CheckCircle, XCircle, PauseCircle, CalendarClock } from "lucide-react";

export interface Subscription {
  id: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  status: "active" | "paused" | "cancelled" | "past_due";
  price: number; // in cents per interval
  interval: "month" | "year";
  currentPeriodEnd: Date;
  createdAt: Date;
}

export const subscriptionStatuses: { value: Subscription["status"]; label: string; icon: LucideIcon }[] = [
  { value: "active", label: "有効", icon: CheckCircle },
  { value: "paused", label: "一時停止中", icon: PauseCircle },
  { value: "cancelled", label: "キャンセル済", icon: XCircle },
  { value: "past_due", label: "支払い遅延", icon: CalendarClock },
];

export const mockSubscriptions: Subscription[] = [
  { id: "sub_1", customerName: "山田 太郎", customerEmail: "yamada@example.com", planName: "プレミアムプラン", status: "active", price: 5000, interval: "month", currentPeriodEnd: new Date("2025-05-08"), createdAt: new Date("2024-01-08") },
  { id: "sub_2", customerName: "佐藤 花子", customerEmail: "sato@example.com", planName: "ベーシックプラン", status: "active", price: 1000, interval: "month", currentPeriodEnd: new Date("2025-04-20"), createdAt: new Date("2024-03-20") },
  { id: "sub_3", customerName: "鈴木 一郎", customerEmail: "suzuki@example.com", planName: "年間プレミアム", status: "active", price: 55000, interval: "year", currentPeriodEnd: new Date("2026-02-15"), createdAt: new Date("2024-02-15") },
  { id: "sub_4", customerName: "田中 真由美", customerEmail: "tanaka@example.com", planName: "プレミアムプラン", status: "cancelled", price: 5000, interval: "month", currentPeriodEnd: new Date("2024-03-10"), createdAt: new Date("2023-12-10") },
  { id: "sub_5", customerName: "高橋 健太", customerEmail: "takahashi@example.com", planName: "ベーシックプラン", status: "past_due", price: 1000, interval: "month", currentPeriodEnd: new Date("2025-04-05"), createdAt: new Date("2024-03-05") },
  { id: "sub_6", customerName: "伊藤 さくら", customerEmail: "ito@example.com", planName: "プレミアムプラン", status: "paused", price: 5000, interval: "month", currentPeriodEnd: new Date("2025-06-01"), createdAt: new Date("2024-04-01") },
];

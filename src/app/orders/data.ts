import { type LucideIcon, Package, Truck, CheckCircle, XCircle, CircleDollarSign } from "lucide-react";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number; // in cents
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "unpaid";
  createdAt: Date;
}

export const orderStatuses: { value: Order["status"]; label: string; icon: LucideIcon }[] = [
  { value: "pending", label: "保留中", icon: Package },
  { value: "processing", label: "処理中", icon: Package },
  { value: "shipped", label: "発送済", icon: Truck },
  { value: "delivered", label: "配達済", icon: CheckCircle },
  { value: "cancelled", label: "キャンセル済", icon: XCircle },
];

export const paymentStatuses: { value: Order["paymentStatus"]; label: string; icon: LucideIcon }[] = [
    { value: "paid", label: "支払済", icon: CircleDollarSign },
    { value: "unpaid", label: "未払い", icon: CircleDollarSign }, // Consider a different icon?
];


export const mockOrders: Order[] = [
  { id: "ord_1", customerName: "山田 太郎", customerEmail: "yamada@example.com", totalAmount: 5300, status: "delivered", paymentStatus: "paid", createdAt: new Date("2024-04-08") },
  { id: "ord_2", customerName: "佐藤 花子", customerEmail: "sato@example.com", totalAmount: 1800, status: "shipped", paymentStatus: "paid", createdAt: new Date("2024-04-09") },
  { id: "ord_3", customerName: "鈴木 一郎", customerEmail: "suzuki@example.com", totalAmount: 8000, status: "processing", paymentStatus: "paid", createdAt: new Date("2024-04-10") },
  { id: "ord_4", customerName: "田中 真由美", customerEmail: "tanaka@example.com", totalAmount: 2500, status: "pending", paymentStatus: "unpaid", createdAt: new Date("2024-04-10") },
  { id: "ord_5", customerName: "高橋 健太", customerEmail: "takahashi@example.com", totalAmount: 12800, status: "cancelled", paymentStatus: "unpaid", createdAt: new Date("2024-04-05") },
  { id: "ord_6", customerName: "伊藤 さくら", customerEmail: "ito@example.com", totalAmount: 3500, status: "delivered", paymentStatus: "paid", createdAt: new Date("2024-04-07") },
];

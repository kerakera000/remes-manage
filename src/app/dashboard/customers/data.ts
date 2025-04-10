import { type LucideIcon, UserCheck, UserX, Mail, Phone } from "lucide-react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string; // Optional phone number
  status: "active" | "inactive";
  totalSpent: number; // in cents
  orderCount: number;
  createdAt: Date;
}

export const customerStatuses: { value: Customer["status"]; label: string; icon: LucideIcon }[] = [
  { value: "active", label: "アクティブ", icon: UserCheck },
  { value: "inactive", label: "非アクティブ", icon: UserX },
];

export const mockCustomers: Customer[] = [
  { id: "cust_1", name: "山田 太郎", email: "yamada@example.com", phone: "090-1234-5678", status: "active", totalSpent: 15300, orderCount: 3, createdAt: new Date("2023-10-01") },
  { id: "cust_2", name: "佐藤 花子", email: "sato@example.com", status: "active", totalSpent: 1800, orderCount: 1, createdAt: new Date("2024-01-15") },
  { id: "cust_3", name: "鈴木 一郎", email: "suzuki@example.com", phone: "080-9876-5432", status: "active", totalSpent: 8000, orderCount: 1, createdAt: new Date("2024-02-20") },
  { id: "cust_4", name: "田中 真由美", email: "tanaka@example.com", status: "inactive", totalSpent: 2500, orderCount: 1, createdAt: new Date("2023-11-10") },
  { id: "cust_5", name: "高橋 健太", email: "takahashi@example.com", status: "active", totalSpent: 12800, orderCount: 1, createdAt: new Date("2024-03-05") },
  { id: "cust_6", name: "伊藤 さくら", email: "ito@example.com", phone: "070-1111-2222", status: "active", totalSpent: 3500, orderCount: 1, createdAt: new Date("2024-04-01") },
];

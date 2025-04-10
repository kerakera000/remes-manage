import { type LucideIcon, Package, PackageCheck, PackageX } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number; // in cents
  stock: number;
  status: "active" | "draft" | "archived";
  createdAt: Date;
}

export const productStatuses: { value: Product["status"]; label: string; icon: LucideIcon }[] = [
  { value: "active", label: "公開中", icon: PackageCheck },
  { value: "draft", label: "下書き", icon: Package },
  { value: "archived", label: "アーカイブ済", icon: PackageX },
];

export const mockProducts: Product[] = [
  { id: "prod_1", name: "プレミアムTシャツ", price: 3500, stock: 150, status: "active", createdAt: new Date("2024-01-15") },
  { id: "prod_2", name: "オーガニックコーヒー豆", price: 1800, stock: 80, status: "active", createdAt: new Date("2024-02-01") },
  { id: "prod_3", name: "ステンレスボトル", price: 2500, stock: 0, status: "active", createdAt: new Date("2024-02-20") },
  { id: "prod_4", name: "ワイヤレスイヤホン", price: 8000, stock: 45, status: "draft", createdAt: new Date("2024-03-10") },
  { id: "prod_5", name: "旧モデルスニーカー", price: 6000, stock: 10, status: "archived", createdAt: new Date("2023-11-05") },
  { id: "prod_6", name: "ハンドメイドソープ", price: 800, stock: 200, status: "active", createdAt: new Date("2024-03-25") },
  { id: "prod_7", name: "レザーバックパック", price: 12000, stock: 25, status: "active", createdAt: new Date("2024-04-01") },
];

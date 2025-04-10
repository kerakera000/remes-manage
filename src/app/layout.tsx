import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Repeat,
  Settings,
  type LucideIcon,
} from "lucide-react";
import "./globals.css"; // Keep global styles

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}


function Sidebar() {
  const menuItems: MenuItem[] = [
    { href: "/", label: "ダッシュボード", icon: LayoutDashboard }, // Changed from /dashboard
    { href: "/products", label: "商品管理", icon: Package }, // Changed from /dashboard/products
    { href: "/orders", label: "注文管理", icon: ShoppingCart }, // Changed from /dashboard/orders
    { href: "/customers", label: "顧客管理", icon: Users }, // Changed from /dashboard/customers
    { href: "/subscriptions", label: "サブスクリプション管理", icon: Repeat }, // Changed from /dashboard/subscriptions
    { href: "/settings", label: "設定", icon: Settings }, // Changed from /dashboard/settings
  ];

  return (
    <aside className="w-60 flex-shrink-0 border-r bg-background p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Remes管理</h2>
      </div>
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      {/* Add user profile/logout section later */}
    </aside>
  );
}

export default function RootLayout({ // Renamed from DashboardLayout
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja"> {/* Assuming Japanese locale */}
      <body> {/* Removed font classes for now, might need re-adding */}
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

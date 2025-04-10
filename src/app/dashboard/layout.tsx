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

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

function Sidebar() {
  const menuItems: MenuItem[] = [
    { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "商品管理", icon: Package },
    { href: "/dashboard/orders", label: "注文管理", icon: ShoppingCart },
    { href: "/dashboard/customers", label: "顧客管理", icon: Users },
    { href: "/dashboard/subscriptions", label: "サブスクリプション管理", icon: Repeat },
    { href: "/dashboard/settings", label: "設定", icon: Settings },
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

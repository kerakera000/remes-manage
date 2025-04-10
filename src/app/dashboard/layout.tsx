import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Sidebar() {
  const menuItems = [
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/dashboard/products", label: "商品管理" },
    { href: "/dashboard/orders", label: "注文管理" },
    { href: "/dashboard/customers", label: "顧客管理" },
    { href: "/dashboard/subscriptions", label: "サブスクリプション管理" },
    { href: "/dashboard/settings", label: "設定" },
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
            <Link href={item.href}>{item.label}</Link>
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

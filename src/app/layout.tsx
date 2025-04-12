'use client'; // Add 'use client' because Sidebar now has onClick handler

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
  LogOut, // Import LogOut icon
  type LucideIcon,
} from "lucide-react";
import Cookies from 'js-cookie'; // Import js-cookie at top level
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

import "./globals.css"; // Keep global styles

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}


function Sidebar() {
  const menuItems: MenuItem[] = [
    { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/products", label: "商品管理", icon: Package },
    { href: "/orders", label: "注文管理", icon: ShoppingCart },
    { href: "/customers", label: "顧客管理", icon: Users },
    { href: "/subscriptions", label: "サブスクリプション管理", icon: Repeat },
    { href: "/settings", label: "設定", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('auth-session'); // Remove the session cookie
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <aside className="w-60 flex-shrink-0 border-r bg-background p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Remes管理</h2>
      </div>
      <nav className="flex flex-col space-y-1 flex-grow">
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
      {/* Logout Button */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout} // Use defined handler
        >
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </Button>
      </div>
    </aside>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="flex h-screen bg-background text-foreground">
          {/* Sidebar is now a client component due to onClick */}
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

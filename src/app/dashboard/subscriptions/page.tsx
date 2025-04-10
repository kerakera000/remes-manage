import React from "react";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockSubscriptions, subscriptionStatuses, type Subscription } from "./data"; // Mock data

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ja-JP").format(date);
};

const formatInterval = (interval: Subscription["interval"]) => {
    return interval === 'month' ? '月' : '年';
}

export default function SubscriptionsPage() {
  const subscriptions = mockSubscriptions;

  const getStatusInfo = (statusValue: Subscription["status"]) => {
    return subscriptionStatuses.find(s => s.value === statusValue) || subscriptionStatuses[2]; // Default to cancelled
  }

  const getStatusVariant = (statusValue: Subscription["status"]): "secondary" | "outline" | "destructive" => {
      switch (statusValue) {
          case 'active': return 'secondary';
          case 'past_due': return 'destructive';
          default: return 'outline';
      }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">サブスクリプション管理</h1>
        {/* Maybe add filtering/search later */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox aria-label="すべての行を選択" />
              </TableHead>
              <TableHead>顧客名</TableHead>
              <TableHead>プラン名</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">価格</TableHead>
              <TableHead>次回請求日</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">アクション</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => {
                const statusInfo = getStatusInfo(sub.status);
                return (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <Checkbox aria-label="行を選択" />
                    </TableCell>
                    <TableCell>
                      <div>{sub.customerName}</div>
                      <div className="text-muted-foreground text-xs">{sub.customerEmail}</div>
                    </TableCell>
                    <TableCell>{sub.planName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(sub.status)} className="flex items-center gap-1 w-fit">
                        <statusInfo.icon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(sub.price)} / {formatInterval(sub.interval)}</TableCell>
                    <TableCell>{formatDate(sub.currentPeriodEnd)}</TableCell>
                    <TableCell>{formatDate(sub.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">メニューを開く</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>アクション</DropdownMenuLabel>
                          <DropdownMenuItem>サブスクリプション詳細</DropdownMenuItem>
                          <DropdownMenuItem>顧客情報を表示</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>一時停止</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">キャンセル</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  サブスクリプションが見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Add Pagination later */}
    </div>
  );
}

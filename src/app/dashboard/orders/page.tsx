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
import { mockOrders, orderStatuses, paymentStatuses, type Order } from "./data"; // Mock data

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ja-JP").format(date);
};

export default function OrdersPage() {
  const orders = mockOrders;

  const getOrderStatusInfo = (statusValue: Order["status"]) => {
    return orderStatuses.find(s => s.value === statusValue) || orderStatuses[0]; // Default to pending
  }

  const getPaymentStatusInfo = (statusValue: Order["paymentStatus"]) => {
    return paymentStatuses.find(s => s.value === statusValue) || paymentStatuses[1]; // Default to unpaid
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">注文管理</h1>
        {/* Maybe add filtering/search later */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox aria-label="すべての行を選択" />
              </TableHead>
              <TableHead>注文ID</TableHead>
              <TableHead>顧客名</TableHead>
              <TableHead>注文ステータス</TableHead>
              <TableHead>支払ステータス</TableHead>
              <TableHead className="text-right">合計金額</TableHead>
              <TableHead>注文日時</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">アクション</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const orderStatusInfo = getOrderStatusInfo(order.status);
                const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox aria-label="行を選択" />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>
                      <div>{order.customerName}</div>
                      <div className="text-muted-foreground text-xs">{order.customerEmail}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <orderStatusInfo.icon className="h-3 w-3" />
                        {orderStatusInfo.label}
                      </Badge>
                    </TableCell>
                     <TableCell>
                       <Badge variant={paymentStatusInfo.value === 'paid' ? 'secondary' : 'destructive'} className="flex items-center gap-1 w-fit">
                         <paymentStatusInfo.icon className="h-3 w-3" />
                         {paymentStatusInfo.label}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
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
                          <DropdownMenuItem>注文詳細を表示</DropdownMenuItem>
                          <DropdownMenuItem>顧客情報を表示</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>ステータス更新</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">注文をキャンセル</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  注文が見つかりません。
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

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
import { mockCustomers, customerStatuses, type Customer } from "./data"; // Mock data

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ja-JP").format(date);
};

export default function CustomersPage() {
  const customers = mockCustomers;

  const getStatusInfo = (statusValue: Customer["status"]) => {
    return customerStatuses.find(s => s.value === statusValue) || customerStatuses[1]; // Default to inactive
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">顧客管理</h1>
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
              <TableHead>連絡先</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">注文数</TableHead>
              <TableHead className="text-right">合計利用額</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">アクション</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => {
                const statusInfo = getStatusInfo(customer.status);
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox aria-label="行を選択" />
                    </TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div>{customer.email}</div>
                      {customer.phone && <div className="text-muted-foreground text-xs">{customer.phone}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.value === 'active' ? 'secondary' : 'outline'} className="flex items-center gap-1 w-fit">
                        <statusInfo.icon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{customer.orderCount}</TableCell>
                    <TableCell className="text-right">{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
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
                          <DropdownMenuItem>顧客詳細を表示</DropdownMenuItem>
                          <DropdownMenuItem>注文履歴を表示</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>編集</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">削除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  顧客が見つかりません。
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

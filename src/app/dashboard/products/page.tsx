import React from "react";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge"; // Assuming Badge component exists or will be added
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
import { mockProducts, productStatuses, type Product } from "./data"; // Mock data

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ja-JP").format(date);
};

export default function ProductsPage() {
  const products = mockProducts;

  const getStatusInfo = (statusValue: Product["status"]) => {
    return productStatuses.find(s => s.value === statusValue) || productStatuses[1]; // Default to draft if not found
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">商品管理</h1>
        <Button>商品を追加</Button> {/* Add Product Button */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  aria-label="すべての行を選択"
                />
              </TableHead>
              <TableHead>商品名</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">価格</TableHead>
              <TableHead className="text-right">在庫数</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="w-[50px]"> {/* Actions column */}
                <span className="sr-only">アクション</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => {
                const statusInfo = getStatusInfo(product.status);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        aria-label="行を選択"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                       <Badge variant="outline" className="flex items-center gap-1 w-fit"> {/* Added w-fit for proper sizing */}
                         <statusInfo.icon className="h-3 w-3" />
                         {statusInfo.label}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(product.id)}
                          >
                            商品IDをコピー
                          </DropdownMenuItem>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  商品が見つかりません。
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

import React from "react";
import { MoreHorizontal, Calendar } from "lucide-react";

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
import { productStatuses, type Product } from "./data";
import { AddProductDialog } from "@/components/products/add-product-dialog";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ja-JP").format(date);
};

const formatRecurring = (recurring: { interval: string; interval_count: number } | null) => {
  if (!recurring) return "一回限り";
  
  const intervalMap: Record<string, string> = {
    day: "日",
    week: "週間",
    month: "ヶ月",
    year: "年",
  };
  
  return `${recurring.interval_count}${intervalMap[recurring.interval]}ごと`;
};

async function getProducts() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : '';
    
    const res = await fetch(`${baseUrl}/api/stripe/products`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('商品の取得に失敗しました');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  const getStatusInfo = (statusValue: Product["status"]) => {
    return productStatuses.find(s => s.value === statusValue) || productStatuses[1]; // Default to draft if not found
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">商品管理</h1>
        <AddProductDialog />
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
              <TableHead>サブスクリプション</TableHead>
              <TableHead className="text-right">在庫数</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">アクション</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product: any) => {
                const statusInfo = getStatusInfo(product.status as Product["status"]);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        aria-label="行を選択"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                       <Badge variant="outline" className="flex items-center gap-1 w-fit">
                         <statusInfo.icon className="h-3 w-3" />
                         {statusInfo.label}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {product.recurring && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatRecurring(product.recurring)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>{formatDate(new Date(product.createdAt))}</TableCell>
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
                <TableCell colSpan={8} className="h-24 text-center">
                  商品が見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

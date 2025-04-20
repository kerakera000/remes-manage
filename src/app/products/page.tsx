"use client"

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productStatuses, type Product, type PriceInfo } from "./data";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { ProductActions } from "@/components/products/product-actions";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
              <TableHead className="text-right">基本価格</TableHead>
              <TableHead>プラン情報</TableHead>
              <TableHead className="text-right">在庫数</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">アクション</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    <span className="ml-2">読み込み中...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product: Product) => {
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
                      {product.prices && product.prices.length > 0 ? (
                        <div className="space-y-1">
                          {product.prices.map((price: PriceInfo) => (
                            <Badge key={price.id} variant="secondary" className="flex items-center gap-1 mb-1">
                              <Calendar className="h-3 w-3" />
                              {formatRecurring(price.recurring)} - {formatCurrency(price.unit_amount)}
                            </Badge>
                          ))}
                        </div>
                      ) : product.recurring && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatRecurring(product.recurring)} - {formatCurrency(product.price)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>{formatDate(new Date(product.createdAt))}</TableCell>
                    <TableCell>
                      <ProductActions productId={product.id} />
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

"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Package, PackageCheck, PackageX } from "lucide-react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { productStatuses } from "@/app/products/data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const productFormSchema = z.object({
  name: z.string().min(1, { message: "商品名は必須です" }),
  description: z.string().optional(),
  price: z.coerce.number().min(1, { message: "価格は1円以上で入力してください" }),
  stock: z.coerce.number().min(0, { message: "在庫数は0以上で入力してください" }),
  status: z.enum(["active", "draft", "archived"], {
    required_error: "ステータスを選択してください",
  }),
  interval: z.enum(["day", "week", "month", "year"], {
    required_error: "サブスクリプション間隔を選択してください",
  }),
  intervalCount: z.coerce.number().min(1, { message: "間隔の回数は1以上で入力してください" }),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function AddProductForm({ onSubmit, onCancel }: { 
  onSubmit: (values: ProductFormValues) => Promise<void>,
  onCancel: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      status: "draft",
      interval: "month",
      intervalCount: 1,
    },
  })

  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error("商品の追加中にエラーが発生しました:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>商品名</FormLabel>
              <FormControl>
                <Input placeholder="例：プレミアムTシャツ" {...field} />
              </FormControl>
              <FormDescription>商品の正式名称を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>商品説明</FormLabel>
              <FormControl>
                <Input placeholder="例：高品質な素材を使用したTシャツ" {...field} />
              </FormControl>
              <FormDescription>商品の詳細説明を入力してください（任意）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>価格（円）</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1000" {...field} />
              </FormControl>
              <FormDescription>商品の価格を円単位で入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>在庫数</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10" {...field} />
              </FormControl>
              <FormDescription>現在の在庫数を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ステータス</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <status.icon className="h-4 w-4" />
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>商品の現在のステータスを選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サブスクリプション間隔</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="間隔を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="day">日</SelectItem>
                  <SelectItem value="week">週</SelectItem>
                  <SelectItem value="month">月</SelectItem>
                  <SelectItem value="year">年</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>サブスクリプションの請求間隔を選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intervalCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>間隔の回数</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormDescription>間隔の回数を入力してください（例：2週間なら「2」）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "商品を追加"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

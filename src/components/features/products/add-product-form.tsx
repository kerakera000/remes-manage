"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Package, PackageCheck, PackageX, Calendar } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"

const planSchema = z.object({
  price: z.coerce.number().min(0, { message: "価格は0円以上で入力してください" }),
  active: z.boolean().default(false),
})

const productFormSchema = z.object({
  name: z.string().min(1, { message: "商品名は必須です" }),
  description: z.string().optional(),
  stock: z.coerce.number().min(0, { message: "在庫数は0以上で入力してください" }),
  status: z.enum(["active", "draft", "archived"], {
    required_error: "ステータスを選択してください",
  }),
  monthlyPlan: planSchema,
  sixMonthPlan: planSchema,
  twelveMonthPlan: planSchema, // 追加: 12ヶ月プラン
  yearlyPlan: planSchema,
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function AddProductForm({ onSubmit, onCancel }: { 
  onSubmit: (values: ProductFormValues) => Promise<void>,
  onCancel: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      stock: 0,
      status: "draft",
      monthlyPlan: {
        price: 0,
        active: true,
      },
      sixMonthPlan: {
        price: 0,
        active: false,
      },
      twelveMonthPlan: { // 追加: 12ヶ月プラン
        price: 0,
        active: false,
      },
      yearlyPlan: {
        price: 0,
        active: false,
      },
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
      <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
        <FormField
          control={form.control as any}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>商品名</FormLabel>
              <FormControl>
                <Input placeholder="例：プレミアムサブスクリプション" {...field} />
              </FormControl>
              <FormDescription>商品の正式名称を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control as any}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>商品説明</FormLabel>
              <FormControl>
                <Input placeholder="例：高品質なサブスクリプションサービス" {...field} />
              </FormControl>
              <FormDescription>商品の詳細説明を入力してください（任意）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control as any}
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
          control={form.control as any}
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

        {/* 1ヶ月プラン */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h3 className="text-lg font-medium">1ヶ月プラン</h3>
          </div>
          
          <FormField
            control={form.control as any}
            name="monthlyPlan.active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>有効にする</FormLabel>
                  <FormDescription>
                    このプランを有効にするかどうかを選択してください
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control as any}
            name="monthlyPlan.price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>価格（円/月）</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000" {...field} />
                </FormControl>
                <FormDescription>1ヶ月あたりの価格を円単位で入力してください</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 半年プラン */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h3 className="text-lg font-medium">半年プラン</h3>
          </div>
          
          <FormField
            control={form.control as any}
            name="sixMonthPlan.active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>有効にする</FormLabel>
                  <FormDescription>
                    このプランを有効にするかどうかを選択してください
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control as any}
            name="sixMonthPlan.price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>価格（円/6ヶ月）</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5000" {...field} />
                </FormControl>
                <FormDescription>6ヶ月あたりの価格を円単位で入力してください</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 12ヶ月プラン */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h3 className="text-lg font-medium">12ヶ月プラン</h3>
          </div>
          
          <FormField
            control={form.control as any}
            name="twelveMonthPlan.active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>有効にする</FormLabel>
                  <FormDescription>
                    このプランを有効にするかどうかを選択してください
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control as any}
            name="twelveMonthPlan.price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>価格（円/12ヶ月）</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10000" {...field} />
                </FormControl>
                <FormDescription>12ヶ月あたりの価格を円単位で入力してください</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 1年プラン */}
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h3 className="text-lg font-medium">1年プラン</h3>
          </div>
          
          <FormField
            control={form.control as any}
            name="yearlyPlan.active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>有効にする</FormLabel>
                  <FormDescription>
                    このプランを有効にするかどうかを選択してください
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control as any}
            name="yearlyPlan.price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>価格（円/年）</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10000" {...field} />
                </FormControl>
                <FormDescription>1年あたりの価格を円単位で入力してください</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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

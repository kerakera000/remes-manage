"use client"

import * as React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus } from "lucide-react"

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
import { PlanForm } from "./plan-form"

const planSchema = z.object({
  price: z.coerce.number().min(1, { message: "価格は1円以上で入力してください" }),
  interval: z.enum(["day", "week", "month", "year"], {
    required_error: "サブスクリプション間隔を選択してください",
  }),
  intervalCount: z.coerce.number().min(1, { message: "間隔の回数は1以上で入力してください" }),
})

const productFormSchema = z.object({
  name: z.string().min(1, { message: "商品名は必須です" }),
  description: z.string().optional(),
  stock: z.coerce.number().min(0, { message: "在庫数は0以上で入力してください" }),
  status: z.enum(["active", "draft", "archived"], {
    required_error: "ステータスを選択してください",
  }),
  plans: z.array(planSchema).min(1, { message: "少なくとも1つのプランが必要です" }),
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
      stock: 0,
      status: "draft",
      plans: [
        {
          price: 0,
          interval: "month",
          intervalCount: 1,
        }
      ],
    },
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "plans",
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

        <div>
          <h3 className="text-base font-medium mb-2">プラン</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <PlanForm
                key={field.id}
                form={form}
                index={index}
                onRemove={() => remove(index)}
                isRemoveDisabled={fields.length <= 1}
              />
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              append({
                price: 0,
                interval: "month",
                intervalCount: 1,
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            プランを追加
          </Button>
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

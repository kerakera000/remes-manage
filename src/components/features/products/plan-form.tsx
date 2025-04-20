"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface PlanFormProps {
  form: UseFormReturn<{
    name: string;
    description?: string;
    stock: number;
    status: "active" | "draft" | "archived";
    categories: string[];
    plans: {
      id?: string;
      price: number;
      type: "one_time" | "subscription";
      interval?: "day" | "week" | "month" | "year" | null;
    }[];
    mainImage?: string;
    subImages?: string[];
  }>;
  index: number;
  onRemove: () => void;
  isRemoveDisabled: boolean;
}

export function PlanForm({ form, index, onRemove, isRemoveDisabled }: PlanFormProps) {
  
  return (
    <div className="border p-4 rounded-md mb-4 relative">
      <div className="absolute top-2 right-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          disabled={isRemoveDisabled}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">プランを削除</span>
        </Button>
      </div>
      
      <h3 className="text-sm font-medium mb-4">プラン {index + 1}</h3>
      
      <FormField
        control={form.control}
        name={`plans.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>価格（円）</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1000" {...field} />
            </FormControl>
            <FormDescription>プランの価格を円単位で入力してください</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mt-4">
        <FormField
          control={form.control}
          name={`plans.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>プランタイプ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="タイプを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="one_time">単発購入</SelectItem>
                  <SelectItem value="subscription">サブスクリプション</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>単発購入かサブスクリプションかを選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {form.watch(`plans.${index}.type`) === "subscription" && (
        <div className="mt-4">
          <FormField
            control={form.control}
            name={`plans.${index}.interval`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>サブスクリプション間隔</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
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
        </div>
      )}
    </div>
  )
}

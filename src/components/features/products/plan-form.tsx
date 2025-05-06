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
      type: "subscription";
      interval: "month";
      subscription_period: 3 | 6 | 12;
    }[];
    mainImage?: string;
    subImages?: string[];
  }>;
  index: number;
  planLabel: string;
}

export function PlanForm({ form, index, planLabel }: PlanFormProps) {
  
  return (
    <div className="border p-4 rounded-md mb-4 relative">      
      <h3 className="text-sm font-medium mb-4">{planLabel}</h3>
      
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
          name={`plans.${index}.subscription_period`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>サブスクリプション期間</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="期間を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="3">3ヶ月</SelectItem>
                  <SelectItem value="6">6ヶ月</SelectItem>
                  <SelectItem value="12">12ヶ月</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>サブスクリプションの期間を選択してください（請求は毎月）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

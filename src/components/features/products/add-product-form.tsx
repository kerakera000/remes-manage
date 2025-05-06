"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, X } from "lucide-react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage, auth } from "@/lib/firebase"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { productStatuses, productCategories } from "@/app/products/data"
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
  type: z.literal("subscription"),
  interval: z.literal("month"),
  interval_count: z.union([
    z.literal(3),
    z.literal(6),
    z.literal(9)
  ], { required_error: "サブスクリプション期間を選択してください" }),
})

const productFormSchema = z.object({
  name: z.string().min(1, { message: "商品名は必須です" }),
  description: z.string().optional(),
  stock: z.coerce.number().min(0, { message: "在庫数は0以上で入力してください" }),
  status: z.enum(["active", "draft", "archived"], {
    required_error: "ステータスを選択してください",
  }),
  categories: z.array(z.string()).min(1, { message: "少なくとも1つのカテゴリを選択してください" }),
  plans: z.array(planSchema).min(1, { message: "少なくとも1つのプランが必要です" }),
  mainImage: z.string().optional(),
  subImages: z.array(z.string()).max(10, { message: "サブ画像は最大10枚までです" }).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function AddProductForm({ onSubmit, onCancel }: { 
  onSubmit: (values: ProductFormValues) => Promise<void>,
  onCancel: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<{ value: string; label: string }[]>(productCategories)
  const [newCategory, setNewCategory] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const subImagesInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileUpload = async (file: File, isMainImage: boolean) => {
    try {
      setIsUploading(true)
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `products/${fileName}`);
      
      if (!auth.currentUser) {
        throw new Error("認証されていません。ログインしてください。");
      }
      
      const snapshot = await uploadBytes(storageRef, file);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      if (isMainImage) {
        form.setValue("mainImage", downloadURL, { shouldValidate: true });
      } else {
        const currentSubImages = form.getValues("subImages") || [];
        form.setValue("subImages", [...currentSubImages, downloadURL], { shouldValidate: true });
      }
      
      return downloadURL;
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFileUpload(file, true);
    }
  };

  const handleSubImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const currentSubImages = form.getValues("subImages") || [];
      
      const remainingSlots = 10 - currentSubImages.length;
      const filesToUpload = files.slice(0, remainingSlots);
      
      await Promise.all(
        filesToUpload.map(file => handleFileUpload(file, false))
      );
    }
  };

  const handleRemoveSubImage = (index: number) => {
    const currentSubImages = form.getValues("subImages") || [];
    const updatedSubImages = [...currentSubImages];
    updatedSubImages.splice(index, 1);
    form.setValue("subImages", updatedSubImages, { shouldValidate: true });
  };
  
  const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-md shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-foreground">画像をアップロード中...</p>
      </div>
    </div>
  );
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      stock: 0,
      status: "draft",
      categories: [],
      plans: [
        {
          price: 0,
          type: "subscription",
          interval: "month",
          interval_count: 3,
        }
      ],
      mainImage: "",
      subImages: [],
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
          name="mainImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メイン画像</FormLabel>
              <div className="flex flex-col gap-4">
                <div 
                  className="border-2 border-dashed border-input rounded-md p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => mainImageInputRef.current?.click()}
                >
                  {field.value ? (
                    <div className="relative w-full h-40">
                      <img 
                        src={field.value} 
                        alt="メイン画像" 
                        className="w-full h-full object-contain" 
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("mainImage", "", { shouldValidate: true });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <div className="h-8 w-8 mb-2 text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">メイン画像をアップロード</p>
                      <p className="text-xs text-muted-foreground mt-1">クリックして選択、またはドラッグ&amp;ドロップ</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={mainImageInputRef}
                  onChange={handleMainImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <FormDescription>商品のメイン画像を設定してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サブ画像（最大10枚）</FormLabel>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* 現在のサブ画像を表示 */}
                  {(field.value || []).map((imgUrl, index) => (
                    <div 
                      key={index} 
                      className="relative border rounded-md h-32"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`サブ画像 ${index + 1}`} 
                        className="w-full h-full object-contain p-2" 
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                        onClick={() => handleRemoveSubImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* 新しい画像をアップロードするためのボタン（10枚以下の場合のみ表示） */}
                  {(field.value || []).length < 10 && (
                    <div 
                      className="border-2 border-dashed border-input rounded-md p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => subImagesInputRef.current?.click()}
                    >
                      <Plus className="h-6 w-6 mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground text-center">サブ画像を追加</p>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={subImagesInputRef}
                  onChange={handleSubImagesUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    {(field.value || []).length}/10枚
                  </span>
                  {(field.value || []).length > 0 && (
                    <button
                      type="button"
                      className="text-destructive hover:underline"
                      onClick={() => form.setValue("subImages", [], { shouldValidate: true })}
                    >
                      すべて削除
                    </button>
                  )}
                </div>
              </div>
              <FormDescription>商品の詳細を示すサブ画像を追加してください（最大10枚）</FormDescription>
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
          name="categories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">カテゴリ</FormLabel>
                <FormDescription>
                  商品のカテゴリを一つ以上選択してください
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {availableCategories.map((category) => (
                  <FormField
                    key={category.value}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.value)}
                              onCheckedChange={(checked) => {
                                const currentCategories = field.value || [];
                                return checked
                                  ? field.onChange([...currentCategories, category.value])
                                  : field.onChange(
                                      currentCategories.filter(
                                        (value) => value !== category.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 items-end mt-4">
          <Input 
            placeholder="新しいカテゴリ名"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="max-w-[200px]"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (newCategory.trim()) {
                const value = newCategory.toLowerCase().replace(/\s+/g, '-');
                if (!availableCategories.some(cat => cat.value === value)) {
                  setAvailableCategories([...availableCategories, { value, label: newCategory }]);
                  const currentCategories = form.getValues("categories") || [];
                  form.setValue("categories", [...currentCategories, value], { shouldValidate: true });
                }
                setNewCategory("");
              }
            }}
            disabled={!newCategory.trim()}
          >
            カテゴリを追加
          </Button>
        </div>

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
                type: "subscription",
                interval: "month",
                interval_count: 3,
              });
            }}
            disabled={fields.length >= 3}
          >
            <Plus className="h-4 w-4 mr-2" />
            プランを追加
          </Button>
          {fields.length >= 3 && (
            <p className="text-xs text-muted-foreground mt-2">プランは最大3つまで追加できます</p>
          )}
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
      {isUploading && <LoadingIndicator />}
    </Form>
  )
}
